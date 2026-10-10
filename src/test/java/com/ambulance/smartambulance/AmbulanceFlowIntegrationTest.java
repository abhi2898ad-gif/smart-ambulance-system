package com.ambulance.smartambulance;

import com.ambulance.smartambulance.dto.EmergencyRequestDTO;
import com.ambulance.smartambulance.dto.LocationUpdateDTO;
import com.ambulance.smartambulance.dto.LoginRequest;
import com.ambulance.smartambulance.dto.StatusUpdateDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AmbulanceFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email(email)
                .password(password)
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").path("token").asText();
    }

    @Test
    void testCompleteEmergencyAndTripLifecycle() throws Exception {
        // 1. Patient Logs In
        String patientToken = loginAndGetToken("patient@ambulance.com", "patient123");
        assertNotNull(patientToken);

        // 2. Patient creates a Critical Emergency
        EmergencyRequestDTO emergencyRequest = EmergencyRequestDTO.builder()
                .emergencyType("CARDIAC_ARREST")
                .description("Severe sudden chest collapse in Jubilee Hills")
                .isUnconscious(true)
                .hasBreathingDifficulty(true)
                .latitude(17.4325)
                .longitude(78.4071)
                .build();

        MvcResult emergencyResult = mockMvc.perform(post("/api/emergencies")
                        .header("Authorization", "Bearer " + patientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emergencyRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.priority").value("CRITICAL"))
                .andExpect(jsonPath("$.data.ambulanceId").exists())
                .andExpect(jsonPath("$.data.hospitalId").exists())
                .andExpect(jsonPath("$.data.estimatedMinutes").exists())
                .andReturn();

        JsonNode emergencyJson = objectMapper.readTree(emergencyResult.getResponse().getContentAsString()).path("data");
        long emergencyId = emergencyJson.path("id").asLong();
        long driverId = emergencyJson.path("driverId").asLong();

        // 3. Driver Logs In
        String driverToken = loginAndGetToken("driver1@ambulance.com", "driver123");
        assertNotNull(driverToken);

        // 4. Driver starts Trip
        MvcResult tripResult = mockMvc.perform(post("/api/trips/start/" + emergencyId)
                        .header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("EN_ROUTE"))
                .andReturn();

        long tripId = objectMapper.readTree(tripResult.getResponse().getContentAsString()).path("data").path("id").asLong();

        // 5. Driver updates live location
        LocationUpdateDTO locationUpdate = LocationUpdateDTO.builder()
                .latitude(17.4200)
                .longitude(78.4300)
                .build();

        mockMvc.perform(put("/api/drivers/" + driverId + "/location")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(locationUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.currentLatitude").value(17.4200));

        // 6. Driver transitions trip: ARRIVED -> PATIENT_PICKED -> AT_HOSPITAL
        for (String step : new String[]{"ARRIVED", "PATIENT_PICKED", "AT_HOSPITAL"}) {
            StatusUpdateDTO statusDto = StatusUpdateDTO.builder().status(step).build();
            mockMvc.perform(put("/api/trips/" + tripId + "/status")
                            .header("Authorization", "Bearer " + driverToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(statusDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value(step));
        }

        // 7. Complete Trip
        mockMvc.perform(post("/api/trips/" + tripId + "/complete")
                        .header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        // 8. Admin Logs In and verifies Dashboard & Statistics
        String adminToken = loginAndGetToken("admin@ambulance.com", "admin123");
        assertNotNull(adminToken);

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers").exists())
                .andExpect(jsonPath("$.data.totalAmbulances").exists());

        mockMvc.perform(get("/api/admin/statistics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.countByPriority").exists());

        // 9. Demand Prediction API
        mockMvc.perform(get("/api/predictions/demand?area=Jubilee Hills")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.predictedDemand").exists());
    }
}
