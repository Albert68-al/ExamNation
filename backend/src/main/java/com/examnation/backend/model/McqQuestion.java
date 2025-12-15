package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "mcq_questions")
@Data
public class McqQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<McqOption> options;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private McqQuiz quiz;

    @Column(nullable = false)
    private int correctOptionIndex;
}