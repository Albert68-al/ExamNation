package com.examnation.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {
    
    @Column(length = 100)
    private String school;
    
    @Column(length = 50)
    private String level;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(length = 50)
    private String city;

    // Constructeur explicite si Lombok ne fonctionne pas
    public Student() {
        super();
    }
}