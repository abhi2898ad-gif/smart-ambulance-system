package com.ambulance.smartambulance.dto;

import jakarta.validation.constraints.NotBlank;

public class StatusUpdateDTO {

    @NotBlank(message = "Status cannot be blank")
    private String status;

    public StatusUpdateDTO() {
    }

    public StatusUpdateDTO(String status) {
        this.status = status;
    }

    public static StatusUpdateDTOBuilder builder() {
        return new StatusUpdateDTOBuilder();
    }

    public static class StatusUpdateDTOBuilder {
        private String status;

        public StatusUpdateDTOBuilder status(String status) { this.status = status; return this; }

        public StatusUpdateDTO build() {
            return new StatusUpdateDTO(status);
        }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
