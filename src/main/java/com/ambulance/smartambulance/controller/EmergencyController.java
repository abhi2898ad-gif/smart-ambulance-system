package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.*;
import com.ambulance.smartambulance.entity.enums.Role;
import com.ambulance.smartambulance.security.UserPrincipal;
import com.ambulance.smartambulance.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmergencyResponseDTO>> createEmergency(
            @Valid @RequestBody EmergencyRequestDTO request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ApiResponse<EmergencyResponseDTO> response = emergencyService.createEmergency(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmergencyResponseDTO>> getEmergencyById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.getEmergencyById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getMyEmergencies(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(emergencyService.getUserEmergencies(currentUser.getId()));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<EmergencyResponseDTO>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDto
    ) {
        return ResponseEntity.ok(emergencyService.updateStatus(id, statusDto.getStatus()));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmergencyResponseDTO>> assignAmbulance(
            @PathVariable Long id,
            @Valid @RequestBody AmbulanceAssignmentDTO assignmentDto
    ) {
        return ResponseEntity.ok(emergencyService.assignAmbulanceManually(id, assignmentDto));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<EmergencyResponseDTO>> cancelEmergency(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        return ResponseEntity.ok(emergencyService.cancelEmergency(id, currentUser.getId(), isAdmin));
    }
}
