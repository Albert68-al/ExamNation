package com.examnation.backend.service;

import com.examnation.backend.exception.ResourceNotFoundException;
import com.examnation.backend.model.McqQuestion;
import com.examnation.backend.model.McqQuiz;
import com.examnation.backend.repository.McqQuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class McqService {

    private final McqQuizRepository mcqQuizRepository;

    public McqService(McqQuizRepository mcqQuizRepository) {
        this.mcqQuizRepository = mcqQuizRepository;
    }

    public List<McqQuiz> getAllMcqQuizzes() {
        return mcqQuizRepository.findAll();
    }

    public McqQuiz getMcqQuizById(Long id) {
        return mcqQuizRepository.findById(id).orElse(null);
    }

    public List<McqQuiz> getMcqQuizzesBySubject(String subject) {
        return mcqQuizRepository.findBySubject(subject);
    }

    public List<McqQuiz> getMcqQuizzesBySubjectAndLevel(String subject, String level) {
        return mcqQuizRepository.findBySubjectAndLevel(subject, level);
    }

    public McqQuiz saveMcqQuiz(McqQuiz mcqQuiz) {
        return mcqQuizRepository.save(mcqQuiz);
    }

    public McqQuiz updateMcqQuiz(Long id, McqQuiz incoming) {
        McqQuiz existing = mcqQuizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("McqQuiz", "id", id));
        existing.setTitle(incoming.getTitle());
        existing.setSubject(incoming.getSubject());
        existing.setLevel(incoming.getLevel());
        return mcqQuizRepository.save(existing);
    }

    public void deleteMcqQuiz(Long id) {
        mcqQuizRepository.deleteById(id);
    }

    public McqQuestion addQuestionToQuiz(Long quizId, McqQuestion question) {
        McqQuiz quiz = mcqQuizRepository.findById(quizId).orElse(null);
        if (quiz != null) {
            question.setQuiz(quiz);
            quiz.getQuestions().add(question);
            mcqQuizRepository.save(quiz);
            return question;
        }
        return null;
    }

    public McqQuestion updateQuestion(Long quizId, Long questionId, McqQuestion incoming) {
        McqQuiz quiz = mcqQuizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("McqQuiz", "id", quizId));
        McqQuestion question = quiz.getQuestions().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("McqQuestion", "id", questionId));

        question.setQuestionText(incoming.getQuestionText());
        question.setCorrectOptionIndex(incoming.getCorrectOptionIndex());
        if (incoming.getOptions() != null) {
            incoming.getOptions().forEach(o -> o.setQuestion(question));
            question.setOptions(incoming.getOptions());
        }
        mcqQuizRepository.save(quiz);
        return question;
    }

    public void deleteQuestion(Long quizId, Long questionId) {
        McqQuiz quiz = mcqQuizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("McqQuiz", "id", quizId));
        boolean removed = quiz.getQuestions().removeIf(q -> q.getId().equals(questionId));
        if (!removed) {
            throw new ResourceNotFoundException("McqQuestion", "id", questionId);
        }
        mcqQuizRepository.save(quiz);
    }
}