package com.ambulance.smartambulance.dto;

import java.time.LocalDateTime;

public class AmbulanceLocationResponseDTO {
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;

    public AmbulanceLocationResponseDTO() {
    }

    public AmbulanceLocationResponseDTO(Double latitude, Double longitude, LocalDateTime timestamp) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    public static AmbulanceLocationResponseDTOBuilder builder() {
        return new AmbulanceLocationResponseDTOBuilder();
    }

    public static class AmbulanceLocationResponseDTOBuilder {
        private Double latitude;
        private Double longitude;
        private LocalDateTime timestamp;

        public AmbulanceLocationResponseDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AmbulanceLocationResponseDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AmbulanceLocationResponseDTOBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public AmbulanceLocationResponseDTO build() {
            return new AmbulanceLocationResponseDTO(latitude, longitude, timestamp);
        }
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
