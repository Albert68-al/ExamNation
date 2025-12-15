package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "flash_cards")
@Data
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String frontContent;

    @Column(nullable = false)
    private String backContent;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
}