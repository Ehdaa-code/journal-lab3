// AuthResponse.java
package com.example.userservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String message;
    private UserResponse user;
}