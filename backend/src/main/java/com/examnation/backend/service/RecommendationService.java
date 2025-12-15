package com.examnation.backend.service;

import com.examnation.backend.model.Lesson;
import com.examnation.backend.model.McqQuiz;
import com.examnation.backend.model.PastExam;
import com.examnation.backend.model.Progress;
import com.examnation.backend.repository.LessonRepository;
import com.examnation.backend.repository.McqQuizRepository;
import com.examnation.backend.repository.PastExamRepository;
import com.examnation.backend.repository.ProgressRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final McqQuizRepository mcqQuizRepository;
    private final PastExamRepository pastExamRepository;

    public RecommendationService(ProgressRepository progressRepository, LessonRepository lessonRepository,
                                McqQuizRepository mcqQuizRepository, PastExamRepository pastExamRepository) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.mcqQuizRepository = mcqQuizRepository;
        this.pastExamRepository = pastExamRepository;
    }

    public List<Lesson> recommendLessons(Long studentId, String subject) {
        List<Progress> progressList = progressRepository.findByStudentId(studentId);
        
        // Get all lessons for the subject
        List<Lesson> allLessons = lessonRepository.findBySubject(subject);
        
        // Filter out lessons the student has already completed
        return allLessons.stream()
                .filter(lesson -> progressList.stream()
                        .noneMatch(progress -> progress.getLesson() != null && progress.getLesson().getId().equals(lesson.getId())))
                .collect(Collectors.toList());
    }

    public List<McqQuiz> recommendQuizzes(Long studentId, String subject) {
        List<Progress> progressList = progressRepository.findByStudentId(studentId);
        
        // Get all quizzes for the subject
        List<McqQuiz> allQuizzes = mcqQuizRepository.findBySubject(subject);
        
        // Filter out quizzes the student has already completed
        return allQuizzes.stream()
                .filter(quiz -> progressList.stream()
                        .noneMatch(progress -> progress.getQuiz() != null && progress.getQuiz().getId().equals(quiz.getId())))
                .collect(Collectors.toList());
    }

    public List<PastExam> recommendExams(Long studentId, String subject) {
        List<Progress> progressList = progressRepository.findByStudentId(studentId);
        
        // Get all exams for the subject
        List<PastExam> allExams = pastExamRepository.findBySubject(subject);
        
        // Filter out exams the student has already completed
        return allExams.stream()
                .filter(exam -> progressList.stream()
                        .noneMatch(progress -> progress.getExam() != null && progress.getExam().getId().equals(exam.getId())))
                .collect(Collectors.toList());
    }
}