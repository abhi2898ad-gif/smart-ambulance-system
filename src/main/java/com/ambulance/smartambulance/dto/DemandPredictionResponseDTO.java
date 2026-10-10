package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.DemandPrediction;
import com.ambulance.smartambulance.entity.enums.DemandLevel;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DemandPredictionResponseDTO {
    private Long id;
    private String area;
    private LocalDate predictionDate;
    private LocalTime predictionTime;
    private DemandLevel predictedDemand;
    private Double confidence;
    private Long historicalEmergencyCount;
    private String rationale;
    private LocalDateTime createdAt;

    public DemandPredictionResponseDTO() {
    }

    public DemandPredictionResponseDTO(Long id, String area, LocalDate predictionDate, LocalTime predictionTime, DemandLevel predictedDemand, Double confidence, Long historicalEmergencyCount, String rationale, LocalDateTime createdAt) {
        this.id = id;
        this.area = area;
        this.predictionDate = predictionDate;
        this.predictionTime = predictionTime;
        this.predictedDemand = predictedDemand;
        this.confidence = confidence;
        this.historicalEmergencyCount = historicalEmergencyCount;
        this.rationale = rationale;
        this.createdAt = createdAt;
    }

    public static DemandPredictionResponseDTOBuilder builder() {
        return new DemandPredictionResponseDTOBuilder();
    }

    public static class DemandPredictionResponseDTOBuilder {
        private Long id;
        private String area;
        private LocalDate predictionDate;
        private LocalTime predictionTime;
        private DemandLevel predictedDemand;
        private Double confidence;
        private Long historicalEmergencyCount;
        private String rationale;
        private LocalDateTime createdAt;

        public DemandPredictionResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public DemandPredictionResponseDTOBuilder area(String area) { this.area = area; return this; }
        public DemandPredictionResponseDTOBuilder predictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; return this; }
        public DemandPredictionResponseDTOBuilder predictionTime(LocalTime predictionTime) { this.predictionTime = predictionTime; return this; }
        public DemandPredictionResponseDTOBuilder predictedDemand(DemandLevel predictedDemand) { this.predictedDemand = predictedDemand; return this; }
        public DemandPredictionResponseDTOBuilder confidence(Double confidence) { this.confidence = confidence; return this; }
        public DemandPredictionResponseDTOBuilder historicalEmergencyCount(Long historicalEmergencyCount) { this.historicalEmergencyCount = historicalEmergencyCount; return this; }
        public DemandPredictionResponseDTOBuilder rationale(String rationale) { this.rationale = rationale; return this; }
        public DemandPredictionResponseDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DemandPredictionResponseDTO build() {
            return new DemandPredictionResponseDTO(id, area, predictionDate, predictionTime, predictedDemand, confidence, historicalEmergencyCount, rationale, createdAt);
        }
    }

    public static DemandPredictionResponseDTO fromEntity(DemandPrediction prediction, Double confidence, Long historicalCount, String rationale) {
        if (prediction == null) return null;
        return DemandPredictionResponseDTO.builder()
                .id(prediction.getId())
                .area(prediction.getArea())
                .predictionDate(prediction.getPredictionDate())
                .predictionTime(prediction.getPredictionTime())
                .predictedDemand(prediction.getPredictedDemand())
                .confidence(confidence != null ? confidence : 0.88)
                .historicalEmergencyCount(historicalCount != null ? historicalCount : 0L)
                .rationale(rationale != null ? rationale : "Historical volume-based algorithmic prediction")
                .createdAt(prediction.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public LocalDate getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; }

    public LocalTime getPredictionTime() { return predictionTime; }
    public void setPredictionTime(LocalTime predictionTime) { this.predictionTime = predictionTime; }

    public DemandLevel getPredictedDemand() { return predictedDemand; }
    public void setPredictedDemand(DemandLevel predictedDemand) { this.predictedDemand = predictedDemand; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Long getHistoricalEmergencyCount() { return historicalEmergencyCount; }
    public void setHistoricalEmergencyCount(Long historicalEmergencyCount) { this.historicalEmergencyCount = historicalEmergencyCount; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
