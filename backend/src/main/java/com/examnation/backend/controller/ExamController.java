package com.examnation.backend.controller;

import com.examnation.backend.model.PastExam;
import com.examnation.backend.service.ExamService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<PastExam>> getAllPastExams() {
        List<PastExam> exams = examService.getAllPastExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PastExam> getPastExamById(@PathVariable Long id) {
        PastExam exam = examService.getPastExamById(id);
        return ResponseEntity.ok(exam);
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<PastExam>> getPastExamsBySubject(@PathVariable String subject) {
        List<PastExam> exams = examService.getPastExamsBySubject(subject);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/subject/{subject}/level/{level}")
    public ResponseEntity<List<PastExam>> getPastExamsBySubjectAndLevel(
            @PathVariable String subject, @PathVariable String level) {
        List<PastExam> exams = examService.getPastExamsBySubjectAndLevel(subject, level);
        return ResponseEntity.ok(exams);
    }

    @PostMapping
    public ResponseEntity<PastExam> createPastExam(@RequestBody PastExam pastExam) {
        PastExam savedExam = examService.savePastExam(pastExam);
        return ResponseEntity.ok(savedExam);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PastExam> createPastExamWithFile(
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam String level,
            @RequestParam String year,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        PastExam savedExam = examService.savePastExamWithFile(title, subject, level, year, file);
        return ResponseEntity.ok(savedExam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PastExam> updatePastExam(@PathVariable Long id, @RequestBody PastExam pastExam) {
        PastExam updated = examService.updatePastExam(id, pastExam);
        return ResponseEntity.ok(updated);
    }

    @PutMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PastExam> updatePastExamWithFile(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam String level,
            @RequestParam String year,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        PastExam updated = examService.updatePastExamWithFile(id, title, subject, level, year, file);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePastExam(@PathVariable Long id) {
        examService.deletePastExam(id);
        return ResponseEntity.noContent().build();
    }
}