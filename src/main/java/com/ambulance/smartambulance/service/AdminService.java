package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import com.ambulance.smartambulance.entity.enums.EmergencyStatus;
import com.ambulance.smartambulance.entity.enums.HospitalStatus;
import com.ambulance.smartambulance.entity.enums.TripStatus;
import com.ambulance.smartambulance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final TripRepository tripRepository;
    private final HospitalRepository hospitalRepository;
    private final DriverRepository driverRepository;
    private final AmbulanceService ambulanceService;
    private final DriverService driverService;
    private final HospitalService hospitalService;
    private final EmergencyService emergencyService;
    private final TripService tripService;

    public AdminService(UserRepository userRepository, AmbulanceRepository ambulanceRepository, EmergencyRequestRepository emergencyRepository, TripRepository tripRepository, HospitalRepository hospitalRepository, DriverRepository driverRepository, AmbulanceService ambulanceService, DriverService driverService, HospitalService hospitalService, EmergencyService emergencyService, TripService tripService) {
        this.userRepository = userRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRepository = emergencyRepository;
        this.tripRepository = tripRepository;
        this.hospitalRepository = hospitalRepository;
        this.driverRepository = driverRepository;
        this.ambulanceService = ambulanceService;
        this.driverService = driverService;
        this.hospitalService = hospitalService;
        this.emergencyService = emergencyService;
        this.tripService = tripService;
    }

    @Transactional(readOnly = true)
    public ApiResponse<AdminDashboardDTO> getDashboard() {
        long totalUsers = userRepository.count();
        long totalAmbulances = ambulanceRepository.count();
        long availableAmbulances = ambulanceRepository.countByStatus(AmbulanceStatus.AVAILABLE);

        List<EmergencyStatus> activeStatuses = Arrays.asList(
                EmergencyStatus.REQUESTED,
                EmergencyStatus.PRIORITY_ASSIGNED,
                EmergencyStatus.AMBULANCE_ASSIGNED,
                EmergencyStatus.EN_ROUTE,
                EmergencyStatus.ARRIVED,
                EmergencyStatus.PATIENT_PICKED,
                EmergencyStatus.AT_HOSPITAL
        );
        long activeEmergencies = emergencyRepository.countByStatusIn(activeStatuses);
        long completedTrips = tripRepository.countByStatus(TripStatus.COMPLETED);
        long availableHospitals = hospitalRepository.findByStatusIn(Arrays.asList(HospitalStatus.READY, HospitalStatus.BUSY))
                .stream().filter(h -> h.getCurrentEmergencyCount() < h.getEmergencyCapacity()).count();

        AdminDashboardDTO dashboard = AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalAmbulances(totalAmbulances)
                .availableAmbulances(availableAmbulances)
                .activeEmergencies(activeEmergencies)
                .completedTrips(completedTrips)
                .availableHospitals(availableHospitals)
                .build();

        return ApiResponse.success("Admin dashboard data retrieved successfully", dashboard);
    }

    @Transactional(readOnly = true)
    public ApiResponse<AdminStatisticsDTO> getStatistics() {
        // Group by emergency type
        Map<String, Long> countByType = new HashMap<>();
        for (Object[] row : emergencyRepository.countGroupedByEmergencyType()) {
            if (row[0] != null) countByType.put(row[0].toString(), (Long) row[1]);
        }

        // Group by priority
        Map<String, Long> countByPriority = new HashMap<>();
        for (Object[] row : emergencyRepository.countGroupedByPriority()) {
            if (row[0] != null) countByPriority.put(row[0].toString(), (Long) row[1]);
        }

        // Group by status
        Map<String, Long> countByStatus = new HashMap<>();
        for (Object[] row : emergencyRepository.countGroupedByStatus()) {
            if (row[0] != null) countByStatus.put(row[0].toString(), (Long) row[1]);
        }

        // Daily emergency count (today)
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long dailyCount = emergencyRepository.countByRequestedAtBetween(startOfDay, endOfDay);

        // Ambulance utilization
        long totalAmbulances = ambulanceRepository.count();
        long available = ambulanceRepository.countByStatus(AmbulanceStatus.AVAILABLE);
        double utilization = totalAmbulances > 0
                ? Math.round(((double) (totalAmbulances - available) / totalAmbulances * 100.0) * 10.0) / 10.0
                : 0.0;

        long completedTrips = tripRepository.countByStatus(TripStatus.COMPLETED);
        long cancelledTrips = tripRepository.countByStatus(TripStatus.CANCELLED);
        long activeEmergencies = emergencyRepository.countByStatusIn(Arrays.asList(
                EmergencyStatus.REQUESTED, EmergencyStatus.PRIORITY_ASSIGNED,
                EmergencyStatus.AMBULANCE_ASSIGNED, EmergencyStatus.EN_ROUTE,
                EmergencyStatus.ARRIVED, EmergencyStatus.PATIENT_PICKED, EmergencyStatus.AT_HOSPITAL
        ));

        AdminStatisticsDTO statistics = AdminStatisticsDTO.builder()
                .countByType(countByType)
                .countByPriority(countByPriority)
                .countByStatus(countByStatus)
                .dailyEmergencyCount(dailyCount)
                .ambulanceUtilizationPercent(utilization)
                .completedTrips(completedTrips)
                .cancelledTrips(cancelledTrips)
                .activeEmergencies(activeEmergencies)
                .build();

        return ApiResponse.success("Admin statistics retrieved successfully", statistics);
    }

    public ApiResponse<List<EmergencyResponseDTO>> getAllEmergencies() {
        return emergencyService.getAllEmergencies();
    }

    public ApiResponse<List<AmbulanceResponseDTO>> getAllAmbulances() {
        return ambulanceService.getAllAmbulances();
    }

    public ApiResponse<List<DriverResponseDTO>> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    public ApiResponse<List<HospitalResponseDTO>> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    public ApiResponse<List<TripResponseDTO>> getAllTrips() {
        return tripService.getAllTrips();
    }
}
