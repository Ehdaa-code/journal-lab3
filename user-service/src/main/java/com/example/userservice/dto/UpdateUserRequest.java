// UpdateUserRequest.java
package com.example.userservice.dto;

import com.example.userservice.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Boolean active;
}