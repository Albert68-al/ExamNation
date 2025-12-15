package com.examnation.backend.service;

import com.examnation.backend.exception.ResourceNotFoundException;
import com.examnation.backend.model.Lesson;
import com.examnation.backend.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id).orElse(null);
    }

    public List<Lesson> getLessonsBySubject(String subject) {
        return lessonRepository.findBySubject(subject);
    }

    public List<Lesson> getLessonsBySubjectAndLevel(String subject, String level) {
        return lessonRepository.findBySubjectAndLevel(subject, level);
    }

    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson incoming) {
        Lesson existing = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));
        existing.setTitle(incoming.getTitle());
        existing.setSubject(incoming.getSubject());
        existing.setLevel(incoming.getLevel());
        existing.setContent(incoming.getContent());
        return lessonRepository.save(existing);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}