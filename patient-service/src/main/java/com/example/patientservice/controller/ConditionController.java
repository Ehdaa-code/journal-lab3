// ConditionController.java
package com.example.patientservice.controller;

import com.example.patientservice.dto.ConditionResponse;
import com.example.patientservice.dto.CreateConditionRequest;
import com.example.patientservice.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conditions")
@RequiredArgsConstructor
public class ConditionController {

    private final PatientService patientService;

    /**
     * Skapa en condition/diagnos för en patient.
     * Exempel:
     * POST /api/conditions/patient/1
     */
    @PostMapping("/patient/{patientId}")
    public ResponseEntity<ConditionResponse> createCondition(@PathVariable Long patientId,
                                                             @Valid @RequestBody CreateConditionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createCondition(patientId, request));
    }

    /**
     * Hämta alla conditions för en patient.
     * Exempel:
     * GET /api/conditions/patient/1
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getConditionsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getConditionsByPatient(patientId));
    }
}