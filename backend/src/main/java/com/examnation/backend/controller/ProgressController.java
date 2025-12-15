package com.examnation.backend.controller;

import com.examnation.backend.model.Progress;
import com.examnation.backend.model.Student;
import com.examnation.backend.security.UserPrincipal;
import com.examnation.backend.service.ProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<Progress>> getMyProgress(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        
        List<Progress> progressList = progressService.getStudentProgress(currentUser.getId());
        return ResponseEntity.ok(progressList);
    }

    @PostMapping
    public ResponseEntity<Progress> saveProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Progress progress) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        if (progress == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Progress data cannot be null");
        }

        // Create a minimal student object with just the ID
        Student student = new Student();
        student.setId(currentUser.getId());
        progress.setStudent(student);
        
        Progress savedProgress = progressService.saveProgress(progress);
        return ResponseEntity.ok(savedProgress);
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<Progress> getMyQuizProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long quizId) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        if (quizId == null || quizId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quiz ID");
        }

        Progress progress = progressService.getStudentQuizProgress(currentUser.getId(), quizId);
        if (progress == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress not found for this quiz");
        }
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<Progress> getMyExamProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long examId) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        if (examId == null || examId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid exam ID");
        }

        Progress progress = progressService.getStudentExamProgress(currentUser.getId(), examId);
        if (progress == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress not found for this exam");
        }
        return ResponseEntity.ok(progress);
    }
}