package com.example.messageservice.service;

import com.example.messageservice.dto.*;
import com.example.messageservice.entity.Message;
import com.example.messageservice.entity.MessageThread;
import com.example.messageservice.exception.ResourceNotFoundException;
import com.example.messageservice.repository.MessageRepository;
import com.example.messageservice.repository.MessageThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageThreadRepository messageThreadRepository;
    private final MessageRepository messageRepository;

    public ThreadWithMessagesResponse createThreadWithFirstMessage(CreateThreadMessageRequest request) {
        LocalDateTime now = LocalDateTime.now();

        MessageThread thread = MessageThread.builder()
                .patientUserId(request.getPatientUserId())
                .staffUserId(request.getStaffUserId())
                .subject(request.getSubject())
                .createdAt(now)
                .updatedAt(now)
                .build();

        MessageThread savedThread = messageThreadRepository.save(thread);

        Message message = Message.builder()
                .threadId(savedThread.getId())
                .senderUserId(request.getSenderUserId())
                .senderRole(request.getSenderRole())
                .content(request.getContent())
                .sentAt(now)
                .build();

        Message savedMessage = messageRepository.save(message);

        return ThreadWithMessagesResponse.builder()
                .thread(ThreadResponse.from(savedThread))
                .messages(List.of(MessageResponse.from(savedMessage)))
                .build();
    }

    public MessageResponse replyToThread(Long threadId, ReplyMessageRequest request) {
        MessageThread thread = findThread(threadId);

        Message message = Message.builder()
                .threadId(threadId)
                .senderUserId(request.getSenderUserId())
                .senderRole(request.getSenderRole())
                .content(request.getContent())
                .sentAt(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);

        thread.setUpdatedAt(savedMessage.getSentAt());
        messageThreadRepository.save(thread);

        return MessageResponse.from(savedMessage);
    }

    public ThreadWithMessagesResponse getThread(Long threadId) {
        MessageThread thread = findThread(threadId);

        List<MessageResponse> messages = messageRepository.findByThreadIdOrderBySentAtAsc(threadId)
                .stream()
                .map(MessageResponse::from)
                .toList();

        return ThreadWithMessagesResponse.builder()
                .thread(ThreadResponse.from(thread))
                .messages(messages)
                .build();
    }

    public List<ThreadResponse> getThreadsForPatient(Long patientUserId) {
        return messageThreadRepository.findByPatientUserIdOrderByUpdatedAtDesc(patientUserId)
                .stream()
                .map(ThreadResponse::from)
                .toList();
    }

    public List<ThreadResponse> getThreadsForStaff(Long staffUserId) {
        return messageThreadRepository.findByStaffUserIdOrderByUpdatedAtDesc(staffUserId)
                .stream()
                .map(ThreadResponse::from)
                .toList();
    }

    public List<MessageResponse> getMessagesForThread(Long threadId) {
        findThread(threadId);

        return messageRepository.findByThreadIdOrderBySentAtAsc(threadId)
                .stream()
                .map(MessageResponse::from)
                .toList();
    }

    private MessageThread findThread(Long threadId) {
        return messageThreadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));
    }
}