package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.Trip;
import com.ambulance.smartambulance.entity.enums.DriverStatus;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.AmbulanceRepository;
import com.ambulance.smartambulance.repository.DriverRepository;
import com.ambulance.smartambulance.repository.EmergencyRequestRepository;
import com.ambulance.smartambulance.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;
    private final TripRepository tripRepository;

    public DriverService(DriverRepository driverRepository, AmbulanceRepository ambulanceRepository, EmergencyRequestRepository emergencyRequestRepository, TripRepository tripRepository) {
        this.driverRepository = driverRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<DriverResponseDTO>> getAllDrivers() {
        List<DriverResponseDTO> drivers = driverRepository.findAll().stream()
                .map(driver -> {
                    Ambulance assigned = ambulanceRepository.findByDriverId(driver.getId()).orElse(null);
                    return DriverResponseDTO.fromEntity(driver, assigned);
                })
                .collect(Collectors.toList());
        return ApiResponse.success("Drivers retrieved successfully", drivers);
    }

    @Transactional(readOnly = true)
    public ApiResponse<DriverResponseDTO> getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        Ambulance assigned = ambulanceRepository.findByDriverId(driver.getId()).orElse(null);
        return ApiResponse.success("Driver retrieved successfully", DriverResponseDTO.fromEntity(driver, assigned));
    }

    @Transactional
    public ApiResponse<DriverResponseDTO> updateStatus(Long id, String statusStr) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        try {
            DriverStatus status = DriverStatus.valueOf(statusStr.toUpperCase().trim());
            driver.setStatus(status);
            Driver saved = driverRepository.save(driver);
            Ambulance assigned = ambulanceRepository.findByDriverId(saved.getId()).orElse(null);
            return ApiResponse.success("Driver status updated successfully", DriverResponseDTO.fromEntity(saved, assigned));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid driver status: " + statusStr);
        }
    }

    @Transactional
    public ApiResponse<DriverResponseDTO> updateLocation(Long id, LocationUpdateDTO dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        driver.setCurrentLatitude(dto.getLatitude());
        driver.setCurrentLongitude(dto.getLongitude());
        Driver saved = driverRepository.save(driver);

        // Update assigned ambulance location as well
        Optional<Ambulance> assignedAmbulanceOpt = ambulanceRepository.findByDriverId(driver.getId());
        assignedAmbulanceOpt.ifPresent(ambulance -> {
            ambulance.setLatitude(dto.getLatitude());
            ambulance.setLongitude(dto.getLongitude());
            ambulanceRepository.save(ambulance);
        });

        return ApiResponse.success("Driver and ambulance location updated successfully",
                DriverResponseDTO.fromEntity(saved, assignedAmbulanceOpt.orElse(null)));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<EmergencyResponseDTO>> getDriverEmergencies(Long id) {
        Optional<Ambulance> ambulanceOpt = ambulanceRepository.findByDriverId(id);
        if (ambulanceOpt.isEmpty()) {
            return ApiResponse.success("No emergencies found for driver without assigned ambulance", Collections.emptyList());
        }

        List<EmergencyResponseDTO> emergencies = emergencyRequestRepository
                .findByAmbulanceIdOrderByRequestedAtDesc(ambulanceOpt.get().getId()).stream()
                .map(EmergencyResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success("Emergencies retrieved successfully", emergencies);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<TripResponseDTO>> getDriverTrips(Long id) {
        List<TripResponseDTO> trips = tripRepository.findByDriverIdOrderByStartTimeDesc(id).stream()
                .map(TripResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Driver trips retrieved successfully", trips);
    }
}
