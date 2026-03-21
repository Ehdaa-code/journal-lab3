package com.example.patientservice.repository;

import com.example.patientservice.entity.Observation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObservationRepository extends JpaRepository<Observation, Long> {

    List<Observation> findByEncounterIdOrderByObservedAtDesc(Long encounterId);

    List<Observation> findByPatientIdOrderByObservedAtDesc(Long patientId);
}