package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.EmergencyRequestDTO;
import com.ambulance.smartambulance.dto.PriorityResultDTO;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import org.springframework.stereotype.Service;

@Service
public class PriorityService {

    /**
     * AI Priority Evaluation Service.
     * Evaluates emergency inputs using medical emergency rules.
     * Designed as an isolated service so a trained ML model (e.g., Python/TensorFlow/ONNX)
     * can easily substitute or augment this implementation.
     */
    public PriorityResultDTO calculatePriority(EmergencyRequestDTO request) {
        boolean unconscious = Boolean.TRUE.equals(request.getIsUnconscious());
        boolean bleeding = Boolean.TRUE.equals(request.getHasSevereBleeding());
        boolean breathing = Boolean.TRUE.equals(request.getHasBreathingDifficulty());
        boolean accident = Boolean.TRUE.equals(request.getIsMajorAccident());
        boolean chestPain = Boolean.TRUE.equals(request.getIsChestPain());
        boolean severeBurn = Boolean.TRUE.equals(request.getIsSevereBurn());

        String type = request.getEmergencyType() != null ? request.getEmergencyType().toUpperCase() : "";
        String desc = request.getDescription() != null ? request.getDescription().toLowerCase() : "";
        String severity = request.getSeverity() != null ? request.getSeverity().toUpperCase() : "";

        // Check for CRITICAL criteria
        if (unconscious || bleeding || breathing || accident ||
                severity.contains("CRITICAL") ||
                desc.contains("unconscious") || desc.contains("cardiac arrest") ||
                desc.contains("heart attack") || desc.contains("severe bleeding") ||
                desc.contains("can't breathe") || desc.contains("heavy collision")) {
            return PriorityResultDTO.builder()
                    .priority(EmergencyPriority.CRITICAL)
                    .confidence(0.96)
                    .rationale("Critical emergency: life-threatening symptoms detected (unconscious / severe trauma / respiratory or cardiac failure)")
                    .build();
        }

        // Check for HIGH criteria
        if (chestPain || severeBurn || severity.contains("HIGH") ||
                type.contains("CARDIAC") || type.contains("STROKE") ||
                desc.contains("chest pain") || desc.contains("burn") ||
                desc.contains("fracture") || desc.contains("head injury") ||
                (request.getPatientAge() != null && request.getPatientAge() > 70 && breathing)) {
            return PriorityResultDTO.builder()
                    .priority(EmergencyPriority.HIGH)
                    .confidence(0.90)
                    .rationale("High priority: serious acute medical condition requiring urgent intervention")
                    .build();
        }

        // Check for MEDIUM criteria
        if (severity.contains("MEDIUM") || severity.contains("MODERATE") ||
                desc.contains("fever") || desc.contains("moderate pain") ||
                desc.contains("wound") || desc.contains("vomiting") || desc.contains("dizziness")) {
            return PriorityResultDTO.builder()
                    .priority(EmergencyPriority.MEDIUM)
                    .confidence(0.85)
                    .rationale("Medium priority: stable vital signs with moderate discomfort")
                    .build();
        }

        // Default to LOW criteria
        return PriorityResultDTO.builder()
                .priority(EmergencyPriority.LOW)
                .confidence(0.80)
                .rationale("Low priority: non-emergency transfer or minor non-acute symptoms")
                .build();
    }
}
