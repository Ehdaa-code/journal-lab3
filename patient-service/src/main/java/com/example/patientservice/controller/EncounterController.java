// EncounterController.java
package com.example.patientservice.controller;

import com.example.patientservice.dto.CreateObservationRequest;
import com.example.patientservice.dto.ObservationResponse;
import com.example.patientservice.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/encounters")
@RequiredArgsConstructor
public class EncounterController {

    private final PatientService patientService;

    @PostMapping("/{encounterId}/observations")
    public ResponseEntity<ObservationResponse> createObservation(@PathVariable Long encounterId,
                                                                 @Valid @RequestBody CreateObservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createObservation(encounterId, request));
    }

    @GetMapping("/{encounterId}/observations")
    public ResponseEntity<?> getObservationsByEncounter(@PathVariable Long encounterId) {
        return ResponseEntity.ok(patientService.getObservationsByEncounter(encounterId));
    }
}