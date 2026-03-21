
package com.example.patientservice.controller;

import com.example.patientservice.dto.ObservationResponse;
import com.example.patientservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/observations")
@RequiredArgsConstructor
public class ObservationController {

    private final PatientService patientService;

    /**
     * Hämta alla observationer för en patient.
     * Exempel:
     * GET /api/observations/patient/1
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getObservationsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getObservationsByPatient(patientId));
    }

    /**
     * Hämta alla observationer för ett encounter.
     * Exempel:
     * GET /api/observations/encounter/5
     */
    @GetMapping("/encounter/{encounterId}")
    public ResponseEntity<?> getObservationsByEncounter(@PathVariable Long encounterId) {
        return ResponseEntity.ok(patientService.getObservationsByEncounter(encounterId));
    }

    /**
     * Hämta en observation via id.
     * För detta behöver vi lägga till metod i service senare om du vill.
     * Just nu lämnar vi den ute för att hålla koden konsekvent med det vi redan byggt.
     */
}
