package com.example.searchservice.repository;

import com.example.searchservice.dto.EncounterSearchResult;
import com.example.searchservice.dto.PatientSearchResult;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.mysqlclient.MySQLPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SearchRepository {

    @Inject
    MySQLPool client;

    public Uni<List<PatientSearchResult>> searchPatientsByName(String name) {
        String sql = """
                SELECT id, user_id, first_name, last_name, date_of_birth, personal_number,
                       phone_number, address, assigned_doctor_user_id, assigned_staff_user_id
                FROM patients
                WHERE LOWER(first_name) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(last_name) LIKE LOWER(CONCAT('%', ?, '%'))
                ORDER BY first_name, last_name
                """;

        return client.preparedQuery(sql)
                .execute(Tuple.of(name, name))
                .map(this::mapPatients);
    }

    public Uni<List<PatientSearchResult>> searchPatientsByCondition(String condition) {
        String sql = """
                SELECT DISTINCT p.id, p.user_id, p.first_name, p.last_name, p.date_of_birth,
                       p.personal_number, p.phone_number, p.address,
                       p.assigned_doctor_user_id, p.assigned_staff_user_id
                FROM patients p
                JOIN conditions c ON c.patient_id = p.id
                WHERE LOWER(c.diagnosis_name) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(COALESCE(c.description, '')) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(COALESCE(c.icd_code, '')) LIKE LOWER(CONCAT('%', ?, '%'))
                ORDER BY p.first_name, p.last_name
                """;

        return client.preparedQuery(sql)
                .execute(Tuple.of(condition, condition, condition))
                .map(this::mapPatients);
    }

    public Uni<List<PatientSearchResult>> advancedPatientSearch(String name, String status, Long doctorUserId) {
        StringBuilder sql = new StringBuilder("""
                SELECT DISTINCT p.id, p.user_id, p.first_name, p.last_name, p.date_of_birth,
                       p.personal_number, p.phone_number, p.address,
                       p.assigned_doctor_user_id, p.assigned_staff_user_id
                FROM patients p
                LEFT JOIN conditions c ON c.patient_id = p.id
                WHERE 1 = 1
                """);

        List<Object> params = new ArrayList<>();

        if (name != null && !name.isBlank()) {
            sql.append("""
                    AND (
                        LOWER(p.first_name) LIKE LOWER(CONCAT('%', ?, '%'))
                        OR LOWER(p.last_name) LIKE LOWER(CONCAT('%', ?, '%'))
                    )
                    """);
            params.add(name);
            params.add(name);
        }

        if (status != null && !status.isBlank()) {
            sql.append(" AND LOWER(COALESCE(c.status, '')) = LOWER(?) ");
            params.add(status);
        }

        if (doctorUserId != null) {
            sql.append(" AND p.assigned_doctor_user_id = ? ");
            params.add(doctorUserId);
        }

        sql.append(" ORDER BY p.first_name, p.last_name ");

        return client.preparedQuery(sql.toString())
                .execute(Tuple.from(params))
                .map(this::mapPatients);
    }

    public Uni<List<PatientSearchResult>> getPatientsForDoctor(Long doctorUserId) {
        String sql = """
                SELECT id, user_id, first_name, last_name, date_of_birth, personal_number,
                       phone_number, address, assigned_doctor_user_id, assigned_staff_user_id
                FROM patients
                WHERE assigned_doctor_user_id = ?
                ORDER BY first_name, last_name
                """;

        return client.preparedQuery(sql)
                .execute(Tuple.of(doctorUserId))
                .map(this::mapPatients);
    }

    public Uni<List<EncounterSearchResult>> getEncountersForDoctorPatientsByDay(Long doctorUserId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        String sql = """
                SELECT e.id, e.patient_id, e.encounter_date, e.type, e.reason, e.summary, e.created_by_user_id
                FROM encounters e
                JOIN patients p ON p.id = e.patient_id
                WHERE p.assigned_doctor_user_id = ?
                  AND e.encounter_date >= ?
                  AND e.encounter_date < ?
                ORDER BY e.encounter_date DESC
                """;

        return client.preparedQuery(sql)
                .execute(Tuple.of(doctorUserId, start, end))
                .map(this::mapEncounters);
    }

    private List<PatientSearchResult> mapPatients(RowSet<Row> rows) {
        List<PatientSearchResult> results = new ArrayList<>();

        for (Row row : rows) {
            results.add(new PatientSearchResult(
                    row.getLong("id"),
                    row.getLong("user_id"),
                    row.getString("first_name"),
                    row.getString("last_name"),
                    row.getLocalDate("date_of_birth"),
                    row.getString("personal_number"),
                    row.getString("phone_number"),
                    row.getString("address"),
                    row.getLong("assigned_doctor_user_id"),
                    row.getLong("assigned_staff_user_id")
            ));
        }

        return results;
    }

    private List<EncounterSearchResult> mapEncounters(RowSet<Row> rows) {
        List<EncounterSearchResult> results = new ArrayList<>();

        for (Row row : rows) {
            results.add(new EncounterSearchResult(
                    row.getLong("id"),
                    row.getLong("patient_id"),
                    row.getLocalDateTime("encounter_date"),
                    row.getString("type"),
                    row.getString("reason"),
                    row.getString("summary"),
                    row.getLong("created_by_user_id")
            ));
        }

        return results;
    }
}