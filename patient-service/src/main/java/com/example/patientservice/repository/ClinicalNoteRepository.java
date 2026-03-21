package com.example.patientservice.repository;

import com.example.patientservice.entity.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {

    List<ClinicalNote> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}