package com.examnation.backend.controller;

import com.examnation.backend.dto.responses.ApiResponse;
import com.examnation.backend.dto.responses.UserProfile;
import com.examnation.backend.security.UserPrincipal;
import com.examnation.backend.service.UserService;
import org.springframework.security.core.Authentication;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

   @GetMapping("/me")
public ResponseEntity<?> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
    }

    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    // Retourne les infos de l'utilisateur par exemple
    return ResponseEntity.ok(userPrincipal);
}

    @PutMapping("/me")
    public ResponseEntity<UserProfile> updateUser(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserProfile newProfile) {
        UserProfile updatedProfile = userService.updateUser(currentUser, newProfile);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/checkEmailAvailability")
    public ResponseEntity<ApiResponse> checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userService.existsByEmail(email);
        return ResponseEntity.ok(new ApiResponse(isAvailable, "Email availability checked"));
    }
}