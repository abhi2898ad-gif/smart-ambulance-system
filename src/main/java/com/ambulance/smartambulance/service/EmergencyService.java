package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Hospital;
import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.User;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.DriverStatus;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import com.ambulance.smartambulance.entity.enums.EmergencyStatus;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.AmbulanceRepository;
import com.ambulance.smartambulance.repository.EmergencyRequestRepository;
import com.ambulance.smartambulance.repository.HospitalRepository;
import com.ambulance.smartambulance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

    private final EmergencyRequestRepository emergencyRepository;
    private final UserRepository userRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final HospitalRepository hospitalRepository;
    private final PriorityService priorityService;
    private final DispatchService dispatchService;
    private final HospitalService hospitalService;
    private final EtaService etaService;

    public EmergencyService(EmergencyRequestRepository emergencyRepository, UserRepository userRepository, AmbulanceRepository ambulanceRepository, HospitalRepository hospitalRepository, PriorityService priorityService, DispatchService dispatchService, HospitalService hospitalService, EtaService etaService) {
        this.emergencyRepository = emergencyRepository;
        this.userRepository = userRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.hospitalRepository = hospitalRepository;
        this.priorityService = priorityService;
        this.dispatchService = dispatchService;
        this.hospitalService = hospitalService;
        this.etaService = etaService;
    }

    @Transactional
    public ApiResponse<EmergencyResponseDTO> createEmergency(EmergencyRequestDTO requestDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 1. Run AI Priority Service
        PriorityResultDTO priorityResult = priorityService.calculatePriority(requestDto);
        EmergencyPriority priority = priorityResult.getPriority();

        // 2. Build and save Emergency Request
        EmergencyRequest emergency = EmergencyRequest.builder()
                .user(user)
                .emergencyType(requestDto.getEmergencyType())
                .description(requestDto.getDescription())
                .severity(requestDto.getSeverity() != null ? requestDto.getSeverity() : priority.name())
                .priority(priority)
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .status(EmergencyStatus.PRIORITY_ASSIGNED)
                .requestedAt(LocalDateTime.now())
                .build();

        // 3. Dispatch best suitable ambulance
        Optional<Ambulance> dispatchedAmbulance = dispatchService.dispatchBestAmbulance(
                requestDto.getLatitude(),
                requestDto.getLongitude(),
                priority
        );

        // 4. Select best available hospital
        Optional<Hospital> bestHospital = hospitalService.findBestHospital(
                requestDto.getLatitude(),
                requestDto.getLongitude()
        );

        Double distanceKm = null;
        Integer estimatedMinutes = null;

        if (dispatchedAmbulance.isPresent()) {
            Ambulance amb = dispatchedAmbulance.get();
            emergency.setAmbulance(amb);
            emergency.setStatus(EmergencyStatus.AMBULANCE_ASSIGNED);
            emergency.setAssignedAt(LocalDateTime.now());

            // 5. Calculate ETA from ambulance to emergency location
            EtaResultDTO eta = etaService.calculateEta(
                    amb.getLatitude(),
                    amb.getLongitude(),
                    requestDto.getLatitude(),
                    requestDto.getLongitude()
            );
            emergency.setEstimatedArrivalTime(eta.getEstimatedArrivalTime());
            distanceKm = eta.getDistanceKm();
            estimatedMinutes = eta.getEstimatedMinutes();
        }

        if (bestHospital.isPresent()) {
            Hospital hosp = bestHospital.get();
            emergency.setHospital(hosp);
            hospitalService.incrementEmergencyCount(hosp);
        }

        EmergencyRequest saved = emergencyRepository.save(emergency);
        EmergencyResponseDTO responseDTO = EmergencyResponseDTO.fromEntity(saved);
        responseDTO.setDistanceKm(distanceKm);
        responseDTO.setEstimatedMinutes(estimatedMinutes);

        String message = dispatchedAmbulance.isPresent()
                ? "Emergency created, priority assigned (" + priority + "), ambulance dispatched"
                : "Emergency created, priority assigned (" + priority + "), awaiting ambulance availability";

        return ApiResponse.success(message, responseDTO);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<EmergencyResponseDTO>> getAllEmergencies() {
        List<EmergencyResponseDTO> list = emergencyRepository.findAll().stream()
                .sorted((a, b) -> b.getRequestedAt().compareTo(a.getRequestedAt()))
                .map(EmergencyResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Emergencies retrieved successfully", list);
    }

    @Transactional(readOnly = true)
    public ApiResponse<EmergencyResponseDTO> getEmergencyById(Long id) {
        EmergencyRequest emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));
        return ApiResponse.success("Emergency retrieved successfully", EmergencyResponseDTO.fromEntity(emergency));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<EmergencyResponseDTO>> getUserEmergencies(Long userId) {
        List<EmergencyResponseDTO> list = emergencyRepository.findByUserIdOrderByRequestedAtDesc(userId).stream()
                .map(EmergencyResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("User emergencies retrieved successfully", list);
    }

    @Transactional
    public ApiResponse<EmergencyResponseDTO> updateStatus(Long id, String statusStr) {
        EmergencyRequest emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        EmergencyStatus newStatus;
        try {
            newStatus = EmergencyStatus.valueOf(statusStr.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid emergency status: " + statusStr);
        }

        validateStatusTransition(emergency.getStatus(), newStatus);
        emergency.setStatus(newStatus);

        if (newStatus == EmergencyStatus.COMPLETED) {
            emergency.setCompletedAt(LocalDateTime.now());
            // Free ambulance & driver
            if (emergency.getAmbulance() != null) {
                Ambulance amb = emergency.getAmbulance();
                amb.setStatus(AmbulanceStatus.AVAILABLE);
                if (amb.getDriver() != null) {
                    amb.getDriver().setStatus(DriverStatus.AVAILABLE);
                }
                ambulanceRepository.save(amb);
            }
            // Decrement hospital count
            if (emergency.getHospital() != null) {
                hospitalService.decrementEmergencyCount(emergency.getHospital());
            }
        }

        EmergencyRequest updated = emergencyRepository.save(emergency);
        return ApiResponse.success("Emergency status updated to " + newStatus, EmergencyResponseDTO.fromEntity(updated));
    }

    @Transactional
    public ApiResponse<EmergencyResponseDTO> assignAmbulanceManually(Long id, AmbulanceAssignmentDTO dto) {
        EmergencyRequest emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        Ambulance ambulance = ambulanceRepository.findById(dto.getAmbulanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + dto.getAmbulanceId()));

        ambulance.setStatus(AmbulanceStatus.ASSIGNED);
        if (ambulance.getDriver() != null) {
            ambulance.getDriver().setStatus(DriverStatus.ASSIGNED);
        }
        ambulanceRepository.save(ambulance);

        emergency.setAmbulance(ambulance);
        emergency.setStatus(EmergencyStatus.AMBULANCE_ASSIGNED);
        emergency.setAssignedAt(LocalDateTime.now());

        if (dto.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + dto.getHospitalId()));
            emergency.setHospital(hospital);
            hospitalService.incrementEmergencyCount(hospital);
        }

        EtaResultDTO eta = etaService.calculateEta(
                ambulance.getLatitude(),
                ambulance.getLongitude(),
                emergency.getLatitude(),
                emergency.getLongitude()
        );
        emergency.setEstimatedArrivalTime(eta.getEstimatedArrivalTime());

        EmergencyRequest saved = emergencyRepository.save(emergency);
        EmergencyResponseDTO res = EmergencyResponseDTO.fromEntity(saved);
        res.setDistanceKm(eta.getDistanceKm());
        res.setEstimatedMinutes(eta.getEstimatedMinutes());

        return ApiResponse.success("Ambulance assigned successfully", res);
    }

    @Transactional
    public ApiResponse<EmergencyResponseDTO> cancelEmergency(Long id, Long currentUserId, boolean isAdmin) {
        EmergencyRequest emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));

        if (!isAdmin && !emergency.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to cancel this emergency request");
        }

        if (emergency.getStatus() == EmergencyStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel an already completed emergency");
        }
        if (emergency.getStatus() == EmergencyStatus.CANCELLED) {
            throw new BadRequestException("Emergency is already cancelled");
        }

        emergency.setStatus(EmergencyStatus.CANCELLED);

        // Free ambulance and driver if assigned
        if (emergency.getAmbulance() != null) {
            Ambulance amb = emergency.getAmbulance();
            amb.setStatus(AmbulanceStatus.AVAILABLE);
            if (amb.getDriver() != null) {
                amb.getDriver().setStatus(DriverStatus.AVAILABLE);
            }
            ambulanceRepository.save(amb);
        }

        // Release hospital slot
        if (emergency.getHospital() != null) {
            hospitalService.decrementEmergencyCount(emergency.getHospital());
        }

        EmergencyRequest saved = emergencyRepository.save(emergency);
        return ApiResponse.success("Emergency cancelled successfully", EmergencyResponseDTO.fromEntity(saved));
    }

    private void validateStatusTransition(EmergencyStatus current, EmergencyStatus target) {
        if (current == target) return;

        if (current == EmergencyStatus.COMPLETED || current == EmergencyStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status from terminal state: " + current);
        }

        if (target == EmergencyStatus.CANCELLED) {
            return; // Can cancel from any active non-completed state
        }

        // Enforce valid progression flow
        boolean valid = switch (current) {
            case REQUESTED, PENDING -> target == EmergencyStatus.PRIORITY_ASSIGNED || target == EmergencyStatus.AMBULANCE_ASSIGNED || target == EmergencyStatus.ASSIGNED || target == EmergencyStatus.EN_ROUTE;
            case PRIORITY_ASSIGNED -> target == EmergencyStatus.AMBULANCE_ASSIGNED || target == EmergencyStatus.ASSIGNED || target == EmergencyStatus.EN_ROUTE;
            case AMBULANCE_ASSIGNED, ASSIGNED -> target == EmergencyStatus.EN_ROUTE || target == EmergencyStatus.ARRIVED;
            case EN_ROUTE -> target == EmergencyStatus.ARRIVED || target == EmergencyStatus.PATIENT_PICKED || target == EmergencyStatus.IN_TRANSIT;
            case ARRIVED -> target == EmergencyStatus.PATIENT_PICKED || target == EmergencyStatus.IN_TRANSIT || target == EmergencyStatus.AT_HOSPITAL;
            case PATIENT_PICKED, IN_TRANSIT -> target == EmergencyStatus.AT_HOSPITAL || target == EmergencyStatus.COMPLETED;
            case AT_HOSPITAL -> target == EmergencyStatus.COMPLETED;
            case COMPLETED, CANCELLED -> false;
            default -> true;
        };

        if (!valid) {
            throw new BadRequestException("Invalid status transition from " + current + " to " + target);
        }
    }
}
