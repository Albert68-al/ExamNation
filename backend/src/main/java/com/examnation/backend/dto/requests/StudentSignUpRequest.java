package com.examnation.backend.dto.requests;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class StudentSignUpRequest extends SignupRequest {
    @NotBlank
    private String school;

    @NotBlank
    private String level;

    private LocalDate birthDate;

    @NotBlank
    private String city;
}