
package com.example.patientservice.dto;

import com.example.patientservice.entity.ConditionRecord;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ConditionResponse {

    private Long id;
    private Long patientId;
    private String diagnosisName;
    private String icdCode;
    private String description;
    private String status;
    private LocalDate diagnosedDate;
    private Long createdByUserId;

    public static ConditionResponse from(ConditionRecord condition) {
        return ConditionResponse.builder()
                .id(condition.getId())
                .patientId(condition.getPatientId())
                .diagnosisName(condition.getDiagnosisName())
                .icdCode(condition.getIcdCode())
                .description(condition.getDescription())
                .status(condition.getStatus())
                .diagnosedDate(condition.getDiagnosedDate())
                .createdByUserId(condition.getCreatedByUserId())
                .build();
    }
}