package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.DriverStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String licenseNumber;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;

    private Double currentLatitude;

    private Double currentLongitude;

    public Driver() {
    }

    public Driver(Long id, User user, String licenseNumber, String phone, DriverStatus status, Double currentLatitude, Double currentLongitude) {
        this.id = id;
        this.user = user;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
        this.status = status;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
    }

    public static DriverBuilder builder() {
        return new DriverBuilder();
    }

    public static class DriverBuilder {
        private Long id;
        private User user;
        private String licenseNumber;
        private String phone;
        private DriverStatus status;
        private Double currentLatitude;
        private Double currentLongitude;

        public DriverBuilder id(Long id) { this.id = id; return this; }
        public DriverBuilder user(User user) { this.user = user; return this; }
        public DriverBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DriverBuilder phone(String phone) { this.phone = phone; return this; }
        public DriverBuilder status(DriverStatus status) { this.status = status; return this; }
        public DriverBuilder currentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; return this; }
        public DriverBuilder currentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; return this; }

        public Driver build() {
            return new Driver(id, user, licenseNumber, phone, status, currentLatitude, currentLongitude);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
}
