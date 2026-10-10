package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.DemandPredictionResponseDTO;
import com.ambulance.smartambulance.entity.DemandPrediction;
import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.enums.DemandLevel;
import com.ambulance.smartambulance.repository.DemandPredictionRepository;
import com.ambulance.smartambulance.repository.EmergencyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    private final DemandPredictionRepository predictionRepository;
    private final EmergencyRequestRepository emergencyRepository;

    public PredictionService(DemandPredictionRepository predictionRepository, EmergencyRequestRepository emergencyRepository) {
        this.predictionRepository = predictionRepository;
        this.emergencyRepository = emergencyRepository;
    }

    /**
     * Algorithmic / historical demand predictor.
     * Evaluates prior incidents in the requested area to forecast demand tier (LOW, MEDIUM, HIGH).
     * Designed to be plug-and-play with future Python ML models (e.g. XGBoost, Prophet, or Random Forest).
     */
    @Transactional
    public ApiResponse<DemandPredictionResponseDTO> predictDemand(String area, LocalDate date, LocalTime time) {
        String cleanArea = (area != null && !area.isBlank()) ? area.trim() : "Downtown / Central";
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        LocalTime targetTime = (time != null) ? time : LocalTime.now();

        // Query historical incident records matching area keywords
        List<EmergencyRequest> allEmergencies = emergencyRepository.findAll();
        long historicalCount = allEmergencies.stream()
                .filter(e -> (e.getDescription() != null && e.getDescription().toLowerCase().contains(cleanArea.toLowerCase()))
                        || (e.getUser() != null && e.getUser().getAddress() != null && e.getUser().getAddress().toLowerCase().contains(cleanArea.toLowerCase())))
                .count();

        // Assess time-of-day peak weighting (peak hours: 08:00 - 11:00 and 17:00 - 21:00)
        int hour = targetTime.getHour();
        boolean isPeakHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21);

        DemandLevel demandLevel;
        double confidence;
        String rationale;

        if (historicalCount >= 4 || (historicalCount >= 2 && isPeakHour)) {
            demandLevel = DemandLevel.HIGH;
            confidence = 0.92;
            rationale = "High demand expected: elevated historical emergency volume in " + cleanArea + " combined with peak traffic time slot.";
        } else if (historicalCount >= 1 || isPeakHour) {
            demandLevel = DemandLevel.MEDIUM;
            confidence = 0.86;
            rationale = "Moderate demand expected: moderate historical pattern in " + cleanArea + ".";
        } else {
            demandLevel = DemandLevel.LOW;
            confidence = 0.80;
            rationale = "Low demand expected: low baseline emergency volume for " + cleanArea + ".";
        }

        DemandPrediction prediction = DemandPrediction.builder()
                .area(cleanArea)
                .predictionDate(targetDate)
                .predictionTime(targetTime)
                .predictedDemand(demandLevel)
                .createdAt(LocalDateTime.now())
                .build();

        DemandPrediction saved = predictionRepository.save(prediction);
        DemandPredictionResponseDTO responseDTO = DemandPredictionResponseDTO.fromEntity(saved, confidence, historicalCount, rationale);

        return ApiResponse.success("Demand prediction generated successfully", responseDTO);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<DemandPredictionResponseDTO>> getAllPredictions() {
        List<DemandPredictionResponseDTO> list = predictionRepository.findAll().stream()
                .map(p -> DemandPredictionResponseDTO.fromEntity(p, 0.88, 0L, "Historical baseline prediction"))
                .collect(Collectors.toList());
        return ApiResponse.success("Demand predictions retrieved successfully", list);
    }
}
