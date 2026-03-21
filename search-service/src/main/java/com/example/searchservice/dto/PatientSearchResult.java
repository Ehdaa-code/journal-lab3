package com.example.searchservice.dto;

import java.time.LocalDate;

public class PatientSearchResult {

    public Long patientId;
    public Long userId;
    public String firstName;
    public String lastName;
    public LocalDate dateOfBirth;
    public String personalNumber;
    public String phoneNumber;
    public String address;
    public Long assignedDoctorUserId;
    public Long assignedStaffUserId;

    public PatientSearchResult() {
    }

    public PatientSearchResult(Long patientId,
                               Long userId,
                               String firstName,
                               String lastName,
                               LocalDate dateOfBirth,
                               String personalNumber,
                               String phoneNumber,
                               String address,
                               Long assignedDoctorUserId,
                               Long assignedStaffUserId) {
        this.patientId = patientId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.personalNumber = personalNumber;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.assignedDoctorUserId = assignedDoctorUserId;
        this.assignedStaffUserId = assignedStaffUserId;
    }
}
