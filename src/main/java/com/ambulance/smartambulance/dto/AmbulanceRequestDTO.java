package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.AmbulanceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AmbulanceRequestDTO {

    @NotBlank(message = "Ambulance number is required")
    private String ambulanceNumber;

    @NotNull(message = "Ambulance type is required")
    private AmbulanceType ambulanceType;

    private AmbulanceStatus status;

    private Double latitude;

    private Double longitude;

    private Long driverId;

    private Long hospitalId;

    public AmbulanceRequestDTO() {
    }

    public AmbulanceRequestDTO(String ambulanceNumber, AmbulanceType ambulanceType, AmbulanceStatus status, Double latitude, Double longitude, Long driverId, Long hospitalId) {
        this.ambulanceNumber = ambulanceNumber;
        this.ambulanceType = ambulanceType;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.driverId = driverId;
        this.hospitalId = hospitalId;
    }

    public static AmbulanceRequestDTOBuilder builder() {
        return new AmbulanceRequestDTOBuilder();
    }

    public static class AmbulanceRequestDTOBuilder {
        private String ambulanceNumber;
        private AmbulanceType ambulanceType;
        private AmbulanceStatus status;
        private Double latitude;
        private Double longitude;
        private Long driverId;
        private Long hospitalId;

        public AmbulanceRequestDTOBuilder ambulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; return this; }
        public AmbulanceRequestDTOBuilder ambulanceType(AmbulanceType ambulanceType) { this.ambulanceType = ambulanceType; return this; }
        public AmbulanceRequestDTOBuilder status(AmbulanceStatus status) { this.status = status; return this; }
        public AmbulanceRequestDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AmbulanceRequestDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AmbulanceRequestDTOBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public AmbulanceRequestDTOBuilder hospitalId(Long hospitalId) { this.hospitalId = hospitalId; return this; }

        public AmbulanceRequestDTO build() {
            return new AmbulanceRequestDTO(ambulanceNumber, ambulanceType, status, latitude, longitude, driverId, hospitalId);
        }
    }

    public String getAmbulanceNumber() { return ambulanceNumber; }
    public void setAmbulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; }

    public AmbulanceType getAmbulanceType() { return ambulanceType; }
    public void setAmbulanceType(AmbulanceType ambulanceType) { this.ambulanceType = ambulanceType; }

    public AmbulanceStatus getStatus() { return status; }
    public void setStatus(AmbulanceStatus status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public String getVehicleNumber() { return ambulanceNumber; }
    public void setVehicleNumber(String vehicleNumber) { if (this.ambulanceNumber == null || this.ambulanceNumber.isBlank()) this.ambulanceNumber = vehicleNumber; }
}
