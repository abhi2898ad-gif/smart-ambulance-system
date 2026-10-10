package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.DemandLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "demand_predictions")
public class DemandPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private LocalDate predictionDate;

    @Column(nullable = false)
    private LocalTime predictionTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DemandLevel predictedDemand;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public DemandPrediction() {
    }

    public DemandPrediction(Long id, String area, LocalDate predictionDate, LocalTime predictionTime, DemandLevel predictedDemand, LocalDateTime createdAt) {
        this.id = id;
        this.area = area;
        this.predictionDate = predictionDate;
        this.predictionTime = predictionTime;
        this.predictedDemand = predictedDemand;
        this.createdAt = createdAt;
    }

    public static DemandPredictionBuilder builder() {
        return new DemandPredictionBuilder();
    }

    public static class DemandPredictionBuilder {
        private Long id;
        private String area;
        private LocalDate predictionDate;
        private LocalTime predictionTime;
        private DemandLevel predictedDemand;
        private LocalDateTime createdAt;

        public DemandPredictionBuilder id(Long id) { this.id = id; return this; }
        public DemandPredictionBuilder area(String area) { this.area = area; return this; }
        public DemandPredictionBuilder predictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; return this; }
        public DemandPredictionBuilder predictionTime(LocalTime predictionTime) { this.predictionTime = predictionTime; return this; }
        public DemandPredictionBuilder predictedDemand(DemandLevel predictedDemand) { this.predictedDemand = predictedDemand; return this; }
        public DemandPredictionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DemandPrediction build() {
            return new DemandPrediction(id, area, predictionDate, predictionTime, predictedDemand, createdAt);
        }
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
