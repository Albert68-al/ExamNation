package com.examnation.backend.repository;

import com.examnation.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySubject(String subject);
    List<Lesson> findBySubjectAndLevel(String subject, String level);
}