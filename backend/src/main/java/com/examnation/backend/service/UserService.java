package com.examnation.backend.service;

import com.examnation.backend.dto.mappers.UserMapper;
import com.examnation.backend.dto.responses.UserProfile;
import com.examnation.backend.exception.ResourceNotFoundException;
import com.examnation.backend.model.User;
import com.examnation.backend.repository.UserRepository;
import com.examnation.backend.security.UserPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfile getCurrentUser(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        return UserMapper.toUserProfile(user);
    }

    public UserProfile getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        return UserMapper.toUserProfile(user);
    }

    public UserProfile updateUser(UserPrincipal currentUser, UserProfile newProfile) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        user.setFirstName(newProfile.getFirstName());
        user.setLastName(newProfile.getLastName());
        user.setPhone(newProfile.getPhone());

        User updatedUser = userRepository.save(user);
        return UserMapper.toUserProfile(updatedUser);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}