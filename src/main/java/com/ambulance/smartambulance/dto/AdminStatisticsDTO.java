package com.ambulance.smartambulance.dto;

import java.util.Map;

public class AdminStatisticsDTO {
    private Map<String, Long> countByPriority;
    private Map<String, Long> countByType;
    private Map<String, Long> countByStatus;
    private long dailyEmergencyCount;
    private double ambulanceUtilizationPercent;
    private long completedTrips;
    private long cancelledTrips;
    private long activeEmergencies;

    public AdminStatisticsDTO() {
    }

    public AdminStatisticsDTO(Map<String, Long> countByPriority, Map<String, Long> countByType, Map<String, Long> countByStatus, long dailyEmergencyCount, double ambulanceUtilizationPercent, long completedTrips, long cancelledTrips, long activeEmergencies) {
        this.countByPriority = countByPriority;
        this.countByType = countByType;
        this.countByStatus = countByStatus;
        this.dailyEmergencyCount = dailyEmergencyCount;
        this.ambulanceUtilizationPercent = ambulanceUtilizationPercent;
        this.completedTrips = completedTrips;
        this.cancelledTrips = cancelledTrips;
        this.activeEmergencies = activeEmergencies;
    }

    public static AdminStatisticsDTOBuilder builder() {
        return new AdminStatisticsDTOBuilder();
    }

    public static class AdminStatisticsDTOBuilder {
        private Map<String, Long> countByPriority;
        private Map<String, Long> countByType;
        private Map<String, Long> countByStatus;
        private long dailyEmergencyCount;
        private double ambulanceUtilizationPercent;
        private long completedTrips;
        private long cancelledTrips;
        private long activeEmergencies;

        public AdminStatisticsDTOBuilder countByPriority(Map<String, Long> countByPriority) { this.countByPriority = countByPriority; return this; }
        public AdminStatisticsDTOBuilder countByType(Map<String, Long> countByType) { this.countByType = countByType; return this; }
        public AdminStatisticsDTOBuilder countByStatus(Map<String, Long> countByStatus) { this.countByStatus = countByStatus; return this; }
        public AdminStatisticsDTOBuilder dailyEmergencyCount(long dailyEmergencyCount) { this.dailyEmergencyCount = dailyEmergencyCount; return this; }
        public AdminStatisticsDTOBuilder ambulanceUtilizationPercent(double ambulanceUtilizationPercent) { this.ambulanceUtilizationPercent = ambulanceUtilizationPercent; return this; }
        public AdminStatisticsDTOBuilder completedTrips(long completedTrips) { this.completedTrips = completedTrips; return this; }
        public AdminStatisticsDTOBuilder cancelledTrips(long cancelledTrips) { this.cancelledTrips = cancelledTrips; return this; }
        public AdminStatisticsDTOBuilder activeEmergencies(long activeEmergencies) { this.activeEmergencies = activeEmergencies; return this; }

        public AdminStatisticsDTO build() {
            return new AdminStatisticsDTO(countByPriority, countByType, countByStatus, dailyEmergencyCount, ambulanceUtilizationPercent, completedTrips, cancelledTrips, activeEmergencies);
        }
    }

    public Map<String, Long> getCountByPriority() { return countByPriority; }
    public void setCountByPriority(Map<String, Long> countByPriority) { this.countByPriority = countByPriority; }

    public Map<String, Long> getCountByType() { return countByType; }
    public void setCountByType(Map<String, Long> countByType) { this.countByType = countByType; }

    public Map<String, Long> getCountByStatus() { return countByStatus; }
    public void setCountByStatus(Map<String, Long> countByStatus) { this.countByStatus = countByStatus; }

    public long getDailyEmergencyCount() { return dailyEmergencyCount; }
    public void setDailyEmergencyCount(long dailyEmergencyCount) { this.dailyEmergencyCount = dailyEmergencyCount; }

    public double getAmbulanceUtilizationPercent() { return ambulanceUtilizationPercent; }
    public void setAmbulanceUtilizationPercent(double ambulanceUtilizationPercent) { this.ambulanceUtilizationPercent = ambulanceUtilizationPercent; }

    public long getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(long completedTrips) { this.completedTrips = completedTrips; }

    public long getCancelledTrips() { return cancelledTrips; }
    public void setCancelledTrips(long cancelledTrips) { this.cancelledTrips = cancelledTrips; }

    public long getActiveEmergencies() { return activeEmergencies; }
    public void setActiveEmergencies(long activeEmergencies) { this.activeEmergencies = activeEmergencies; }
}
