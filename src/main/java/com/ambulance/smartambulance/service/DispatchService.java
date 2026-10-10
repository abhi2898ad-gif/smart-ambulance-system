package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.AmbulanceType;
import com.ambulance.smartambulance.entity.enums.DriverStatus;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import com.ambulance.smartambulance.repository.AmbulanceRepository;
import com.ambulance.smartambulance.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DispatchService {

    private final AmbulanceRepository ambulanceRepository;
    private final DriverRepository driverRepository;
    private final EtaService etaService;

    public DispatchService(AmbulanceRepository ambulanceRepository, DriverRepository driverRepository, EtaService etaService) {
        this.ambulanceRepository = ambulanceRepository;
        this.driverRepository = driverRepository;
        this.etaService = etaService;
    }

    /**
     * Finds and assigns the most suitable ambulance based on availability, type preferences,
     * and geographic distance.
     */
    @Transactional
    public Optional<Ambulance> dispatchBestAmbulance(double emergencyLat, double emergencyLon, EmergencyPriority priority) {
        List<Ambulance> availableAmbulances = ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE);

        if (availableAmbulances.isEmpty()) {
            return Optional.empty();
        }

        List<AmbulanceType> preferredTypes = getPreferredTypes(priority);

        // Step 1: Look for ambulances matching preferred types
        Optional<Ambulance> bestPreferred = availableAmbulances.stream()
                .filter(amb -> preferredTypes.contains(amb.getAmbulanceType()))
                .min(Comparator.comparingDouble(amb ->
                        HospitalService.calculateHaversineDistance(amb.getLatitude(), amb.getLongitude(), emergencyLat, emergencyLon)
                ));

        Ambulance chosen;
        if (bestPreferred.isPresent()) {
            chosen = bestPreferred.get();
        } else {
            // Step 2: Fallback to the closest available ambulance of any type
            chosen = availableAmbulances.stream()
                    .min(Comparator.comparingDouble(amb ->
                            HospitalService.calculateHaversineDistance(amb.getLatitude(), amb.getLongitude(), emergencyLat, emergencyLon)
                    ))
                    .orElse(null);
        }

        if (chosen != null) {
            // Transition status: AVAILABLE -> ASSIGNED
            chosen.setStatus(AmbulanceStatus.ASSIGNED);
            if (chosen.getDriver() != null) {
                Driver driver = chosen.getDriver();
                driver.setStatus(DriverStatus.ASSIGNED);
                driverRepository.save(driver);
            }
            ambulanceRepository.save(chosen);
            return Optional.of(chosen);
        }

        return Optional.empty();
    }

    private List<AmbulanceType> getPreferredTypes(EmergencyPriority priority) {
        if (priority == null) {
            return Arrays.asList(AmbulanceType.BASIC, AmbulanceType.ADVANCED, AmbulanceType.ICU);
        }

        return switch (priority) {
            case CRITICAL -> Arrays.asList(AmbulanceType.ICU, AmbulanceType.ADVANCED);
            case HIGH -> Arrays.asList(AmbulanceType.ADVANCED, AmbulanceType.ICU, AmbulanceType.BASIC);
            case MEDIUM -> Arrays.asList(AmbulanceType.BASIC, AmbulanceType.ADVANCED);
            case LOW -> List.of(AmbulanceType.BASIC);
        };
    }
}
