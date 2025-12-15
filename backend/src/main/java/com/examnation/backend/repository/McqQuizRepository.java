package com.examnation.backend.repository;

import com.examnation.backend.model.McqQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface McqQuizRepository extends JpaRepository<McqQuiz, Long> {
    List<McqQuiz> findBySubject(String subject);
    List<McqQuiz> findBySubjectAndLevel(String subject, String level);
}