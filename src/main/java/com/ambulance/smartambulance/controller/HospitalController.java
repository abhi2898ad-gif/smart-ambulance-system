package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.EmergencyResponseDTO;
import com.ambulance.smartambulance.dto.HospitalRequestDTO;
import com.ambulance.smartambulance.dto.HospitalResponseDTO;
import com.ambulance.smartambulance.dto.StatusUpdateDTO;
import com.ambulance.smartambulance.service.HospitalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HospitalResponseDTO>>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<HospitalResponseDTO>>> getAvailableHospitals() {
        return ResponseEntity.ok(hospitalService.getAvailableHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalResponseDTO>> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HospitalResponseDTO>> createHospital(@Valid @RequestBody HospitalRequestDTO request) {
        ApiResponse<HospitalResponseDTO> response = hospitalService.createHospital(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    public ResponseEntity<ApiResponse<HospitalResponseDTO>> updateHospital(
            @PathVariable Long id,
            @RequestBody HospitalRequestDTO request
    ) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHospital(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.deleteHospital(id));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    public ResponseEntity<ApiResponse<HospitalResponseDTO>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDto
    ) {
        return ResponseEntity.ok(hospitalService.updateStatus(id, statusDto.getStatus()));
    }

    @RequestMapping(value = "/{id}/beds", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    public ResponseEntity<ApiResponse<HospitalResponseDTO>> updateBeds(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> body
    ) {
        Integer availableBeds = body.get("availableBeds") != null ? Integer.valueOf(body.get("availableBeds").toString()) : null;
        Integer availableIcuBeds = body.get("availableIcuBeds") != null ? Integer.valueOf(body.get("availableIcuBeds").toString()) : null;
        return ResponseEntity.ok(hospitalService.updateBeds(id, availableBeds, availableIcuBeds));
    }

    @GetMapping("/{id}/emergencies")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getHospitalEmergencies(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalEmergencies(id));
    }
}
