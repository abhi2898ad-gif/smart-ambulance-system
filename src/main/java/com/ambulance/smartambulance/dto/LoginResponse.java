package com.ambulance.smartambulance.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long userId, String name, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private Long userId;
        private String name;
        private String role;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public LoginResponseBuilder name(String name) { this.name = name; return this; }
        public LoginResponseBuilder role(String role) { this.role = role; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, userId, name, role);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UserResponse getUser() {
        com.ambulance.smartambulance.entity.enums.Role parsedRole = null;
        if (role != null) {
            try {
                parsedRole = com.ambulance.smartambulance.entity.enums.Role.valueOf(role);
            } catch (Exception ignored) {}
        }
        return UserResponse.builder()
                .id(userId)
                .name(name)
                .role(parsedRole)
                .build();
    }
}
