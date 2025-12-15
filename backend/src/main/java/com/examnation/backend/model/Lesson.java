package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "lessons")
@Data
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String level;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<FlashCard> flashCards;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<McqQuiz> mcqQuizzes;
}