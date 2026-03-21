package com.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateClinicalNoteRequest {

    @NotBlank
    private String noteText;

    @NotBlank
    private String noteType;

    @NotNull
    private Long createdByUserId;
}