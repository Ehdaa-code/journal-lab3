package com.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateConditionRequest {

    @NotBlank
    private String diagnosisName;

    private String icdCode;
    private String description;

    @NotBlank
    private String status;

    private LocalDate diagnosedDate;

    @NotNull
    private Long createdByUserId;
}