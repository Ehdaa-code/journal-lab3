
package com.example.patientservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PatientJournalResponse {

    private PatientResponse patient;
    private List<EncounterResponse> encounters;
    private List<ObservationResponse> observations;
    private List<ConditionResponse> conditions;
    private List<ClinicalNoteResponse> clinicalNotes;
}