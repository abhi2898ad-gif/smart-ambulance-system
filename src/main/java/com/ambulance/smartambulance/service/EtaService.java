package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.EtaResultDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EtaService {

    // Default assumed emergency vehicle average speed in urban traffic (km/h)
    private static final double DEFAULT_URBAN_SPEED_KMH = 40.0;
    // Dispatch dispatch reaction & prep buffer time (minutes)
    private static final int DISPATCH_BUFFER_MINUTES = 2;

    /**
     * Calculates distance using the Haversine formula and estimates arrival time.
     * Isolate this method so external traffic/maps APIs (Google Maps Distance Matrix, Mapbox, etc.)
     * can easily be plugged in.
     */
    public EtaResultDTO calculateEta(double originLat, double originLon, double destLat, double destLon) {
        double distanceKm = HospitalService.calculateHaversineDistance(originLat, originLon, destLat, destLon);

        // Travel time in minutes: (distance / speed) * 60 minutes + reaction buffer
        double travelHours = distanceKm / DEFAULT_URBAN_SPEED_KMH;
        int estimatedMinutes = (int) Math.ceil(travelHours * 60.0) + DISPATCH_BUFFER_MINUTES;

        // Ensure minimum 1 minute
        if (estimatedMinutes < 1) {
            estimatedMinutes = 1;
        }

        LocalDateTime arrivalTime = LocalDateTime.now().plusMinutes(estimatedMinutes);

        return EtaResultDTO.builder()
                .distanceKm(distanceKm)
                .estimatedMinutes(estimatedMinutes)
                .estimatedArrivalTime(arrivalTime)
                .build();
    }
}
