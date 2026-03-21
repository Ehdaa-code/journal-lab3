package com.example.patientservice.dto;

import com.example.patientservice.entity.Observation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ObservationResponse {

    private Long id;
    private Long encounterId;
    private Long patientId;
    private String category;
    private String name;
    private String value;
    private String unit;
    private LocalDateTime observedAt;
    private Long createdByUserId;

    public static ObservationResponse from(Observation observation) {
        return ObservationResponse.builder()
                .id(observation.getId())
                .encounterId(observation.getEncounterId())
                .patientId(observation.getPatientId())
                .category(observation.getCategory())
                .name(observation.getName())
                .value(observation.getValue())
                .unit(observation.getUnit())
                .observedAt(observation.getObservedAt())
                .createdByUserId(observation.getCreatedByUserId())
                .build();
    }
}