package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
@Data
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private McqQuiz quiz;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private PastExam exam;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private int score;
    private int totalQuestions;
    private LocalDateTime completedAt;
}