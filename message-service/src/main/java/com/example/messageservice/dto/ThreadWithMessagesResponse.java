package com.example.messageservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ThreadWithMessagesResponse {

    private ThreadResponse thread;
    private List<MessageResponse> messages;
}