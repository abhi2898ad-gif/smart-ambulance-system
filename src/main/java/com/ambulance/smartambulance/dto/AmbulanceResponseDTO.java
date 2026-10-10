package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.AmbulanceType;

public class AmbulanceResponseDTO {
    private Long id;
    private String ambulanceNumber;
    private AmbulanceType ambulanceType;
    private AmbulanceStatus status;
    private Double latitude;
    private Double longitude;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Long hospitalId;
    private String hospitalName;

    public AmbulanceResponseDTO() {
    }

    public AmbulanceResponseDTO(Long id, String ambulanceNumber, AmbulanceType ambulanceType, AmbulanceStatus status, Double latitude, Double longitude, Long driverId, String driverName, String driverPhone, Long hospitalId, String hospitalName) {
        this.id = id;
        this.ambulanceNumber = ambulanceNumber;
        this.ambulanceType = ambulanceType;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
    }

    public static AmbulanceResponseDTOBuilder builder() {
        return new AmbulanceResponseDTOBuilder();
    }

    public static class AmbulanceResponseDTOBuilder {
        private Long id;
        private String ambulanceNumber;
        private AmbulanceType ambulanceType;
        private AmbulanceStatus status;
        private Double latitude;
        private Double longitude;
        private Long driverId;
        private String driverName;
        private String driverPhone;
        private Long hospitalId;
        private String hospitalName;

        public AmbulanceResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public AmbulanceResponseDTOBuilder ambulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; return this; }
        public AmbulanceResponseDTOBuilder ambulanceType(AmbulanceType ambulanceType) { this.ambulanceType = ambulanceType; return this; }
        public AmbulanceResponseDTOBuilder status(AmbulanceStatus status) { this.status = status; return this; }
        public AmbulanceResponseDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AmbulanceResponseDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AmbulanceResponseDTOBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public AmbulanceResponseDTOBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public AmbulanceResponseDTOBuilder driverPhone(String driverPhone) { this.driverPhone = driverPhone; return this; }
        public AmbulanceResponseDTOBuilder hospitalId(Long hospitalId) { this.hospitalId = hospitalId; return this; }
        public AmbulanceResponseDTOBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }

        public AmbulanceResponseDTO build() {
            return new AmbulanceResponseDTO(id, ambulanceNumber, ambulanceType, status, latitude, longitude, driverId, driverName, driverPhone, hospitalId, hospitalName);
        }
    }

    public static AmbulanceResponseDTO fromEntity(Ambulance ambulance) {
        if (ambulance == null) return null;
        return AmbulanceResponseDTO.builder()
                .id(ambulance.getId())
                .ambulanceNumber(ambulance.getAmbulanceNumber())
                .ambulanceType(ambulance.getAmbulanceType())
                .status(ambulance.getStatus())
                .latitude(ambulance.getLatitude())
                .longitude(ambulance.getLongitude())
                .driverId(ambulance.getDriver() != null ? ambulance.getDriver().getId() : null)
                .driverName(ambulance.getDriver() != null && ambulance.getDriver().getUser() != null ? ambulance.getDriver().getUser().getName() : null)
                .driverPhone(ambulance.getDriver() != null ? ambulance.getDriver().getPhone() : null)
                .hospitalId(ambulance.getHospital() != null ? ambulance.getHospital().getId() : null)
                .hospitalName(ambulance.getHospital() != null ? ambulance.getHospital().getName() : null)
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getVehicleNumber() { return ambulanceNumber; }
    public String getAssignedDriverName() { return driverName != null ? driverName : "Unassigned"; }
    public Long getAssignedDriverId() { return driverId; }
    public String getBaseHospitalName() { return hospitalName != null ? hospitalName : "City Central Hospital"; }
    public Long getBaseHospitalId() { return hospitalId; }
    public Integer getFuelLevel() { return 85; }
    public String getLocationName() { return String.format("Area (%.4f, %.4f)", latitude != null ? latitude : 0.0, longitude != null ? longitude : 0.0); }
    public java.util.List<String> getEquipment() { return java.util.Arrays.asList("Ventilator", "Defibrillator", "Oxygen Tank"); }
}
