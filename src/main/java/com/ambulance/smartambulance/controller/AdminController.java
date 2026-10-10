package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminStatisticsDTO>> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }

    @GetMapping("/emergencies")
    public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getEmergencies() {
        return ResponseEntity.ok(adminService.getAllEmergencies());
    }

    @GetMapping("/ambulances")
    public ResponseEntity<ApiResponse<List<AmbulanceResponseDTO>>> getAmbulances() {
        return ResponseEntity.ok(adminService.getAllAmbulances());
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverResponseDTO>>> getDrivers() {
        return ResponseEntity.ok(adminService.getAllDrivers());
    }

    @GetMapping("/hospitals")
    public ResponseEntity<ApiResponse<List<HospitalResponseDTO>>> getHospitals() {
        return ResponseEntity.ok(adminService.getAllHospitals());
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getTrips() {
        return ResponseEntity.ok(adminService.getAllTrips());
    }
}
