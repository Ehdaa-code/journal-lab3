// PatientController.java
package com.example.patientservice.controller;

import com.example.patientservice.dto.*;
import com.example.patientservice.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody CreatePatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(request));
    }

    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<PatientResponse> getPatientByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @GetMapping("/doctor/{doctorUserId}")
    public ResponseEntity<?> getPatientsByDoctor(@PathVariable Long doctorUserId) {
        return ResponseEntity.ok(patientService.getPatientsByDoctor(doctorUserId));
    }

    @GetMapping("/staff/{staffUserId}")
    public ResponseEntity<?> getPatientsByStaff(@PathVariable Long staffUserId) {
        return ResponseEntity.ok(patientService.getPatientsByStaff(staffUserId));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPatientsByName(@RequestParam String q) {
        return ResponseEntity.ok(patientService.searchPatientsByName(q));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(@PathVariable Long patientId,
                                                         @RequestBody UpdatePatientRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, request));
    }

    @GetMapping("/{patientId}/journal")
    public ResponseEntity<PatientJournalResponse> getJournalByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getJournalByPatientId(patientId));
    }

    @GetMapping("/journal/by-user/{userId}")
    public ResponseEntity<PatientJournalResponse> getJournalByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(patientService.getJournalByUserId(userId));
    }

    @PostMapping("/{patientId}/notes")
    public ResponseEntity<ClinicalNoteResponse> createClinicalNote(@PathVariable Long patientId,
                                                                   @Valid @RequestBody CreateClinicalNoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createClinicalNote(patientId, request));
    }

    @GetMapping("/{patientId}/notes")
    public ResponseEntity<?> getClinicalNotes(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getClinicalNotesByPatient(patientId));
    }

    @PostMapping("/{patientId}/conditions")
    public ResponseEntity<ConditionResponse> createCondition(@PathVariable Long patientId,
                                                             @Valid @RequestBody CreateConditionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createCondition(patientId, request));
    }

    @GetMapping("/{patientId}/conditions")
    public ResponseEntity<?> getConditions(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getConditionsByPatient(patientId));
    }

    @PostMapping("/{patientId}/encounters")
    public ResponseEntity<EncounterResponse> createEncounter(@PathVariable Long patientId,
                                                             @Valid @RequestBody CreateEncounterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createEncounter(patientId, request));
    }

    @GetMapping("/{patientId}/encounters")
    public ResponseEntity<?> getEncounters(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getEncountersByPatient(patientId));
    }

    @GetMapping("/{patientId}/observations")
    public ResponseEntity<?> getObservationsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getObservationsByPatient(patientId));
    }
}