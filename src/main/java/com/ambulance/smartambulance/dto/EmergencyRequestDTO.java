package com.ambulance.smartambulance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmergencyRequestDTO {

    @NotBlank(message = "Emergency type is required (e.g., CARDIAC, ACCIDENT, RESPIRATORY, TRAUMA, GENERAL)")
    private String emergencyType;

    private String description;

    private String severity;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Integer patientAge;
    private Boolean isUnconscious;
    private Boolean hasSevereBleeding;
    private Boolean hasBreathingDifficulty;
    private Boolean isMajorAccident;
    private Boolean isChestPain;
    private Boolean isSevereBurn;

    public EmergencyRequestDTO() {
    }

    public EmergencyRequestDTO(String emergencyType, String description, String severity, Double latitude, Double longitude, Integer patientAge, Boolean isUnconscious, Boolean hasSevereBleeding, Boolean hasBreathingDifficulty, Boolean isMajorAccident, Boolean isChestPain, Boolean isSevereBurn) {
        this.emergencyType = emergencyType;
        this.description = description;
        this.severity = severity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.patientAge = patientAge;
        this.isUnconscious = isUnconscious;
        this.hasSevereBleeding = hasSevereBleeding;
        this.hasBreathingDifficulty = hasBreathingDifficulty;
        this.isMajorAccident = isMajorAccident;
        this.isChestPain = isChestPain;
        this.isSevereBurn = isSevereBurn;
    }

    public static EmergencyRequestDTOBuilder builder() {
        return new EmergencyRequestDTOBuilder();
    }

    public static class EmergencyRequestDTOBuilder {
        private String emergencyType;
        private String description;
        private String severity;
        private Double latitude;
        private Double longitude;
        private Integer patientAge;
        private Boolean isUnconscious;
        private Boolean hasSevereBleeding;
        private Boolean hasBreathingDifficulty;
        private Boolean isMajorAccident;
        private Boolean isChestPain;
        private Boolean isSevereBurn;

        public EmergencyRequestDTOBuilder emergencyType(String emergencyType) { this.emergencyType = emergencyType; return this; }
        public EmergencyRequestDTOBuilder description(String description) { this.description = description; return this; }
        public EmergencyRequestDTOBuilder severity(String severity) { this.severity = severity; return this; }
        public EmergencyRequestDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public EmergencyRequestDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public EmergencyRequestDTOBuilder patientAge(Integer patientAge) { this.patientAge = patientAge; return this; }
        public EmergencyRequestDTOBuilder isUnconscious(Boolean isUnconscious) { this.isUnconscious = isUnconscious; return this; }
        public EmergencyRequestDTOBuilder hasSevereBleeding(Boolean hasSevereBleeding) { this.hasSevereBleeding = hasSevereBleeding; return this; }
        public EmergencyRequestDTOBuilder hasBreathingDifficulty(Boolean hasBreathingDifficulty) { this.hasBreathingDifficulty = hasBreathingDifficulty; return this; }
        public EmergencyRequestDTOBuilder isMajorAccident(Boolean isMajorAccident) { this.isMajorAccident = isMajorAccident; return this; }
        public EmergencyRequestDTOBuilder isChestPain(Boolean isChestPain) { this.isChestPain = isChestPain; return this; }
        public EmergencyRequestDTOBuilder isSevereBurn(Boolean isSevereBurn) { this.isSevereBurn = isSevereBurn; return this; }

        public EmergencyRequestDTO build() {
            return new EmergencyRequestDTO(emergencyType, description, severity, latitude, longitude, patientAge, isUnconscious, hasSevereBleeding, hasBreathingDifficulty, isMajorAccident, isChestPain, isSevereBurn);
        }
    }

    public String getEmergencyType() { return emergencyType; }
    public void setEmergencyType(String emergencyType) { this.emergencyType = emergencyType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public Boolean getIsUnconscious() { return isUnconscious; }
    public void setIsUnconscious(Boolean isUnconscious) { this.isUnconscious = isUnconscious; }

    public Boolean getHasSevereBleeding() { return hasSevereBleeding; }
    public void setHasSevereBleeding(Boolean hasSevereBleeding) { this.hasSevereBleeding = hasSevereBleeding; }

    public Boolean getHasBreathingDifficulty() { return hasBreathingDifficulty; }
    public void setHasBreathingDifficulty(Boolean hasBreathingDifficulty) { this.hasBreathingDifficulty = hasBreathingDifficulty; }

    public Boolean getIsMajorAccident() { return isMajorAccident; }
    public void setIsMajorAccident(Boolean isMajorAccident) { this.isMajorAccident = isMajorAccident; }

    public Boolean getIsChestPain() { return isChestPain; }
    public void setIsChestPain(Boolean isChestPain) { this.isChestPain = isChestPain; }

    public Boolean getIsSevereBurn() { return isSevereBurn; }
    public void setIsSevereBurn(Boolean isSevereBurn) { this.isSevereBurn = isSevereBurn; }

    public Double getPickupLatitude() { return latitude; }
    public void setPickupLatitude(Double pickupLatitude) { if (this.latitude == null) this.latitude = pickupLatitude; }

    public Double getPickupLongitude() { return longitude; }
    public void setPickupLongitude(Double pickupLongitude) { if (this.longitude == null) this.longitude = pickupLongitude; }

    public String getPickupAddress() { return description; }
    public void setPickupAddress(String pickupAddress) { /* optional alias */ }

    public String getPatientName() { return null; }
    public void setPatientName(String patientName) { /* optional alias */ }

    public String getPatientPhone() { return null; }
    public void setPatientPhone(String patientPhone) { /* optional alias */ }
}
