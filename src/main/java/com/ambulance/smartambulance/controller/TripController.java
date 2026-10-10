package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.StatusUpdateDTO;
import com.ambulance.smartambulance.dto.TripResponseDTO;
import com.ambulance.smartambulance.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping("/start/{emergencyId}")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TripResponseDTO>> startTrip(@PathVariable Long emergencyId) {
        ApiResponse<TripResponseDTO> response = tripService.startTrip(emergencyId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TripResponseDTO>> updateTripStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDto
    ) {
        return ResponseEntity.ok(tripService.updateTripStatus(id, statusDto.getStatus()));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TripResponseDTO>> completeTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.completeTrip(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @GetMapping("/emergency/{emergencyId}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getTripByEmergencyId(@PathVariable Long emergencyId) {
        return ResponseEntity.ok(tripService.getTripByEmergencyId(emergencyId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }
}
