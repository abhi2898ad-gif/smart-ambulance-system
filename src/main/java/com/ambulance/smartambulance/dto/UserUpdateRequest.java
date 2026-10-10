package com.ambulance.smartambulance.dto;

import com.ambulance.smartambulance.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UserUpdateRequest {
    private String name;

    @Email(message = "Valid email is required")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    private String address;
    private Role role;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String name, String email, String password, String phone, String address, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

    public static UserUpdateRequestBuilder builder() {
        return new UserUpdateRequestBuilder();
    }

    public static class UserUpdateRequestBuilder {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String address;
        private Role role;

        public UserUpdateRequestBuilder name(String name) { this.name = name; return this; }
        public UserUpdateRequestBuilder email(String email) { this.email = email; return this; }
        public UserUpdateRequestBuilder password(String password) { this.password = password; return this; }
        public UserUpdateRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public UserUpdateRequestBuilder address(String address) { this.address = address; return this; }
        public UserUpdateRequestBuilder role(Role role) { this.role = role; return this; }

        public UserUpdateRequest build() {
            return new UserUpdateRequest(name, email, password, phone, address, role);
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getFullName() { return name; }
    public void setFullName(String fullName) { if (this.name == null || this.name.isBlank()) this.name = fullName; }
}
