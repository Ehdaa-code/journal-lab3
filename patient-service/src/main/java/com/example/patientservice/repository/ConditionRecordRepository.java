package com.example.patientservice.repository;

import com.example.patientservice.entity.ConditionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConditionRecordRepository extends JpaRepository<ConditionRecord, Long> {

    List<ConditionRecord> findByPatientIdOrderByDiagnosedDateDesc(Long patientId);

    List<ConditionRecord> findByDiagnosisNameContainingIgnoreCase(String diagnosisName);

    List<ConditionRecord> findByStatusIgnoreCase(String status);
}