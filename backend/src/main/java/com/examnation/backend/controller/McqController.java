package com.examnation.backend.controller;

import com.examnation.backend.model.McqQuestion;
import com.examnation.backend.model.McqQuiz;
import com.examnation.backend.service.McqService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mcqs")
public class McqController {

    private final McqService mcqService;

    public McqController(McqService mcqService) {
        this.mcqService = mcqService;
    }

    @GetMapping
    public ResponseEntity<List<McqQuiz>> getAllMcqQuizzes() {
        List<McqQuiz> quizzes = mcqService.getAllMcqQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<McqQuiz> getMcqQuizById(@PathVariable Long id) {
        McqQuiz quiz = mcqService.getMcqQuizById(id);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<McqQuiz>> getMcqQuizzesBySubject(@PathVariable String subject) {
        List<McqQuiz> quizzes = mcqService.getMcqQuizzesBySubject(subject);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/subject/{subject}/level/{level}")
    public ResponseEntity<List<McqQuiz>> getMcqQuizzesBySubjectAndLevel(
            @PathVariable String subject, @PathVariable String level) {
        List<McqQuiz> quizzes = mcqService.getMcqQuizzesBySubjectAndLevel(subject, level);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping
    public ResponseEntity<McqQuiz> createMcqQuiz(@RequestBody McqQuiz mcqQuiz) {
        McqQuiz savedQuiz = mcqService.saveMcqQuiz(mcqQuiz);
        return ResponseEntity.ok(savedQuiz);
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<McqQuestion> addQuestionToQuiz(
            @PathVariable Long quizId, @RequestBody McqQuestion question) {
        McqQuestion savedQuestion = mcqService.addQuestionToQuiz(quizId, question);
        return ResponseEntity.ok(savedQuestion);
    }

    @PutMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<McqQuestion> updateQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId,
            @RequestBody McqQuestion question
    ) {
        McqQuestion updated = mcqService.updateQuestion(quizId, questionId, question);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId
    ) {
        mcqService.deleteQuestion(quizId, questionId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<McqQuiz> updateMcqQuiz(@PathVariable Long id, @RequestBody McqQuiz mcqQuiz) {
        McqQuiz updated = mcqService.updateMcqQuiz(id, mcqQuiz);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMcqQuiz(@PathVariable Long id) {
        mcqService.deleteMcqQuiz(id);
        return ResponseEntity.noContent().build();
    }
}