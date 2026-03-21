package com.example.patientservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdatePatientRequest {

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String personalNumber;
    private String phoneNumber;
    private String address;
    private Long assignedDoctorUserId;
    private Long assignedStaffUserId;
}