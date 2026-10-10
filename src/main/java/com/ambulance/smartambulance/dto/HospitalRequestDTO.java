package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.enums.HospitalStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HospitalRequestDTO {

    @NotBlank(message = "Hospital name is required")
    private String name;

    private String address;

    private String phone;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Emergency capacity is required")
    @Min(value = 1, message = "Emergency capacity must be at least 1")
    private Integer emergencyCapacity;

    private Integer currentEmergencyCount;

    private HospitalStatus status;

    public HospitalRequestDTO() {
    }

    public HospitalRequestDTO(String name, String address, String phone, Double latitude, Double longitude, Integer emergencyCapacity, Integer currentEmergencyCount, HospitalStatus status) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencyCapacity = emergencyCapacity;
        this.currentEmergencyCount = currentEmergencyCount;
        this.status = status;
    }

    public static HospitalRequestDTOBuilder builder() {
        return new HospitalRequestDTOBuilder();
    }

    public static class HospitalRequestDTOBuilder {
        private String name;
        private String address;
        private String phone;
        private Double latitude;
        private Double longitude;
        private Integer emergencyCapacity;
        private Integer currentEmergencyCount;
        private HospitalStatus status;

        public HospitalRequestDTOBuilder name(String name) { this.name = name; return this; }
        public HospitalRequestDTOBuilder address(String address) { this.address = address; return this; }
        public HospitalRequestDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public HospitalRequestDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public HospitalRequestDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public HospitalRequestDTOBuilder emergencyCapacity(Integer emergencyCapacity) { this.emergencyCapacity = emergencyCapacity; return this; }
        public HospitalRequestDTOBuilder currentEmergencyCount(Integer currentEmergencyCount) { this.currentEmergencyCount = currentEmergencyCount; return this; }
        public HospitalRequestDTOBuilder status(HospitalStatus status) { this.status = status; return this; }

        public HospitalRequestDTO build() {
            return new HospitalRequestDTO(name, address, phone, latitude, longitude, emergencyCapacity, currentEmergencyCount, status);
        }
    }

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

    public Integer getTotalBeds() { return emergencyCapacity; }
    public void setTotalBeds(Integer totalBeds) { if (this.emergencyCapacity == null) this.emergencyCapacity = totalBeds; }

    public String getEmergencyUnitNumber() { return phone; }
    public void setEmergencyUnitNumber(String emergencyUnitNumber) { if (this.phone == null || this.phone.isBlank()) this.phone = emergencyUnitNumber; }

    public String getContactNumber() { return phone; }
    public void setContactNumber(String contactNumber) { if (this.phone == null || this.phone.isBlank()) this.phone = contactNumber; }
}
