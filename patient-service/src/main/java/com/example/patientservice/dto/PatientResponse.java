
package com.example.patientservice.dto;

import com.example.patientservice.entity.Patient;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class PatientResponse {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String personalNumber;
    private String phoneNumber;
    private String address;
    private Long assignedDoctorUserId;
    private Long assignedStaffUserId;

    public static PatientResponse from(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .userId(patient.getUserId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .personalNumber(patient.getPersonalNumber())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .assignedDoctorUserId(patient.getAssignedDoctorUserId())
                .assignedStaffUserId(patient.getAssignedStaffUserId())
                .build();
    }
}