package com.examnation.backend.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.Year;

@Entity
@Table(name = "past_exams")
@Data
public class PastExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Year year;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileType;
}