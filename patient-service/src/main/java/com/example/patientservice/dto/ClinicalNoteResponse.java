
package com.example.patientservice.dto;

import com.example.patientservice.entity.ClinicalNote;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ClinicalNoteResponse {

    private Long id;
    private Long patientId;
    private String noteText;
    private String noteType;
    private LocalDateTime createdAt;
    private Long createdByUserId;

    public static ClinicalNoteResponse from(ClinicalNote note) {
        return ClinicalNoteResponse.builder()
                .id(note.getId())
                .patientId(note.getPatientId())
                .noteText(note.getNoteText())
                .noteType(note.getNoteType())
                .createdAt(note.getCreatedAt())
                .createdByUserId(note.getCreatedByUserId())
                .build();
    }
}