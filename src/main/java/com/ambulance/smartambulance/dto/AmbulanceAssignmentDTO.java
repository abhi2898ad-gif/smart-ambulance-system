package com.ambulance.smartambulance.dto;

import jakarta.validation.constraints.NotNull;

public class AmbulanceAssignmentDTO {

    @NotNull(message = "Ambulance ID is required")
    private Long ambulanceId;

    private Long hospitalId;

    private String notes;

    public AmbulanceAssignmentDTO() {
    }

    public AmbulanceAssignmentDTO(Long ambulanceId, Long hospitalId, String notes) {
        this.ambulanceId = ambulanceId;
        this.hospitalId = hospitalId;
        this.notes = notes;
    }

    public static AmbulanceAssignmentDTOBuilder builder() {
        return new AmbulanceAssignmentDTOBuilder();
    }

    public static class AmbulanceAssignmentDTOBuilder {
        private Long ambulanceId;
        private Long hospitalId;
        private String notes;

        public AmbulanceAssignmentDTOBuilder ambulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; return this; }
        public AmbulanceAssignmentDTOBuilder hospitalId(Long hospitalId) { this.hospitalId = hospitalId; return this; }
        public AmbulanceAssignmentDTOBuilder notes(String notes) { this.notes = notes; return this; }

        public AmbulanceAssignmentDTO build() {
            return new AmbulanceAssignmentDTO(ambulanceId, hospitalId, notes);
        }
    }

    public Long getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
