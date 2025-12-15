package com.examnation.backend.repository;

import com.examnation.backend.model.ForumTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumRepository extends JpaRepository<ForumTopic, Long> {
    List<ForumTopic> findBySubject(String subject);
}