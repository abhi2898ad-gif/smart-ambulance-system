package com.ambulance.smartambulance.service;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.LoginRequest;
import com.ambulance.smartambulance.dto.LoginResponse;
import com.ambulance.smartambulance.dto.RegisterRequest;
import com.ambulance.smartambulance.dto.UserResponse;
import com.ambulance.smartambulance.entity.Driver;
import com.ambulance.smartambulance.entity.User;
import com.ambulance.smartambulance.entity.enums.DriverStatus;
import com.ambulance.smartambulance.entity.enums.Role;
import com.ambulance.smartambulance.exception.BadRequestException;
import com.ambulance.smartambulance.repository.DriverRepository;
import com.ambulance.smartambulance.repository.UserRepository;
import com.ambulance.smartambulance.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, DriverRepository driverRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public ApiResponse<UserResponse> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.USER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(assignedRole)
                .address(request.getAddress())
                .build();

        User savedUser = userRepository.save(user);

        // If registered as DRIVER, create driver record
        if (assignedRole == Role.DRIVER) {
            String license = request.getLicenseNumber() != null ? request.getLicenseNumber() : "LIC-" + System.currentTimeMillis();
            Driver driver = Driver.builder()
                    .user(savedUser)
                    .licenseNumber(license)
                    .phone(savedUser.getPhone())
                    .status(DriverStatus.AVAILABLE)
                    .currentLatitude(17.3850) // Default Hyderabad baseline
                    .currentLongitude(78.4867)
                    .build();
            driverRepository.save(driver);
        }

        return ApiResponse.success("User registered successfully", UserResponse.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public ApiResponse<LoginResponse> login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        LoginResponse loginResponse = LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .role(user.getRole().name())
                .build();

        return ApiResponse.success("Login successful", loginResponse);
    }
}
