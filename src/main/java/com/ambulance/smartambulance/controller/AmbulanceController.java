package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.service.AmbulanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmbulanceResponseDTO>>> getAllAmbulances() {
        return ResponseEntity.ok(ambulanceService.getAllAmbulances());
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<AmbulanceResponseDTO>>> getAvailableAmbulances() {
        return ResponseEntity.ok(ambulanceService.getAvailableAmbulances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> getAmbulanceById(@PathVariable Long id) {
        return ResponseEntity.ok(ambulanceService.getAmbulanceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> createAmbulance(@Valid @RequestBody AmbulanceRequestDTO request) {
        ApiResponse<AmbulanceResponseDTO> response = ambulanceService.createAmbulance(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> updateAmbulance(
            @PathVariable Long id,
            @RequestBody AmbulanceRequestDTO request
    ) {
        return ResponseEntity.ok(ambulanceService.updateAmbulance(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAmbulance(@PathVariable Long id) {
        return ResponseEntity.ok(ambulanceService.deleteAmbulance(id));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDto
    ) {
        return ResponseEntity.ok(ambulanceService.updateStatus(id, statusDto.getStatus()));
    }

    @RequestMapping(value = "/{id}/location", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateDTO locationDto
    ) {
        return ResponseEntity.ok(ambulanceService.updateLocation(id, locationDto));
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<ApiResponse<AmbulanceLocationResponseDTO>> getLocation(@PathVariable Long id) {
        return ResponseEntity.ok(ambulanceService.getLocation(id));
    }
}
