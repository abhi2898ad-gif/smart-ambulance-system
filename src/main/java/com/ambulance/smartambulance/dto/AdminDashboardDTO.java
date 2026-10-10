package com.ambulance.smartambulance.dto;

public class AdminDashboardDTO {
    private long totalUsers;
    private long totalAmbulances;
    private long availableAmbulances;
    private long activeEmergencies;
    private long completedTrips;
    private long availableHospitals;

    public AdminDashboardDTO() {
    }

    public AdminDashboardDTO(long totalUsers, long totalAmbulances, long availableAmbulances, long activeEmergencies, long completedTrips, long availableHospitals) {
        this.totalUsers = totalUsers;
        this.totalAmbulances = totalAmbulances;
        this.availableAmbulances = availableAmbulances;
        this.activeEmergencies = activeEmergencies;
        this.completedTrips = completedTrips;
        this.availableHospitals = availableHospitals;
    }

    public static AdminDashboardDTOBuilder builder() {
        return new AdminDashboardDTOBuilder();
    }

    public static class AdminDashboardDTOBuilder {
        private long totalUsers;
        private long totalAmbulances;
        private long availableAmbulances;
        private long activeEmergencies;
        private long completedTrips;
        private long availableHospitals;

        public AdminDashboardDTOBuilder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public AdminDashboardDTOBuilder totalAmbulances(long totalAmbulances) { this.totalAmbulances = totalAmbulances; return this; }
        public AdminDashboardDTOBuilder availableAmbulances(long availableAmbulances) { this.availableAmbulances = availableAmbulances; return this; }
        public AdminDashboardDTOBuilder activeEmergencies(long activeEmergencies) { this.activeEmergencies = activeEmergencies; return this; }
        public AdminDashboardDTOBuilder completedTrips(long completedTrips) { this.completedTrips = completedTrips; return this; }
        public AdminDashboardDTOBuilder availableHospitals(long availableHospitals) { this.availableHospitals = availableHospitals; return this; }

        public AdminDashboardDTO build() {
            return new AdminDashboardDTO(totalUsers, totalAmbulances, availableAmbulances, activeEmergencies, completedTrips, availableHospitals);
        }
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalAmbulances() { return totalAmbulances; }
    public void setTotalAmbulances(long totalAmbulances) { this.totalAmbulances = totalAmbulances; }

    public long getAvailableAmbulances() { return availableAmbulances; }
    public void setAvailableAmbulances(long availableAmbulances) { this.availableAmbulances = availableAmbulances; }

    public long getActiveEmergencies() { return activeEmergencies; }
    public void setActiveEmergencies(long activeEmergencies) { this.activeEmergencies = activeEmergencies; }

    public long getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(long completedTrips) { this.completedTrips = completedTrips; }

    public long getAvailableHospitals() { return availableHospitals; }
    public void setAvailableHospitals(long availableHospitals) { this.availableHospitals = availableHospitals; }
}
