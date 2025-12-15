package com.examnation.backend.service;

import com.examnation.backend.model.Progress;
import com.examnation.backend.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final ProgressRepository progressRepository;

    public AnalyticsService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public Map<String, Object> getStudentAnalytics(Long studentId) {
        List<Progress> progressList = progressRepository.findByStudentId(studentId);
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Calculate average score
        double averageScore = progressList.stream()
                .mapToInt(Progress::getScore)
                .average()
                .orElse(0.0);
        analytics.put("averageScore", averageScore);
        
        // Count completed items
        long completedQuizzes = progressList.stream()
                .filter(p -> p.getQuiz() != null)
                .count();
        analytics.put("completedQuizzes", completedQuizzes);
        
        long completedExams = progressList.stream()
                .filter(p -> p.getExam() != null)
                .count();
        analytics.put("completedExams", completedExams);
        
        return analytics;
    }

    public Map<String, Object> getSubjectAnalytics(String subject) {
        List<Progress> progressList = progressRepository.findByQuizSubjectOrExamSubject(subject, subject);
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Calculate average score for the subject
        double averageScore = progressList.stream()
                .mapToInt(Progress::getScore)
                .average()
                .orElse(0.0);
        analytics.put("averageScore", averageScore);
        
        // Count attempts
        analytics.put("totalAttempts", progressList.size());
        
        return analytics;
    }
}