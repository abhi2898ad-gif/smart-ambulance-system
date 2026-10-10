package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.TripResponseDTO;
import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.Trip;
import com.ambulance.smartambulance.entity.enums.*;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.AmbulanceRepository;
import com.ambulance.smartambulance.repository.DriverRepository;
import com.ambulance.smartambulance.repository.EmergencyRequestRepository;
import com.ambulance.smartambulance.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final DriverRepository driverRepository;
    private final HospitalService hospitalService;

    public TripService(TripRepository tripRepository, EmergencyRequestRepository emergencyRepository, AmbulanceRepository ambulanceRepository, DriverRepository driverRepository, HospitalService hospitalService) {
        this.tripRepository = tripRepository;
        this.emergencyRepository = emergencyRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.driverRepository = driverRepository;
        this.hospitalService = hospitalService;
    }

    @Transactional
    public ApiResponse<TripResponseDTO> startTrip(Long emergencyId) {
        EmergencyRequest emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + emergencyId));

        if (emergency.getAmbulance() == null) {
            throw new BadRequestException("No ambulance assigned to this emergency request");
        }

        Ambulance ambulance = emergency.getAmbulance();
        Driver driver = ambulance.getDriver();
        if (driver == null) {
            throw new BadRequestException("No driver assigned to ambulance " + ambulance.getAmbulanceNumber());
        }

        // Check if an active trip already exists
        if (tripRepository.findByEmergencyId(emergencyId).isPresent()) {
            throw new BadRequestException("A trip already exists for emergency id: " + emergencyId);
        }

        // Update statuses
        ambulance.setStatus(AmbulanceStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        emergency.setStatus(EmergencyStatus.EN_ROUTE);

        ambulanceRepository.save(ambulance);
        driverRepository.save(driver);
        emergencyRepository.save(emergency);

        // Calculate initial distance between ambulance and emergency
        double distance = HospitalService.calculateHaversineDistance(
                ambulance.getLatitude(), ambulance.getLongitude(),
                emergency.getLatitude(), emergency.getLongitude()
        );

        Trip trip = Trip.builder()
                .emergency(emergency)
                .ambulance(ambulance)
                .driver(driver)
                .startTime(LocalDateTime.now())
                .distance(distance)
                .status(TripStatus.EN_ROUTE)
                .build();

        Trip saved = tripRepository.save(trip);
        return ApiResponse.success("Trip started successfully", TripResponseDTO.fromEntity(saved));
    }

    @Transactional
    public ApiResponse<TripResponseDTO> updateTripStatus(Long tripId, String actionOrStatus) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        EmergencyRequest emergency = trip.getEmergency();
        String action = actionOrStatus.toUpperCase().trim();

        switch (action) {
            case "ARRIVED" -> {
                trip.setStatus(TripStatus.ARRIVED);
                emergency.setStatus(EmergencyStatus.ARRIVED);
            }
            case "PATIENT_PICKED" -> {
                trip.setStatus(TripStatus.PATIENT_PICKED);
                emergency.setStatus(EmergencyStatus.PATIENT_PICKED);
            }
            case "AT_HOSPITAL" -> {
                trip.setStatus(TripStatus.AT_HOSPITAL);
                emergency.setStatus(EmergencyStatus.AT_HOSPITAL);
            }
            default -> throw new BadRequestException("Unsupported trip action: " + actionOrStatus);
        }

        emergencyRepository.save(emergency);
        Trip saved = tripRepository.save(trip);
        return ApiResponse.success("Trip progress updated to " + trip.getStatus(), TripResponseDTO.fromEntity(saved));
    }

    @Transactional
    public ApiResponse<TripResponseDTO> completeTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new BadRequestException("Trip is already completed");
        }

        LocalDateTime now = LocalDateTime.now();
        trip.setEndTime(now);
        trip.setStatus(TripStatus.COMPLETED);

        if (trip.getStartTime() != null) {
            long minutes = Duration.between(trip.getStartTime(), now).toMinutes();
            trip.setDuration(Math.max(1, minutes));
        }

        // Release ambulance & driver
        Ambulance ambulance = trip.getAmbulance();
        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulanceRepository.save(ambulance);

        Driver driver = trip.getDriver();
        driver.setStatus(DriverStatus.AVAILABLE);
        driverRepository.save(driver);

        // Update emergency
        EmergencyRequest emergency = trip.getEmergency();
        emergency.setStatus(EmergencyStatus.COMPLETED);
        emergency.setCompletedAt(now);
        emergencyRepository.save(emergency);

        // Decrement hospital active emergency count
        if (emergency.getHospital() != null) {
            hospitalService.decrementEmergencyCount(emergency.getHospital());
        }

        Trip saved = tripRepository.save(trip);
        return ApiResponse.success("Trip completed successfully", TripResponseDTO.fromEntity(saved));
    }

    @Transactional(readOnly = true)
    public ApiResponse<TripResponseDTO> getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        return ApiResponse.success("Trip retrieved successfully", TripResponseDTO.fromEntity(trip));
    }

    @Transactional(readOnly = true)
    public ApiResponse<TripResponseDTO> getTripByEmergencyId(Long emergencyId) {
        Trip trip = tripRepository.findByEmergencyId(emergencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found for emergency id: " + emergencyId));
        return ApiResponse.success("Trip retrieved successfully", TripResponseDTO.fromEntity(trip));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<TripResponseDTO>> getAllTrips() {
        List<TripResponseDTO> list = tripRepository.findAll().stream()
                .sorted((a, b) -> (b.getStartTime() != null && a.getStartTime() != null)
                        ? b.getStartTime().compareTo(a.getStartTime()) : 0)
                .map(TripResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Trips retrieved successfully", list);
    }
}
