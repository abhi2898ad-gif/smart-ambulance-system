package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.enums.EmergencyPriority;

public class PriorityResultDTO {
    private EmergencyPriority priority;
    private Double confidence;
    private String rationale;

    public PriorityResultDTO() {
    }

    public PriorityResultDTO(EmergencyPriority priority, Double confidence, String rationale) {
        this.priority = priority;
        this.confidence = confidence;
        this.rationale = rationale;
    }

    public static PriorityResultDTOBuilder builder() {
        return new PriorityResultDTOBuilder();
    }

    public static class PriorityResultDTOBuilder {
        private EmergencyPriority priority;
        private Double confidence;
        private String rationale;

        public PriorityResultDTOBuilder priority(EmergencyPriority priority) { this.priority = priority; return this; }
        public PriorityResultDTOBuilder confidence(Double confidence) { this.confidence = confidence; return this; }
        public PriorityResultDTOBuilder rationale(String rationale) { this.rationale = rationale; return this; }

        public PriorityResultDTO build() {
            return new PriorityResultDTO(priority, confidence, rationale);
        }
    }

    public EmergencyPriority getPriority() { return priority; }
    public void setPriority(EmergencyPriority priority) { this.priority = priority; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }
}
