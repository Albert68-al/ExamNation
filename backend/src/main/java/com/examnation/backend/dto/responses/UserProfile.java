package com.examnation.backend.dto.responses;

import lombok.Data;

@Data
public class UserProfile {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
}