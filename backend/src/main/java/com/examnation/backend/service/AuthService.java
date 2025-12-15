package com.examnation.backend.service;

import com.examnation.backend.dto.requests.*;
import com.examnation.backend.dto.responses.JwtAuthenticationResponse;
import com.examnation.backend.exception.AppException;
import com.examnation.backend.model.*;
import com.examnation.backend.repository.RoleRepository;
import com.examnation.backend.repository.UserRepository;
import com.examnation.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, 
                      RoleRepository roleRepository, PasswordEncoder passwordEncoder, 
                      JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AppException("User not found"));
        
        String role = user.getRoles().stream()
                .findFirst()
                .map(role1 -> role1.getName().name())
                .orElse("ROLE_USER");

        return new JwtAuthenticationResponse(
            jwt,
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            role
        );
    }

    public Long registerStudent(StudentSignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AppException("Email address already in use.");
        }

        Student student = new Student();
        student.setFirstName(signUpRequest.getFirstName());
        student.setLastName(signUpRequest.getLastName());
        student.setEmail(signUpRequest.getEmail());
        student.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        student.setPhone(signUpRequest.getPhone());
        student.setSchool(signUpRequest.getSchool());
        student.setLevel(signUpRequest.getLevel());
        student.setBirthDate(signUpRequest.getBirthDate());
        student.setCity(signUpRequest.getCity());

        Role userRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new AppException("User Role not set."));

        student.getRoles().add(userRole);

        User result = userRepository.save(student);
        return result.getId();
    }

    public Long registerAdmin(AdminSignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AppException("Email address already in use.");
        }

        Admin admin = new Admin();
        admin.setFirstName(signUpRequest.getFirstName());
        admin.setLastName(signUpRequest.getLastName());
        admin.setEmail(signUpRequest.getEmail());
        admin.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        admin.setPhone(signUpRequest.getPhone());
        admin.setDepartment(signUpRequest.getDepartment());
        admin.setPosition(signUpRequest.getPosition());

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new AppException("User Role not set."));

        admin.getRoles().add(adminRole);

        User result = userRepository.save(admin);
        return result.getId();
    }
}