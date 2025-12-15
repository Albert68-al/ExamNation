package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "mcq_quizzes")
@Data
public class McqQuiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String level;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<McqQuestion> questions;
}