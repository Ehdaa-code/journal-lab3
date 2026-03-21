
package com.example.patientservice.dto;

import com.example.patientservice.entity.Encounter;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EncounterResponse {

    private Long id;
    private Long patientId;
    private LocalDateTime encounterDate;
    private String type;
    private String reason;
    private String summary;
    private Long createdByUserId;

    public static EncounterResponse from(Encounter encounter) {
        return EncounterResponse.builder()
                .id(encounter.getId())
                .patientId(encounter.getPatientId())
                .encounterDate(encounter.getEncounterDate())
                .type(encounter.getType())
                .reason(encounter.getReason())
                .summary(encounter.getSummary())
                .createdByUserId(encounter.getCreatedByUserId())
                .build();
    }
}