
package com.example.messageservice.dto;

import com.example.messageservice.entity.MessageThread;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ThreadResponse {

    private Long id;
    private Long patientUserId;
    private Long staffUserId;
    private String subject;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ThreadResponse from(MessageThread thread) {
        return ThreadResponse.builder()
                .id(thread.getId())
                .patientUserId(thread.getPatientUserId())
                .staffUserId(thread.getStaffUserId())
                .subject(thread.getSubject())
                .createdAt(thread.getCreatedAt())
                .updatedAt(thread.getUpdatedAt())
                .build();
    }
}