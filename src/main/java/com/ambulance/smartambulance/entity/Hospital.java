package com.ambulance.smartambulance.entity;

import com.ambulance.smartambulance.entity.enums.HospitalStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    private String phone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer emergencyCapacity;

    @Column(nullable = false)
    private Integer currentEmergencyCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HospitalStatus status;

    public Hospital() {
    }

    public Hospital(Long id, String name, String address, String phone, Double latitude, Double longitude, Integer emergencyCapacity, Integer currentEmergencyCount, HospitalStatus status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencyCapacity = emergencyCapacity;
        this.currentEmergencyCount = currentEmergencyCount != null ? currentEmergencyCount : 0;
        this.status = status;
    }

    public static HospitalBuilder builder() {
        return new HospitalBuilder();
    }

    public static class HospitalBuilder {
        private Long id;
        private String name;
        private String address;
        private String phone;
        private Double latitude;
        private Double longitude;
        private Integer emergencyCapacity;
        private Integer currentEmergencyCount = 0;
        private HospitalStatus status;

        public HospitalBuilder id(Long id) { this.id = id; return this; }
        public HospitalBuilder name(String name) { this.name = name; return this; }
        public HospitalBuilder address(String address) { this.address = address; return this; }
        public HospitalBuilder phone(String phone) { this.phone = phone; return this; }
        public HospitalBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public HospitalBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public HospitalBuilder emergencyCapacity(Integer emergencyCapacity) { this.emergencyCapacity = emergencyCapacity; return this; }
        public HospitalBuilder currentEmergencyCount(Integer currentEmergencyCount) { this.currentEmergencyCount = currentEmergencyCount; return this; }
        public HospitalBuilder status(HospitalStatus status) { this.status = status; return this; }

        public Hospital build() {
            return new Hospital(id, name, address, phone, latitude, longitude, emergencyCapacity, currentEmergencyCount, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getEmergencyCapacity() { return emergencyCapacity; }
    public void setEmergencyCapacity(Integer emergencyCapacity) { this.emergencyCapacity = emergencyCapacity; }

    public Integer getCurrentEmergencyCount() { return currentEmergencyCount; }
    public void setCurrentEmergencyCount(Integer currentEmergencyCount) { this.currentEmergencyCount = currentEmergencyCount; }

    public HospitalStatus getStatus() { return status; }
    public void setStatus(HospitalStatus status) { this.status = status; }
}
