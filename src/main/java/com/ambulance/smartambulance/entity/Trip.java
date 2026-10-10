package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.TripStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "emergency_id", nullable = false)
    private EmergencyRequest emergency;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulance_id", nullable = false)
    private Ambulance ambulance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Double distance; // in km

    private Long duration; // in minutes

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status;

    public Trip() {
    }

    public Trip(Long id, EmergencyRequest emergency, Ambulance ambulance, Driver driver, LocalDateTime startTime, LocalDateTime endTime, Double distance, Long duration, TripStatus status) {
        this.id = id;
        this.emergency = emergency;
        this.ambulance = ambulance;
        this.driver = driver;
        this.startTime = startTime;
        this.endTime = endTime;
        this.distance = distance;
        this.duration = duration;
        this.status = status;
    }

    public static TripBuilder builder() {
        return new TripBuilder();
    }

    public static class TripBuilder {
        private Long id;
        private EmergencyRequest emergency;
        private Ambulance ambulance;
        private Driver driver;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Double distance;
        private Long duration;
        private TripStatus status;

        public TripBuilder id(Long id) { this.id = id; return this; }
        public TripBuilder emergency(EmergencyRequest emergency) { this.emergency = emergency; return this; }
        public TripBuilder ambulance(Ambulance ambulance) { this.ambulance = ambulance; return this; }
        public TripBuilder driver(Driver driver) { this.driver = driver; return this; }
        public TripBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public TripBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public TripBuilder distance(Double distance) { this.distance = distance; return this; }
        public TripBuilder duration(Long duration) { this.duration = duration; return this; }
        public TripBuilder status(TripStatus status) { this.status = status; return this; }

        public Trip build() {
            return new Trip(id, emergency, ambulance, driver, startTime, endTime, distance, duration, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EmergencyRequest getEmergency() { return emergency; }
    public void setEmergency(EmergencyRequest emergency) { this.emergency = emergency; }

    public Ambulance getAmbulance() { return ambulance; }
    public void setAmbulance(Ambulance ambulance) { this.ambulance = ambulance; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

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
