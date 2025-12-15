package com.examnation.backend.dto.requests;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.validation.constraints.NotBlank;

@Data
@EqualsAndHashCode(callSuper=false)
public class AdminSignUpRequest extends SignupRequest {
    @NotBlank
    private String department;

    @NotBlank
    private String position;
}