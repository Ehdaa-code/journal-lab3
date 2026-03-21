package com.example.patientservice.service;

import com.example.patientservice.dto.*;
import com.example.patientservice.entity.*;
import com.example.patientservice.exception.ResourceNotFoundException;
import com.example.patientservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final EncounterRepository encounterRepository;
    private final ObservationRepository observationRepository;
    private final ConditionRecordRepository conditionRecordRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;

    public PatientResponse createPatient(CreatePatientRequest request) {
        patientRepository.findByUserId(request.getUserId()).ifPresent(existing -> {
            throw new IllegalArgumentException("Patient already exists for userId: " + request.getUserId());
        });

        Patient patient = Patient.builder()
                .userId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .personalNumber(request.getPersonalNumber())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .assignedDoctorUserId(request.getAssignedDoctorUserId())
                .assignedStaffUserId(request.getAssignedStaffUserId())
                .build();

        return PatientResponse.from(patientRepository.save(patient));
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(PatientResponse::from)
                .toList();
    }

    public PatientResponse getPatientById(Long patientId) {
        return PatientResponse.from(findPatient(patientId));
    }

    public PatientResponse getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for userId: " + userId));
        return PatientResponse.from(patient);
    }

    public List<PatientResponse> getPatientsByDoctor(Long doctorUserId) {
        return patientRepository.findByAssignedDoctorUserId(doctorUserId)
                .stream()
                .map(PatientResponse::from)
                .toList();
    }

    public List<PatientResponse> getPatientsByStaff(Long staffUserId) {
        return patientRepository.findByAssignedStaffUserId(staffUserId)
                .stream()
                .map(PatientResponse::from)
                .toList();
    }

    public List<PatientResponse> searchPatientsByName(String q) {
        return patientRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(q, q)
                .stream()
                .map(PatientResponse::from)
                .toList();
    }

    public PatientResponse updatePatient(Long patientId, UpdatePatientRequest request) {
        Patient patient = findPatient(patientId);

        if (request.getFirstName() != null) patient.setFirstName(request.getFirstName());
        if (request.getLastName() != null) patient.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getPersonalNumber() != null) patient.setPersonalNumber(request.getPersonalNumber());
        if (request.getPhoneNumber() != null) patient.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getAssignedDoctorUserId() != null) patient.setAssignedDoctorUserId(request.getAssignedDoctorUserId());
        if (request.getAssignedStaffUserId() != null) patient.setAssignedStaffUserId(request.getAssignedStaffUserId());

        return PatientResponse.from(patientRepository.save(patient));
    }

    public EncounterResponse createEncounter(Long patientId, CreateEncounterRequest request) {
        findPatient(patientId);

        Encounter encounter = Encounter.builder()
                .patientId(patientId)
                .encounterDate(request.getEncounterDate())
                .type(request.getType())
                .reason(request.getReason())
                .summary(request.getSummary())
                .createdByUserId(request.getCreatedByUserId())
                .build();

        return EncounterResponse.from(encounterRepository.save(encounter));
    }

    public List<EncounterResponse> getEncountersByPatient(Long patientId) {
        findPatient(patientId);

        return encounterRepository.findByPatientIdOrderByEncounterDateDesc(patientId)
                .stream()
                .map(EncounterResponse::from)
                .toList();
    }

    public ObservationResponse createObservation(Long encounterId, CreateObservationRequest request) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new ResourceNotFoundException("Encounter not found with id: " + encounterId));

        Observation observation = Observation.builder()
                .encounterId(encounterId)
                .patientId(encounter.getPatientId())
                .category(request.getCategory())
                .name(request.getName())
                .value(request.getValue())
                .unit(request.getUnit())
                .observedAt(request.getObservedAt() != null ? request.getObservedAt() : LocalDateTime.now())
                .createdByUserId(request.getCreatedByUserId())
                .build();

        return ObservationResponse.from(observationRepository.save(observation));
    }

    public List<ObservationResponse> getObservationsByEncounter(Long encounterId) {
        encounterRepository.findById(encounterId)
                .orElseThrow(() -> new ResourceNotFoundException("Encounter not found with id: " + encounterId));

        return observationRepository.findByEncounterIdOrderByObservedAtDesc(encounterId)
                .stream()
                .map(ObservationResponse::from)
                .toList();
    }

    public List<ObservationResponse> getObservationsByPatient(Long patientId) {
        findPatient(patientId);

        return observationRepository.findByPatientIdOrderByObservedAtDesc(patientId)
                .stream()
                .map(ObservationResponse::from)
                .toList();
    }

    public ConditionResponse createCondition(Long patientId, CreateConditionRequest request) {
        findPatient(patientId);

        ConditionRecord condition = ConditionRecord.builder()
                .patientId(patientId)
                .diagnosisName(request.getDiagnosisName())
                .icdCode(request.getIcdCode())
                .description(request.getDescription())
                .status(request.getStatus())
                .diagnosedDate(request.getDiagnosedDate())
                .createdByUserId(request.getCreatedByUserId())
                .build();

        return ConditionResponse.from(conditionRecordRepository.save(condition));
    }

    public List<ConditionResponse> getConditionsByPatient(Long patientId) {
        findPatient(patientId);

        return conditionRecordRepository.findByPatientIdOrderByDiagnosedDateDesc(patientId)
                .stream()
                .map(ConditionResponse::from)
                .toList();
    }

    public ClinicalNoteResponse createClinicalNote(Long patientId, CreateClinicalNoteRequest request) {
        findPatient(patientId);

        ClinicalNote note = ClinicalNote.builder()
                .patientId(patientId)
                .noteText(request.getNoteText())
                .noteType(request.getNoteType())
                .createdAt(LocalDateTime.now())
                .createdByUserId(request.getCreatedByUserId())
                .build();

        return ClinicalNoteResponse.from(clinicalNoteRepository.save(note));
    }

    public List<ClinicalNoteResponse> getClinicalNotesByPatient(Long patientId) {
        findPatient(patientId);

        return clinicalNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(ClinicalNoteResponse::from)
                .toList();
    }

    public PatientJournalResponse getJournalByPatientId(Long patientId) {
        Patient patient = findPatient(patientId);

        List<EncounterResponse> encounters = encounterRepository.findByPatientIdOrderByEncounterDateDesc(patientId)
                .stream()
                .map(EncounterResponse::from)
                .toList();

        List<ObservationResponse> observations = observationRepository.findByPatientIdOrderByObservedAtDesc(patientId)
                .stream()
                .map(ObservationResponse::from)
                .toList();

        List<ConditionResponse> conditions = conditionRecordRepository.findByPatientIdOrderByDiagnosedDateDesc(patientId)
                .stream()
                .map(ConditionResponse::from)
                .toList();

        List<ClinicalNoteResponse> notes = clinicalNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(ClinicalNoteResponse::from)
                .toList();

        return PatientJournalResponse.builder()
                .patient(PatientResponse.from(patient))
                .encounters(encounters)
                .observations(observations)
                .conditions(conditions)
                .clinicalNotes(notes)
                .build();
    }

    public PatientJournalResponse getJournalByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for userId: " + userId));

        return getJournalByPatientId(patient.getId());
    }

    private Patient findPatient(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));
    }
}