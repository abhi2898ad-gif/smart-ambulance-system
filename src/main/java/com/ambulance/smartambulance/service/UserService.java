package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.UserResponse;
import com.ambulance.smartambulance.dto.UserUpdateRequest;
import com.ambulance.smartambulance.entity.User;
import com.ambulance.smartambulance.entity.enums.Role;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.exception.ResourceNotFoundException;
import com.ambulance.smartambulance.repository.UserRepository;
import com.ambulance.smartambulance.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public ApiResponse<UserResponse> getUserProfile(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
        return ApiResponse.success("Profile retrieved successfully", UserResponse.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public ApiResponse<UserResponse> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ApiResponse.success("User retrieved successfully", UserResponse.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
        return ApiResponse.success("Users retrieved successfully", users);
    }

    @Transactional
    public ApiResponse<UserResponse> updateUser(Long id, UserUpdateRequest request, UserPrincipal currentUser) {
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are only allowed to update your own profile");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().toLowerCase().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new BadRequestException("Email already in use: " + newEmail);
            }
            user.setEmail(newEmail);
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        // Only ADMIN can change roles
        if (request.getRole() != null && currentUser.getRole() == Role.ADMIN) {
            user.setRole(request.getRole());
        }

        User updatedUser = userRepository.save(user);
        return ApiResponse.success("User updated successfully", UserResponse.fromEntity(updatedUser));
    }

    @Transactional
    public ApiResponse<Void> deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
        return ApiResponse.success("User deleted successfully", null);
    }
}
