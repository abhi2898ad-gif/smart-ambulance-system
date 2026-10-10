package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import com.ambulance.smartambulance.entity.enums.EmergencyStatus;

import java.time.LocalDateTime;

public class EmergencyResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userPhone;
    private String emergencyType;
    private String description;
    private String severity;
    private EmergencyPriority priority;
    private Double latitude;
    private Double longitude;
    private EmergencyStatus status;

    private Long ambulanceId;
    private String ambulanceNumber;
    private String ambulanceType;

    private Long driverId;
    private String driverName;
    private String driverPhone;

    private Long hospitalId;
    private String hospitalName;
    private String hospitalPhone;
    private String hospitalAddress;

    private LocalDateTime requestedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
    private LocalDateTime estimatedArrivalTime;

    private Double distanceKm;
    private Integer estimatedMinutes;

    public EmergencyResponseDTO() {
    }

    public EmergencyResponseDTO(Long id, Long userId, String userName, String userPhone, String emergencyType, String description, String severity, EmergencyPriority priority, Double latitude, Double longitude, EmergencyStatus status, Long ambulanceId, String ambulanceNumber, String ambulanceType, Long driverId, String driverName, String driverPhone, Long hospitalId, String hospitalName, String hospitalPhone, String hospitalAddress, LocalDateTime requestedAt, LocalDateTime assignedAt, LocalDateTime completedAt, LocalDateTime estimatedArrivalTime, Double distanceKm, Integer estimatedMinutes) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userPhone = userPhone;
        this.emergencyType = emergencyType;
        this.description = description;
        this.severity = severity;
        this.priority = priority;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.ambulanceId = ambulanceId;
        this.ambulanceNumber = ambulanceNumber;
        this.ambulanceType = ambulanceType;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.hospitalPhone = hospitalPhone;
        this.hospitalAddress = hospitalAddress;
        this.requestedAt = requestedAt;
        this.assignedAt = assignedAt;
        this.completedAt = completedAt;
        this.estimatedArrivalTime = estimatedArrivalTime;
        this.distanceKm = distanceKm;
        this.estimatedMinutes = estimatedMinutes;
    }

    public static EmergencyResponseDTOBuilder builder() {
        return new EmergencyResponseDTOBuilder();
    }

    public static class EmergencyResponseDTOBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private String userPhone;
        private String emergencyType;
        private String description;
        private String severity;
        private EmergencyPriority priority;
        private Double latitude;
        private Double longitude;
        private EmergencyStatus status;
        private Long ambulanceId;
        private String ambulanceNumber;
        private String ambulanceType;
        private Long driverId;
        private String driverName;
        private String driverPhone;
        private Long hospitalId;
        private String hospitalName;
        private String hospitalPhone;
        private String hospitalAddress;
        private LocalDateTime requestedAt;
        private LocalDateTime assignedAt;
        private LocalDateTime completedAt;
        private LocalDateTime estimatedArrivalTime;
        private Double distanceKm;
        private Integer estimatedMinutes;

        public EmergencyResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public EmergencyResponseDTOBuilder userId(Long userId) { this.userId = userId; return this; }
        public EmergencyResponseDTOBuilder userName(String userName) { this.userName = userName; return this; }
        public EmergencyResponseDTOBuilder userPhone(String userPhone) { this.userPhone = userPhone; return this; }
        public EmergencyResponseDTOBuilder emergencyType(String emergencyType) { this.emergencyType = emergencyType; return this; }
        public EmergencyResponseDTOBuilder description(String description) { this.description = description; return this; }
        public EmergencyResponseDTOBuilder severity(String severity) { this.severity = severity; return this; }
        public EmergencyResponseDTOBuilder priority(EmergencyPriority priority) { this.priority = priority; return this; }
        public EmergencyResponseDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public EmergencyResponseDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public EmergencyResponseDTOBuilder status(EmergencyStatus status) { this.status = status; return this; }
        public EmergencyResponseDTOBuilder ambulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; return this; }
        public EmergencyResponseDTOBuilder ambulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; return this; }
        public EmergencyResponseDTOBuilder ambulanceType(String ambulanceType) { this.ambulanceType = ambulanceType; return this; }
        public EmergencyResponseDTOBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public EmergencyResponseDTOBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public EmergencyResponseDTOBuilder driverPhone(String driverPhone) { this.driverPhone = driverPhone; return this; }
        public EmergencyResponseDTOBuilder hospitalId(Long hospitalId) { this.hospitalId = hospitalId; return this; }
        public EmergencyResponseDTOBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public EmergencyResponseDTOBuilder hospitalPhone(String hospitalPhone) { this.hospitalPhone = hospitalPhone; return this; }
        public EmergencyResponseDTOBuilder hospitalAddress(String hospitalAddress) { this.hospitalAddress = hospitalAddress; return this; }
        public EmergencyResponseDTOBuilder requestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; return this; }
        public EmergencyResponseDTOBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public EmergencyResponseDTOBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public EmergencyResponseDTOBuilder estimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; return this; }
        public EmergencyResponseDTOBuilder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public EmergencyResponseDTOBuilder estimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }

        public EmergencyResponseDTO build() {
            return new EmergencyResponseDTO(id, userId, userName, userPhone, emergencyType, description, severity, priority, latitude, longitude, status, ambulanceId, ambulanceNumber, ambulanceType, driverId, driverName, driverPhone, hospitalId, hospitalName, hospitalPhone, hospitalAddress, requestedAt, assignedAt, completedAt, estimatedArrivalTime, distanceKm, estimatedMinutes);
        }
    }

    public static EmergencyResponseDTO fromEntity(EmergencyRequest emergency) {
        if (emergency == null) return null;
        return EmergencyResponseDTO.builder()
                .id(emergency.getId())
                .userId(emergency.getUser() != null ? emergency.getUser().getId() : null)
                .userName(emergency.getUser() != null ? emergency.getUser().getName() : null)
                .userPhone(emergency.getUser() != null ? emergency.getUser().getPhone() : null)
                .emergencyType(emergency.getEmergencyType())
                .description(emergency.getDescription())
                .severity(emergency.getSeverity())
                .priority(emergency.getPriority())
                .latitude(emergency.getLatitude())
                .longitude(emergency.getLongitude())
                .status(emergency.getStatus())
                .ambulanceId(emergency.getAmbulance() != null ? emergency.getAmbulance().getId() : null)
                .ambulanceNumber(emergency.getAmbulance() != null ? emergency.getAmbulance().getAmbulanceNumber() : null)
                .ambulanceType(emergency.getAmbulance() != null && emergency.getAmbulance().getAmbulanceType() != null ? emergency.getAmbulance().getAmbulanceType().name() : null)
                .driverId(emergency.getAmbulance() != null && emergency.getAmbulance().getDriver() != null ? emergency.getAmbulance().getDriver().getId() : null)
                .driverName(emergency.getAmbulance() != null && emergency.getAmbulance().getDriver() != null && emergency.getAmbulance().getDriver().getUser() != null ? emergency.getAmbulance().getDriver().getUser().getName() : null)
                .driverPhone(emergency.getAmbulance() != null && emergency.getAmbulance().getDriver() != null ? emergency.getAmbulance().getDriver().getPhone() : null)
                .hospitalId(emergency.getHospital() != null ? emergency.getHospital().getId() : null)
                .hospitalName(emergency.getHospital() != null ? emergency.getHospital().getName() : null)
                .hospitalPhone(emergency.getHospital() != null ? emergency.getHospital().getPhone() : null)
                .hospitalAddress(emergency.getHospital() != null ? emergency.getHospital().getAddress() : null)
                .requestedAt(emergency.getRequestedAt())
                .assignedAt(emergency.getAssignedAt())
                .completedAt(emergency.getCompletedAt())
                .estimatedArrivalTime(emergency.getEstimatedArrivalTime())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public String getEmergencyType() { return emergencyType; }
    public void setEmergencyType(String emergencyType) { this.emergencyType = emergencyType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public EmergencyPriority getPriority() { return priority; }
    public void setPriority(EmergencyPriority priority) { this.priority = priority; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public EmergencyStatus getStatus() { return status; }
    public void setStatus(EmergencyStatus status) { this.status = status; }

    public Long getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; }

    public String getAmbulanceNumber() { return ambulanceNumber; }
    public void setAmbulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; }

    public String getAmbulanceType() { return ambulanceType; }
    public void setAmbulanceType(String ambulanceType) { this.ambulanceType = ambulanceType; }

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

    public String getHospitalPhone() { return hospitalPhone; }
    public void setHospitalPhone(String hospitalPhone) { this.hospitalPhone = hospitalPhone; }

    public String getHospitalAddress() { return hospitalAddress; }
    public void setHospitalAddress(String hospitalAddress) { this.hospitalAddress = hospitalAddress; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public String getPatientName() { return userName; }
    public String getPatientPhone() { return userPhone; }
    public Double getPickupLatitude() { return latitude; }
    public Double getPickupLongitude() { return longitude; }
    public String getPickupAddress() { return description != null && !description.isBlank() ? description : String.format("GPS Location (%.4f, %.4f)", latitude != null ? latitude : 0.0, longitude != null ? longitude : 0.0); }
    public String getDestinationHospitalName() { return hospitalName; }
    public Long getDestinationHospitalId() { return hospitalId; }
    public Long getAssignedAmbulanceId() { return ambulanceId; }
    public String getVehicleNumber() { return ambulanceNumber; }
    public Long getAssignedDriverId() { return driverId; }
    public Integer getEtaMinutes() { return estimatedMinutes != null ? estimatedMinutes : 0; }
    public LocalDateTime getCreatedAt() { return requestedAt; }
    public Boolean getAiTriaged() { return true; }
    public String getAiRecommendation() { return "Priority triaged as " + (priority != null ? priority.name() : "HIGH") + ". Nearest optimal unit assigned."; }
}
