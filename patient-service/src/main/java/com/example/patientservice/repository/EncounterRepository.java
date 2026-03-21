package com.example.patientservice.repository;

import com.example.patientservice.entity.Encounter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {

    List<Encounter> findByPatientIdOrderByEncounterDateDesc(Long patientId);

    List<Encounter> findByPatientIdInAndEncounterDateBetween(List<Long> patientIds,
                                                             LocalDateTime start,
                                                             LocalDateTime end);
}