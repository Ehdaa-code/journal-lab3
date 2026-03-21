package com.example.messageservice.repository;

import com.example.messageservice.entity.MessageThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageThreadRepository extends JpaRepository<MessageThread, Long> {

    List<MessageThread> findByPatientUserIdOrderByUpdatedAtDesc(Long patientUserId);

    List<MessageThread> findByStaffUserIdOrderByUpdatedAtDesc(Long staffUserId);

    Optional<MessageThread> findByPatientUserIdAndStaffUserIdAndSubject(Long patientUserId,
                                                                        Long staffUserId,
                                                                        String subject);
}