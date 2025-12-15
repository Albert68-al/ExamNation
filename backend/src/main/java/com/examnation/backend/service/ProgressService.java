package com.examnation.backend.service;

import com.examnation.backend.model.Progress;
import com.examnation.backend.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;

    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public List<Progress> getStudentProgress(Long studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public Progress saveProgress(Progress progress) {
        return progressRepository.save(progress);
    }

    public List<Progress> getQuizProgress(Long quizId) {
        return progressRepository.findByQuizId(quizId);
    }

    public List<Progress> getExamProgress(Long examId) {
        return progressRepository.findByExamId(examId);
    }

    public Progress getStudentQuizProgress(Long studentId, Long quizId) {
        return progressRepository.findByStudentIdAndQuizId(studentId, quizId).orElse(null);
    }

    public Progress getStudentExamProgress(Long studentId, Long examId) {
        return progressRepository.findByStudentIdAndExamId(studentId, examId).orElse(null);
    }
}