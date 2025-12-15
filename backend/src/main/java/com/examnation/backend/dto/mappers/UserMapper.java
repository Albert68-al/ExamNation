package com.examnation.backend.dto.mappers;

import com.examnation.backend.dto.responses.UserProfile;
import com.examnation.backend.model.User;

public class UserMapper {
    public static UserProfile toUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setId(user.getId());
        profile.setEmail(user.getEmail());
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setPhone(user.getPhone());
        return profile;
    }
}