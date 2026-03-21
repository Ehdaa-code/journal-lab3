package com.example.searchservice.dto;

import java.util.List;

public class DoctorPatientsWithEncountersResponse {

    public Long doctorUserId;
    public String date;
    public List<PatientSearchResult> patients;
    public List<EncounterSearchResult> encounters;

    public DoctorPatientsWithEncountersResponse() {
    }

    public DoctorPatientsWithEncountersResponse(Long doctorUserId,
                                                String date,
                                                List<PatientSearchResult> patients,
                                                List<EncounterSearchResult> encounters) {
        this.doctorUserId = doctorUserId;
        this.date = date;
        this.patients = patients;
        this.encounters = encounters;
    }
}