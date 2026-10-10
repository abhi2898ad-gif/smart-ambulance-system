package com.ambulance.smartambulance.dto;

import jakarta.validation.constraints.NotNull;

public class LocationUpdateDTO {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    public LocationUpdateDTO() {
    }

    public LocationUpdateDTO(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static LocationUpdateDTOBuilder builder() {
        return new LocationUpdateDTOBuilder();
    }

    public static class LocationUpdateDTOBuilder {
        private Double latitude;
        private Double longitude;

        public LocationUpdateDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public LocationUpdateDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }

        public LocationUpdateDTO build() {
            return new LocationUpdateDTO(latitude, longitude);
        }
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
