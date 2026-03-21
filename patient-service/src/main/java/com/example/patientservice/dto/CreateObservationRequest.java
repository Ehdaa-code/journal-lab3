package com.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateObservationRequest {

    @NotBlank
    private String category;

    @NotBlank
    private String name;

    @NotBlank
    private String value;

    private String unit;

    private LocalDateTime observedAt;

    @NotNull
    private Long createdByUserId;
}