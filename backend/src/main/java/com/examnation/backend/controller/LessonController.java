package com.examnation.backend.controller;

import com.examnation.backend.model.Lesson;
import com.examnation.backend.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public ResponseEntity<List<Lesson>> getAllLessons() {
        List<Lesson> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Lesson>> getLessonsBySubject(@PathVariable String subject) {
        List<Lesson> lessons = lessonService.getLessonsBySubject(subject);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/subject/{subject}/level/{level}")
    public ResponseEntity<List<Lesson>> getLessonsBySubjectAndLevel(
            @PathVariable String subject, @PathVariable String level) {
        List<Lesson> lessons = lessonService.getLessonsBySubjectAndLevel(subject, level);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(savedLesson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        Lesson updated = lessonService.updateLesson(id, lesson);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}