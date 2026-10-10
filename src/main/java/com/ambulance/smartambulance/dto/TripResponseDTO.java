package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.Trip;
import com.ambulance.smartambulance.entity.enums.TripStatus;

import java.time.LocalDateTime;

public class TripResponseDTO {
    private Long id;
    private Long emergencyId;
    private Long ambulanceId;
    private String ambulanceNumber;
    private Long driverId;
    private String driverName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double distance;
    private Long duration;
    private TripStatus status;

    public TripResponseDTO() {
    }

    public TripResponseDTO(Long id, Long emergencyId, Long ambulanceId, String ambulanceNumber, Long driverId, String driverName, LocalDateTime startTime, LocalDateTime endTime, Double distance, Long duration, TripStatus status) {
        this.id = id;
        this.emergencyId = emergencyId;
        this.ambulanceId = ambulanceId;
        this.ambulanceNumber = ambulanceNumber;
        this.driverId = driverId;
        this.driverName = driverName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.distance = distance;
        this.duration = duration;
        this.status = status;
    }

    public static TripResponseDTOBuilder builder() {
        return new TripResponseDTOBuilder();
    }

    public static class TripResponseDTOBuilder {
        private Long id;
        private Long emergencyId;
        private Long ambulanceId;
        private String ambulanceNumber;
        private Long driverId;
        private String driverName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Double distance;
        private Long duration;
        private TripStatus status;

        public TripResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public TripResponseDTOBuilder emergencyId(Long emergencyId) { this.emergencyId = emergencyId; return this; }
        public TripResponseDTOBuilder ambulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; return this; }
        public TripResponseDTOBuilder ambulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; return this; }
        public TripResponseDTOBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public TripResponseDTOBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public TripResponseDTOBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public TripResponseDTOBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public TripResponseDTOBuilder distance(Double distance) { this.distance = distance; return this; }
        public TripResponseDTOBuilder duration(Long duration) { this.duration = duration; return this; }
        public TripResponseDTOBuilder status(TripStatus status) { this.status = status; return this; }

        public TripResponseDTO build() {
            return new TripResponseDTO(id, emergencyId, ambulanceId, ambulanceNumber, driverId, driverName, startTime, endTime, distance, duration, status);
        }
    }

    public static TripResponseDTO fromEntity(Trip trip) {
        if (trip == null) return null;
        return TripResponseDTO.builder()
                .id(trip.getId())
                .emergencyId(trip.getEmergency() != null ? trip.getEmergency().getId() : null)
                .ambulanceId(trip.getAmbulance() != null ? trip.getAmbulance().getId() : null)
                .ambulanceNumber(trip.getAmbulance() != null ? trip.getAmbulance().getAmbulanceNumber() : null)
                .driverId(trip.getDriver() != null ? trip.getDriver().getId() : null)
                .driverName(trip.getDriver() != null && trip.getDriver().getUser() != null ? trip.getDriver().getUser().getName() : null)
                .startTime(trip.getStartTime())
                .endTime(trip.getEndTime())
                .distance(trip.getDistance())
                .duration(trip.getDuration())
                .status(trip.getStatus())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmergencyId() { return emergencyId; }
    public void setEmergencyId(Long emergencyId) { this.emergencyId = emergencyId; }

    public Long getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; }

    public String getAmbulanceNumber() { return ambulanceNumber; }
    public void setAmbulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
}
