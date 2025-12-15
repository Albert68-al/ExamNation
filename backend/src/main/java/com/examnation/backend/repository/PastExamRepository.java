package com.examnation.backend.repository;

import com.examnation.backend.model.PastExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PastExamRepository extends JpaRepository<PastExam, Long> {
    List<PastExam> findBySubject(String subject);
    List<PastExam> findBySubjectAndLevel(String subject, String level);
}