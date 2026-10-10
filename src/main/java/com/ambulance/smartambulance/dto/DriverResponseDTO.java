package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.enums.DriverStatus;

public class DriverResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String licenseNumber;
    private String phone;
    private DriverStatus status;
    private Double currentLatitude;
    private Double currentLongitude;
    private Long assignedAmbulanceId;
    private String assignedAmbulanceNumber;

    public DriverResponseDTO() {
    }

    public DriverResponseDTO(Long id, Long userId, String userName, String userEmail, String licenseNumber, String phone, DriverStatus status, Double currentLatitude, Double currentLongitude, Long assignedAmbulanceId, String assignedAmbulanceNumber) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
        this.status = status;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.assignedAmbulanceId = assignedAmbulanceId;
        this.assignedAmbulanceNumber = assignedAmbulanceNumber;
    }

    public static DriverResponseDTOBuilder builder() {
        return new DriverResponseDTOBuilder();
    }

    public static class DriverResponseDTOBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private String licenseNumber;
        private String phone;
        private DriverStatus status;
        private Double currentLatitude;
        private Double currentLongitude;
        private Long assignedAmbulanceId;
        private String assignedAmbulanceNumber;

        public DriverResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public DriverResponseDTOBuilder userId(Long userId) { this.userId = userId; return this; }
        public DriverResponseDTOBuilder userName(String userName) { this.userName = userName; return this; }
        public DriverResponseDTOBuilder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public DriverResponseDTOBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DriverResponseDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public DriverResponseDTOBuilder status(DriverStatus status) { this.status = status; return this; }
        public DriverResponseDTOBuilder currentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; return this; }
        public DriverResponseDTOBuilder currentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; return this; }
        public DriverResponseDTOBuilder assignedAmbulanceId(Long assignedAmbulanceId) { this.assignedAmbulanceId = assignedAmbulanceId; return this; }
        public DriverResponseDTOBuilder assignedAmbulanceNumber(String assignedAmbulanceNumber) { this.assignedAmbulanceNumber = assignedAmbulanceNumber; return this; }

        public DriverResponseDTO build() {
            return new DriverResponseDTO(id, userId, userName, userEmail, licenseNumber, phone, status, currentLatitude, currentLongitude, assignedAmbulanceId, assignedAmbulanceNumber);
        }
    }

    public static DriverResponseDTO fromEntity(Driver driver, Ambulance assignedAmbulance) {
        if (driver == null) return null;
        return DriverResponseDTO.builder()
                .id(driver.getId())
                .userId(driver.getUser() != null ? driver.getUser().getId() : null)
                .userName(driver.getUser() != null ? driver.getUser().getName() : null)
                .userEmail(driver.getUser() != null ? driver.getUser().getEmail() : null)
                .licenseNumber(driver.getLicenseNumber())
                .phone(driver.getPhone())
                .status(driver.getStatus())
                .currentLatitude(driver.getCurrentLatitude())
                .currentLongitude(driver.getCurrentLongitude())
                .assignedAmbulanceId(assignedAmbulance != null ? assignedAmbulance.getId() : null)
                .assignedAmbulanceNumber(assignedAmbulance != null ? assignedAmbulance.getAmbulanceNumber() : null)
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public DriverStatus getStatus() { return status; }
    public void setStatus(DriverStatus status) { this.status = status; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public Long getAssignedAmbulanceId() { return assignedAmbulanceId; }
    public void setAssignedAmbulanceId(Long assignedAmbulanceId) { this.assignedAmbulanceId = assignedAmbulanceId; }

    public String getAssignedAmbulanceNumber() { return assignedAmbulanceNumber; }
    public void setAssignedAmbulanceNumber(String assignedAmbulanceNumber) { this.assignedAmbulanceNumber = assignedAmbulanceNumber; }

    public String getFullName() { return userName; }
    public String getVehicleNumber() { return assignedAmbulanceNumber != null ? assignedAmbulanceNumber : "Unassigned"; }
    public Double getRating() { return 4.9; }
    public Integer getCompletedTrips() { return 342; }
    public Integer getExperienceYears() { return 6; }
    public String getShift() { return "Day (08:00 - 20:00)"; }
}
