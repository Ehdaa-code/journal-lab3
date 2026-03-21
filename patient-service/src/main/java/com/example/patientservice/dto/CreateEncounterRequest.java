package com.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateEncounterRequest {

    @NotNull
    private LocalDateTime encounterDate;

    @NotBlank
    private String type;

    private String reason;
    private String summary;

    @NotNull
    private Long createdByUserId;
}