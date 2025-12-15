package com.examnation.backend.controller;

import com.examnation.backend.dto.requests.*;
import com.examnation.backend.dto.responses.ApiResponse;
import com.examnation.backend.dto.responses.JwtAuthenticationResponse;
import com.examnation.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping({"/api/auth", "/auth"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody StudentSignUpRequest signUpRequest) {
        Long userId = authService.registerStudent(signUpRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{id}")
                .buildAndExpand(userId).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Student registered successfully"));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminSignUpRequest signUpRequest) {
        Long userId = authService.registerAdmin(signUpRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{id}")
                .buildAndExpand(userId).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Admin registered successfully"));
    }
}