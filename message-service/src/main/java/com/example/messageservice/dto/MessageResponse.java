package com.example.messageservice.dto;

import com.example.messageservice.entity.Message;
import com.example.messageservice.entity.SenderRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageResponse {

    private Long id;
    private Long threadId;
    private Long senderUserId;
    private SenderRole senderRole;
    private String content;
    private LocalDateTime sentAt;

    public static MessageResponse from(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .threadId(message.getThreadId())
                .senderUserId(message.getSenderUserId())
                .senderRole(message.getSenderRole())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }
}