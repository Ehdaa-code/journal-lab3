package com.example.messageservice.repository;

import com.example.messageservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByThreadIdOrderBySentAtAsc(Long threadId);
}
