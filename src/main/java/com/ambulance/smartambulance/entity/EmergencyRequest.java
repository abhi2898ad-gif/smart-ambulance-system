package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import com.ambulance.smartambulance.entity.enums.EmergencyStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_requests")
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String emergencyType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String severity;

    @Enumerated(EnumType.STRING)
    private EmergencyPriority priority;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulance_id")
    private Ambulance ambulance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;

    private LocalDateTime estimatedArrivalTime;

    public EmergencyRequest() {
    }

    public EmergencyRequest(Long id, User user, String emergencyType, String description, String severity, EmergencyPriority priority, Double latitude, Double longitude, EmergencyStatus status, Ambulance ambulance, Hospital hospital, LocalDateTime requestedAt, LocalDateTime assignedAt, LocalDateTime completedAt, LocalDateTime estimatedArrivalTime) {
        this.id = id;
        this.user = user;
        this.emergencyType = emergencyType;
        this.description = description;
        this.severity = severity;
        this.priority = priority;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.ambulance = ambulance;
        this.hospital = hospital;
        this.requestedAt = requestedAt;
        this.assignedAt = assignedAt;
        this.completedAt = completedAt;
        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    public static EmergencyRequestBuilder builder() {
        return new EmergencyRequestBuilder();
    }

    public static class EmergencyRequestBuilder {
        private Long id;
        private User user;
        private String emergencyType;
        private String description;
        private String severity;
        private EmergencyPriority priority;
        private Double latitude;
        private Double longitude;
        private EmergencyStatus status;
        private Ambulance ambulance;
        private Hospital hospital;
        private LocalDateTime requestedAt;
        private LocalDateTime assignedAt;
        private LocalDateTime completedAt;
        private LocalDateTime estimatedArrivalTime;

        public EmergencyRequestBuilder id(Long id) { this.id = id; return this; }
        public EmergencyRequestBuilder user(User user) { this.user = user; return this; }
        public EmergencyRequestBuilder emergencyType(String emergencyType) { this.emergencyType = emergencyType; return this; }
        public EmergencyRequestBuilder description(String description) { this.description = description; return this; }
        public EmergencyRequestBuilder severity(String severity) { this.severity = severity; return this; }
        public EmergencyRequestBuilder priority(EmergencyPriority priority) { this.priority = priority; return this; }
        public EmergencyRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public EmergencyRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public EmergencyRequestBuilder status(EmergencyStatus status) { this.status = status; return this; }
        public EmergencyRequestBuilder ambulance(Ambulance ambulance) { this.ambulance = ambulance; return this; }
        public EmergencyRequestBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }
        public EmergencyRequestBuilder requestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; return this; }
        public EmergencyRequestBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public EmergencyRequestBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public EmergencyRequestBuilder estimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; return this; }

        public EmergencyRequest build() {
            return new EmergencyRequest(id, user, emergencyType, description, severity, priority, latitude, longitude, status, ambulance, hospital, requestedAt, assignedAt, completedAt, estimatedArrivalTime);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Ambulance getAmbulance() { return ambulance; }
    public void setAmbulance(Ambulance ambulance) { this.ambulance = ambulance; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }
}
