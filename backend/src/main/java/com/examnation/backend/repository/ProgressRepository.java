package com.examnation.backend.repository;

import com.examnation.backend.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByStudentId(Long studentId);
    List<Progress> findByQuizId(Long quizId);
    List<Progress> findByExamId(Long examId);
    Optional<Progress> findByStudentIdAndQuizId(Long studentId, Long quizId);
    Optional<Progress> findByStudentIdAndExamId(Long studentId, Long examId);
    List<Progress> findByQuizSubjectOrExamSubject(String quizSubject, String examSubject);
}