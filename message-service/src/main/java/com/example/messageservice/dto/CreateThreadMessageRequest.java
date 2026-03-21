package com.example.messageservice.dto;

import com.example.messageservice.entity.SenderRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateThreadMessageRequest {

    @NotNull
    private Long patientUserId;

    @NotNull
    private Long staffUserId;

    @NotBlank
    private String subject;

    @NotNull
    private Long senderUserId;

    @NotNull
    private SenderRole senderRole;

    @NotBlank
    private String content;
}