package com.ambulance.smartambulance.dto;

import java.time.LocalDateTime;

public class EtaResultDTO {
    private Double distanceKm;
    private Integer estimatedMinutes;
    private LocalDateTime estimatedArrivalTime;

    public EtaResultDTO() {
    }

    public EtaResultDTO(Double distanceKm, Integer estimatedMinutes, LocalDateTime estimatedArrivalTime) {
        this.distanceKm = distanceKm;
        this.estimatedMinutes = estimatedMinutes;
        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    public static EtaResultDTOBuilder builder() {
        return new EtaResultDTOBuilder();
    }

    public static class EtaResultDTOBuilder {
        private Double distanceKm;
        private Integer estimatedMinutes;
        private LocalDateTime estimatedArrivalTime;

        public EtaResultDTOBuilder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public EtaResultDTOBuilder estimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public EtaResultDTOBuilder estimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; return this; }

        public EtaResultDTO build() {
            return new EtaResultDTO(distanceKm, estimatedMinutes, estimatedArrivalTime);
        }
    }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public LocalDateTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }
}
