package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.EmergencyRequestDTO;
import com.ambulance.smartambulance.dto.PriorityResultDTO;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PriorityServiceTest {

    private PriorityService priorityService;

    @BeforeEach
    void setUp() {
        priorityService = new PriorityService();
    }

    @Test
    void testCriticalPriorityWhenUnconscious() {
        EmergencyRequestDTO request = EmergencyRequestDTO.builder()
                .emergencyType("COLLAPSE")
                .description("Person collapsed on sidewalk")
                .isUnconscious(true)
                .latitude(17.3850)
                .longitude(78.4867)
                .build();

        PriorityResultDTO result = priorityService.calculatePriority(request);
        assertEquals(EmergencyPriority.CRITICAL, result.getPriority());
        assertTrue(result.getConfidence() >= 0.95);
    }

    @Test
    void testCriticalPriorityWhenMajorAccident() {
        EmergencyRequestDTO request = EmergencyRequestDTO.builder()
                .emergencyType("ROAD_ACCIDENT")
                .description("Multi vehicle collision on highway")
                .isMajorAccident(true)
                .hasSevereBleeding(true)
                .latitude(17.3850)
                .longitude(78.4867)
                .build();

        PriorityResultDTO result = priorityService.calculatePriority(request);
        assertEquals(EmergencyPriority.CRITICAL, result.getPriority());
    }

    @Test
    void testHighPriorityForChestPain() {
        EmergencyRequestDTO request = EmergencyRequestDTO.builder()
                .emergencyType("CARDIAC")
                .description("Patient experiencing acute chest tightness")
                .isChestPain(true)
                .latitude(17.3850)
                .longitude(78.4867)
                .build();

        PriorityResultDTO result = priorityService.calculatePriority(request);
        assertEquals(EmergencyPriority.HIGH, result.getPriority());
    }

    @Test
    void testMediumPriorityForModeratePain() {
        EmergencyRequestDTO request = EmergencyRequestDTO.builder()
                .emergencyType("FALL")
                .description("Ankle twisted with moderate pain")
                .severity("MEDIUM")
                .latitude(17.3850)
                .longitude(78.4867)
                .build();

        PriorityResultDTO result = priorityService.calculatePriority(request);
        assertEquals(EmergencyPriority.MEDIUM, result.getPriority());
    }

    @Test
    void testLowPriorityForMinorIssue() {
        EmergencyRequestDTO request = EmergencyRequestDTO.builder()
                .emergencyType("CHECKUP")
                .description("Routine patient transfer request")
                .severity("LOW")
                .latitude(17.3850)
                .longitude(78.4867)
                .build();

        PriorityResultDTO result = priorityService.calculatePriority(request);
        assertEquals(EmergencyPriority.LOW, result.getPriority());
    }
}
