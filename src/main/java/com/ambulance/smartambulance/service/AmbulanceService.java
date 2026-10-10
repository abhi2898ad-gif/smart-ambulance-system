package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.AmbulanceLocationResponseDTO;
import com.ambulance.smartambulance.dto.AmbulanceRequestDTO;
import com.ambulance.smartambulance.dto.AmbulanceResponseDTO;
import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.LocationUpdateDTO;
import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.Hospital;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.AmbulanceRepository;
import com.ambulance.smartambulance.repository.DriverRepository;
import com.ambulance.smartambulance.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;
    private final DriverRepository driverRepository;
    private final HospitalRepository hospitalRepository;

    public AmbulanceService(AmbulanceRepository ambulanceRepository, DriverRepository driverRepository, HospitalRepository hospitalRepository) {
        this.ambulanceRepository = ambulanceRepository;
        this.driverRepository = driverRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<AmbulanceResponseDTO>> getAllAmbulances() {
        List<AmbulanceResponseDTO> ambulances = ambulanceRepository.findAll().stream()
                .map(AmbulanceResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Ambulances retrieved successfully", ambulances);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<AmbulanceResponseDTO>> getAvailableAmbulances() {
        List<AmbulanceResponseDTO> ambulances = ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE).stream()
                .map(AmbulanceResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Available ambulances retrieved successfully", ambulances);
    }

    @Transactional(readOnly = true)
    public ApiResponse<AmbulanceResponseDTO> getAmbulanceById(Long id) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));
        return ApiResponse.success("Ambulance retrieved successfully", AmbulanceResponseDTO.fromEntity(ambulance));
    }

    @Transactional
    public ApiResponse<AmbulanceResponseDTO> createAmbulance(AmbulanceRequestDTO dto) {
        if (ambulanceRepository.findByAmbulanceNumber(dto.getAmbulanceNumber()).isPresent()) {
            throw new BadRequestException("Ambulance number already exists: " + dto.getAmbulanceNumber());
        }

        Driver driver = null;
        if (dto.getDriverId() != null) {
            driver = driverRepository.findById(dto.getDriverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + dto.getDriverId()));
        }

        Hospital hospital = null;
        if (dto.getHospitalId() != null) {
            hospital = hospitalRepository.findById(dto.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + dto.getHospitalId()));
        }

        Ambulance ambulance = Ambulance.builder()
                .ambulanceNumber(dto.getAmbulanceNumber())
                .ambulanceType(dto.getAmbulanceType())
                .status(dto.getStatus() != null ? dto.getStatus() : AmbulanceStatus.AVAILABLE)
                .latitude(dto.getLatitude() != null ? dto.getLatitude() : 17.3850)
                .longitude(dto.getLongitude() != null ? dto.getLongitude() : 78.4867)
                .driver(driver)
                .hospital(hospital)
                .build();

        Ambulance saved = ambulanceRepository.save(ambulance);
        return ApiResponse.success("Ambulance created successfully", AmbulanceResponseDTO.fromEntity(saved));
    }

    @Transactional
    public ApiResponse<AmbulanceResponseDTO> updateAmbulance(Long id, AmbulanceRequestDTO dto) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));

        if (dto.getAmbulanceNumber() != null && !dto.getAmbulanceNumber().equals(ambulance.getAmbulanceNumber())) {
            if (ambulanceRepository.findByAmbulanceNumber(dto.getAmbulanceNumber()).isPresent()) {
                throw new BadRequestException("Ambulance number already exists: " + dto.getAmbulanceNumber());
            }
            ambulance.setAmbulanceNumber(dto.getAmbulanceNumber());
        }

        if (dto.getAmbulanceType() != null) {
            ambulance.setAmbulanceType(dto.getAmbulanceType());
        }

        if (dto.getStatus() != null) {
            ambulance.setStatus(dto.getStatus());
        }

        if (dto.getLatitude() != null) {
            ambulance.setLatitude(dto.getLatitude());
        }

        if (dto.getLongitude() != null) {
            ambulance.setLongitude(dto.getLongitude());
        }

        if (dto.getDriverId() != null) {
            Driver driver = driverRepository.findById(dto.getDriverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + dto.getDriverId()));
            ambulance.setDriver(driver);
        }

        if (dto.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + dto.getHospitalId()));
            ambulance.setHospital(hospital);
        }

        Ambulance updated = ambulanceRepository.save(ambulance);
        return ApiResponse.success("Ambulance updated successfully", AmbulanceResponseDTO.fromEntity(updated));
    }

    @Transactional
    public ApiResponse<Void> deleteAmbulance(Long id) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));
        ambulanceRepository.delete(ambulance);
        return ApiResponse.success("Ambulance deleted successfully", null);
    }

    @Transactional
    public ApiResponse<AmbulanceResponseDTO> updateStatus(Long id, String statusStr) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));

        try {
            AmbulanceStatus newStatus = AmbulanceStatus.valueOf(statusStr.toUpperCase().trim());
            ambulance.setStatus(newStatus);
            Ambulance updated = ambulanceRepository.save(ambulance);
            return ApiResponse.success("Ambulance status updated successfully", AmbulanceResponseDTO.fromEntity(updated));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid ambulance status: " + statusStr);
        }
    }

    @Transactional
    public ApiResponse<AmbulanceResponseDTO> updateLocation(Long id, LocationUpdateDTO dto) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));

        ambulance.setLatitude(dto.getLatitude());
        ambulance.setLongitude(dto.getLongitude());
        Ambulance updated = ambulanceRepository.save(ambulance);

        return ApiResponse.success("Ambulance location updated successfully", AmbulanceResponseDTO.fromEntity(updated));
    }

    @Transactional(readOnly = true)
    public ApiResponse<AmbulanceLocationResponseDTO> getLocation(Long id) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));

        AmbulanceLocationResponseDTO location = AmbulanceLocationResponseDTO.builder()
                .latitude(ambulance.getLatitude())
                .longitude(ambulance.getLongitude())
                .timestamp(LocalDateTime.now())
                .build();

        return ApiResponse.success("Ambulance location retrieved successfully", location);
    }
}
