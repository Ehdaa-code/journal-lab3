package com.example.messageservice.controller;

import com.example.messageservice.dto.CreateThreadMessageRequest;
import com.example.messageservice.dto.ReplyMessageRequest;
import com.example.messageservice.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<?> createThreadWithFirstMessage(@Valid @RequestBody CreateThreadMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.createThreadWithFirstMessage(request));
    }

    @PostMapping("/{threadId}/reply")
    public ResponseEntity<?> replyToThread(@PathVariable Long threadId,
                                           @Valid @RequestBody ReplyMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.replyToThread(threadId, request));
    }

    @GetMapping("/{threadId}")
    public ResponseEntity<?> getThread(@PathVariable Long threadId) {
        return ResponseEntity.ok(messageService.getThread(threadId));
    }

    @GetMapping("/{threadId}/messages")
    public ResponseEntity<?> getMessagesForThread(@PathVariable Long threadId) {
        return ResponseEntity.ok(messageService.getMessagesForThread(threadId));
    }

    @GetMapping("/patient/{patientUserId}")
    public ResponseEntity<?> getThreadsForPatient(@PathVariable Long patientUserId) {
        return ResponseEntity.ok(messageService.getThreadsForPatient(patientUserId));
    }

    @GetMapping("/staff/{staffUserId}")
    public ResponseEntity<?> getThreadsForStaff(@PathVariable Long staffUserId) {
        return ResponseEntity.ok(messageService.getThreadsForStaff(staffUserId));
    }
}