package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.EmergencyResponseDTO;
import com.ambulance.smartambulance.dto.HospitalRequestDTO;
import com.ambulance.smartambulance.dto.HospitalResponseDTO;
import com.ambulance.smartambulance.entity.Hospital;
import com.ambulance.smartambulance.entity.enums.HospitalStatus;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.EmergencyRequestRepository;
import com.ambulance.smartambulance.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;

    public HospitalService(HospitalRepository hospitalRepository, EmergencyRequestRepository emergencyRequestRepository) {
        this.hospitalRepository = hospitalRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<HospitalResponseDTO>> getAllHospitals() {
        List<HospitalResponseDTO> list = hospitalRepository.findAll().stream()
                .map(HospitalResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Hospitals retrieved successfully", list);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<HospitalResponseDTO>> getAvailableHospitals() {
        List<HospitalStatus> activeStatuses = Arrays.asList(HospitalStatus.READY, HospitalStatus.BUSY);
        List<HospitalResponseDTO> list = hospitalRepository.findByStatusIn(activeStatuses).stream()
                .filter(h -> h.getCurrentEmergencyCount() < h.getEmergencyCapacity())
                .map(HospitalResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Available hospitals retrieved successfully", list);
    }

    @Transactional(readOnly = true)
    public ApiResponse<HospitalResponseDTO> getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return ApiResponse.success("Hospital retrieved successfully", HospitalResponseDTO.fromEntity(hospital));
    }

    @Transactional
    public ApiResponse<HospitalResponseDTO> createHospital(HospitalRequestDTO dto) {
        Hospital hospital = Hospital.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .emergencyCapacity(dto.getEmergencyCapacity())
                .currentEmergencyCount(dto.getCurrentEmergencyCount() != null ? dto.getCurrentEmergencyCount() : 0)
                .status(dto.getStatus() != null ? dto.getStatus() : HospitalStatus.READY)
                .build();

        Hospital saved = hospitalRepository.save(hospital);
        return ApiResponse.success("Hospital created successfully", HospitalResponseDTO.fromEntity(saved));
    }

    @Transactional
    public ApiResponse<HospitalResponseDTO> updateHospital(Long id, HospitalRequestDTO dto) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));

        if (dto.getName() != null) hospital.setName(dto.getName());
        if (dto.getAddress() != null) hospital.setAddress(dto.getAddress());
        if (dto.getPhone() != null) hospital.setPhone(dto.getPhone());
        if (dto.getLatitude() != null) hospital.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) hospital.setLongitude(dto.getLongitude());
        if (dto.getEmergencyCapacity() != null) hospital.setEmergencyCapacity(dto.getEmergencyCapacity());
        if (dto.getCurrentEmergencyCount() != null) hospital.setCurrentEmergencyCount(dto.getCurrentEmergencyCount());
        if (dto.getStatus() != null) hospital.setStatus(dto.getStatus());

        Hospital updated = hospitalRepository.save(hospital);
        return ApiResponse.success("Hospital updated successfully", HospitalResponseDTO.fromEntity(updated));
    }

    @Transactional
    public ApiResponse<Void> deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        hospitalRepository.delete(hospital);
        return ApiResponse.success("Hospital deleted successfully", null);
    }

    @Transactional
    public ApiResponse<HospitalResponseDTO> updateStatus(Long id, String statusStr) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));

        try {
            String upper = statusStr.toUpperCase().trim();
            if (upper.equals("ACCEPTING")) upper = "READY";
            if (upper.equals("DIVERTING")) upper = "BUSY";
            HospitalStatus newStatus = HospitalStatus.valueOf(upper);
            hospital.setStatus(newStatus);
            Hospital updated = hospitalRepository.save(hospital);
            return ApiResponse.success("Hospital status updated successfully", HospitalResponseDTO.fromEntity(updated));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid hospital status: " + statusStr);
        }
    }

    @Transactional
    public ApiResponse<HospitalResponseDTO> updateBeds(Long id, Integer availableBeds, Integer availableIcuBeds) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));

        if (availableBeds != null) {
            int used = Math.max(0, hospital.getEmergencyCapacity() - availableBeds);
            hospital.setCurrentEmergencyCount(used);
            if (used >= hospital.getEmergencyCapacity()) {
                hospital.setStatus(HospitalStatus.FULL);
            } else if (hospital.getStatus() == HospitalStatus.FULL) {
                hospital.setStatus(HospitalStatus.READY);
            }
        }
        Hospital updated = hospitalRepository.save(hospital);
        return ApiResponse.success("Hospital beds updated successfully", HospitalResponseDTO.fromEntity(updated));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<EmergencyResponseDTO>> getHospitalEmergencies(Long id) {
        List<EmergencyResponseDTO> emergencies = emergencyRequestRepository
                .findByHospitalIdOrderByRequestedAtDesc(id).stream()
                .map(EmergencyResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Hospital emergencies retrieved successfully", emergencies);
    }

    /**
     * Smart hospital selector based on location and capacity.
     * Selects closest hospital with READY or BUSY status and remaining capacity.
     */
    @Transactional
    public Optional<Hospital> findBestHospital(double emergencyLat, double emergencyLon) {
        List<HospitalStatus> allowableStatuses = Arrays.asList(HospitalStatus.READY, HospitalStatus.BUSY);
        List<Hospital> candidates = hospitalRepository.findByStatusIn(allowableStatuses);

        return candidates.stream()
                .filter(h -> h.getCurrentEmergencyCount() < h.getEmergencyCapacity())
                .min(Comparator.comparingDouble(h ->
                        calculateHaversineDistance(emergencyLat, emergencyLon, h.getLatitude(), h.getLongitude())
                ));
    }

    @Transactional
    public void incrementEmergencyCount(Hospital hospital) {
        hospital.setCurrentEmergencyCount(hospital.getCurrentEmergencyCount() + 1);
        if (hospital.getCurrentEmergencyCount() >= hospital.getEmergencyCapacity()) {
            hospital.setStatus(HospitalStatus.FULL);
        } else if (hospital.getStatus() == HospitalStatus.READY && hospital.getCurrentEmergencyCount() > 0) {
            hospital.setStatus(HospitalStatus.BUSY);
        }
        hospitalRepository.save(hospital);
    }

    @Transactional
    public void decrementEmergencyCount(Hospital hospital) {
        if (hospital.getCurrentEmergencyCount() > 0) {
            hospital.setCurrentEmergencyCount(hospital.getCurrentEmergencyCount() - 1);
        }
        if (hospital.getCurrentEmergencyCount() < hospital.getEmergencyCapacity() && hospital.getStatus() == HospitalStatus.FULL) {
            hospital.setStatus(HospitalStatus.BUSY);
        }
        if (hospital.getCurrentEmergencyCount() == 0 && hospital.getStatus() == HospitalStatus.BUSY) {
            hospital.setStatus(HospitalStatus.READY);
        }
        hospitalRepository.save(hospital);
    }

    public static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0; // rounded to 2 decimals
    }
}
