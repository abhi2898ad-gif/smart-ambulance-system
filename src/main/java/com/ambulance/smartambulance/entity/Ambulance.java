package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.AmbulanceType;
import jakarta.persistence.*;

@Entity
@Table(name = "ambulances")
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ambulanceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmbulanceType ambulanceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmbulanceStatus status;

    private Double latitude;

    private Double longitude;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    public Ambulance() {
    }

    public Ambulance(Long id, String ambulanceNumber, AmbulanceType ambulanceType, AmbulanceStatus status, Double latitude, Double longitude, Driver driver, Hospital hospital) {
        this.id = id;
        this.ambulanceNumber = ambulanceNumber;
        this.ambulanceType = ambulanceType;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.driver = driver;
        this.hospital = hospital;
    }

    public static AmbulanceBuilder builder() {
        return new AmbulanceBuilder();
    }

    public static class AmbulanceBuilder {
        private Long id;
        private String ambulanceNumber;
        private AmbulanceType ambulanceType;
        private AmbulanceStatus status;
        private Double latitude;
        private Double longitude;
        private Driver driver;
        private Hospital hospital;

        public AmbulanceBuilder id(Long id) { this.id = id; return this; }
        public AmbulanceBuilder ambulanceNumber(String ambulanceNumber) { this.ambulanceNumber = ambulanceNumber; return this; }
        public AmbulanceBuilder ambulanceType(AmbulanceType ambulanceType) { this.ambulanceType = ambulanceType; return this; }
        public AmbulanceBuilder status(AmbulanceStatus status) { this.status = status; return this; }
        public AmbulanceBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AmbulanceBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AmbulanceBuilder driver(Driver driver) { this.driver = driver; return this; }
        public AmbulanceBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }

        public Ambulance build() {
            return new Ambulance(id, ambulanceNumber, ambulanceType, status, latitude, longitude, driver, hospital);
        }
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

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
}
