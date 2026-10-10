package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.DemandPredictionResponseDTO;
import com.ambulance.smartambulance.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DemandPredictionResponseDTO>>> getAllPredictions() {
        return ResponseEntity.ok(predictionService.getAllPredictions());
    }

    @GetMapping("/demand")
    public ResponseEntity<ApiResponse<DemandPredictionResponseDTO>> getDemandPrediction(
            @RequestParam(required = false, defaultValue = "Hyderabad Central") String area,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time
    ) {
        return ResponseEntity.ok(predictionService.predictDemand(area, date, time));
    }
}
