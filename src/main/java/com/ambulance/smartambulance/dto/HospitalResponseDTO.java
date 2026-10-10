package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.Hospital;
import com.ambulance.smartambulance.entity.enums.HospitalStatus;

public class HospitalResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Integer emergencyCapacity;
    private Integer currentEmergencyCount;
    private Integer availableCapacity;
    private HospitalStatus status;
    private Double distanceKm;

    public HospitalResponseDTO() {
    }

    public HospitalResponseDTO(Long id, String name, String address, String phone, Double latitude, Double longitude, Integer emergencyCapacity, Integer currentEmergencyCount, Integer availableCapacity, HospitalStatus status, Double distanceKm) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencyCapacity = emergencyCapacity;
        this.currentEmergencyCount = currentEmergencyCount;
        this.availableCapacity = availableCapacity;
        this.status = status;
        this.distanceKm = distanceKm;
    }

    public static HospitalResponseDTOBuilder builder() {
        return new HospitalResponseDTOBuilder();
    }

    public static class HospitalResponseDTOBuilder {
        private Long id;
        private String name;
        private String address;
        private String phone;
        private Double latitude;
        private Double longitude;
        private Integer emergencyCapacity;
        private Integer currentEmergencyCount;
        private Integer availableCapacity;
        private HospitalStatus status;
        private Double distanceKm;

        public HospitalResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public HospitalResponseDTOBuilder name(String name) { this.name = name; return this; }
        public HospitalResponseDTOBuilder address(String address) { this.address = address; return this; }
        public HospitalResponseDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public HospitalResponseDTOBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public HospitalResponseDTOBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public HospitalResponseDTOBuilder emergencyCapacity(Integer emergencyCapacity) { this.emergencyCapacity = emergencyCapacity; return this; }
        public HospitalResponseDTOBuilder currentEmergencyCount(Integer currentEmergencyCount) { this.currentEmergencyCount = currentEmergencyCount; return this; }
        public HospitalResponseDTOBuilder availableCapacity(Integer availableCapacity) { this.availableCapacity = availableCapacity; return this; }
        public HospitalResponseDTOBuilder status(HospitalStatus status) { this.status = status; return this; }
        public HospitalResponseDTOBuilder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }

        public HospitalResponseDTO build() {
            return new HospitalResponseDTO(id, name, address, phone, latitude, longitude, emergencyCapacity, currentEmergencyCount, availableCapacity, status, distanceKm);
        }
    }

    public static HospitalResponseDTO fromEntity(Hospital hospital) {
        if (hospital == null) return null;
        int available = Math.max(0, hospital.getEmergencyCapacity() - hospital.getCurrentEmergencyCount());
        return HospitalResponseDTO.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .address(hospital.getAddress())
                .phone(hospital.getPhone())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .emergencyCapacity(hospital.getEmergencyCapacity())
                .currentEmergencyCount(hospital.getCurrentEmergencyCount())
                .availableCapacity(available)
                .status(hospital.getStatus())
                .build();
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

    public Integer getAvailableCapacity() { return availableCapacity; }
    public void setAvailableCapacity(Integer availableCapacity) { this.availableCapacity = availableCapacity; }

    public HospitalStatus getStatus() { return status; }
    public void setStatus(HospitalStatus status) { this.status = status; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getTotalBeds() { return emergencyCapacity; }
    public Integer getAvailableBeds() { return availableCapacity; }
    public Integer getIcuBeds() { return emergencyCapacity != null ? Math.max(10, emergencyCapacity / 4) : 20; }
    public Integer getAvailableIcuBeds() { return availableCapacity != null ? Math.max(1, availableCapacity / 4) : 5; }
    public String getEmergencyUnitNumber() { return phone != null ? phone : "+91-40-1066"; }
    public String getContactNumber() { return phone != null ? phone : "+91-40-23607777"; }
    public Double getOccupancyRate() {
        if (emergencyCapacity == null || emergencyCapacity == 0) return 0.0;
        int used = currentEmergencyCount != null ? currentEmergencyCount : (emergencyCapacity - (availableCapacity != null ? availableCapacity : 0));
        return Math.round((used * 100.0 / emergencyCapacity) * 10.0) / 10.0;
    }
    public java.util.List<String> getDepartments() { return java.util.Arrays.asList("Emergency Trauma", "Cardiac Care", "Neurology"); }
}
