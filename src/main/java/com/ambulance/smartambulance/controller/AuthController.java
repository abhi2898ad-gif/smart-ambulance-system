package com.ambulance.smartambulance.controller;

import com.ambulance.smartambulance.dto.ApiResponse;
import com.ambulance.smartambulance.dto.LoginRequest;
import com.ambulance.smartambulance.dto.LoginResponse;
import com.ambulance.smartambulance.dto.RegisterRequest;
import com.ambulance.smartambulance.dto.UserResponse;
import com.ambulance.smartambulance.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping({"/", "/api", "/api/auth/health", "/health"})
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Smart Ambulance Emergency System is operational", "UP"));
    }

    @PostMapping({"/register", "/api/auth/register", "/api/users/register"})
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<UserResponse> response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping({"/login", "/api/auth/login"})
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<LoginResponse> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
