package com.example.searchservice.service;

import com.example.searchservice.dto.DoctorPatientsWithEncountersResponse;
import com.example.searchservice.dto.EncounterSearchResult;
import com.example.searchservice.dto.PatientSearchResult;
import com.example.searchservice.repository.SearchRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class SearchService {

    @Inject
    SearchRepository searchRepository;

    public Uni<List<PatientSearchResult>> searchPatientsByName(String name) {
        return searchRepository.searchPatientsByName(name);
    }

    public Uni<List<PatientSearchResult>> searchPatientsByCondition(String condition) {
        return searchRepository.searchPatientsByCondition(condition);
    }

    public Uni<List<PatientSearchResult>> advancedPatientSearch(String name, String status, Long doctorUserId) {
        return searchRepository.advancedPatientSearch(name, status, doctorUserId);
    }

    public Uni<List<PatientSearchResult>> getPatientsForDoctor(Long doctorUserId) {
        return searchRepository.getPatientsForDoctor(doctorUserId);
    }

    public Uni<List<EncounterSearchResult>> getEncountersForDoctorPatientsByDay(Long doctorUserId, LocalDate date) {
        return searchRepository.getEncountersForDoctorPatientsByDay(doctorUserId, date);
    }

    public Uni<DoctorPatientsWithEncountersResponse> getDoctorPatientsWithEncounters(Long doctorUserId, LocalDate date) {
        Uni<List<PatientSearchResult>> patientsUni = searchRepository.getPatientsForDoctor(doctorUserId);
        Uni<List<EncounterSearchResult>> encountersUni = searchRepository.getEncountersForDoctorPatientsByDay(doctorUserId, date);

        return Uni.combine().all().unis(patientsUni, encountersUni).combinedWith((patients, encounters) ->
                new DoctorPatientsWithEncountersResponse(
                        doctorUserId,
                        date.toString(),
                        (List<PatientSearchResult>) patients,
                        (List<EncounterSearchResult>) encounters
                )
        );
    }
}
