package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DriverResponseDTO>>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DriverResponseDTO>> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DriverResponseDTO>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDto
    ) {
        return ResponseEntity.ok(driverService.updateStatus(id, statusDto.getStatus()));
    }

    @RequestMapping(value = "/{id}/location", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DriverResponseDTO>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateDTO locationDto
    ) {
        return ResponseEntity.ok(driverService.updateLocation(id, locationDto));
    }

    @GetMapping("/{id}/emergencies")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getDriverEmergencies(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverEmergencies(id));
    }

    @GetMapping("/{id}/trips")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getDriverTrips(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverTrips(id));
    }
}
