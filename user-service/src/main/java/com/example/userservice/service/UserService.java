// UserService.java
package com.example.userservice.service;

import com.example.userservice.dto.*;
import com.example.userservice.entity.Role;
import com.example.userservice.entity.User;
import com.example.userservice.exception.InvalidCredentialsException;
import com.example.userservice.exception.ResourceNotFoundException;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .message("User registered successfully")
                .user(UserResponse.from(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username/email or password"));

        if (!user.isActive()) {
            throw new InvalidCredentialsException("User is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username/email or password");
        }

        return AuthResponse.builder()
                .message("Login successful")
                .user(UserResponse.from(user))
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        return UserResponse.from(findUserEntity(id));
    }

    public List<UserResponse> getUsersByRole(String role) {
        return userRepository.findByRole(Enum.valueOf(com.example.userservice.entity.Role.class, role.toUpperCase()))
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserEntity(id);

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }

    public void deleteUser(Long id) {
        User user = findUserEntity(id);
        userRepository.delete(user);
    }

    public UserResponse syncCurrentUser(Jwt jwt) {
        String emailClaim = trimToNull(jwt.getClaimAsString("email"));
        String preferredUsername = trimToNull(jwt.getClaimAsString("preferred_username"));
        String subject = resolveIdentitySubject(jwt, preferredUsername, emailClaim);
        String username = firstNonBlank(
                preferredUsername,
                emailClaim,
                subject
        );
        String email = firstNonBlank(emailClaim, username + "@journal.local");
        String firstName = firstNonBlank(
                jwt.getClaimAsString("given_name"),
                username,
                "Journal"
        );
        String lastName = firstNonBlank(
                jwt.getClaimAsString("family_name"),
                "User"
        );
        Role role = resolveRole(jwt);

        User user = userRepository.findByKeycloakSubject(subject)
                .or(() -> findReusableUser(subject, email, username))
                .orElseGet(User::new);

        user.setKeycloakSubject(subject);
        user.setEmail(email != null ? email : user.getEmail());
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setActive(true);

        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode("kc:" + UUID.randomUUID()));
        }

        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }

    private User findUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private Optional<User> findReusableUser(String subject, String email, String username) {
        if (email != null) {
            Optional<User> byEmail = userRepository.findByEmail(email);
            if (byEmail.isPresent() && canReuse(byEmail.get(), subject)) {
                return byEmail;
            }
        }

        if (username != null) {
            Optional<User> byUsername = userRepository.findByUsername(username);
            if (byUsername.isPresent() && canReuse(byUsername.get(), subject)) {
                return byUsername;
            }
        }

        return Optional.empty();
    }

    private boolean canReuse(User user, String subject) {
        return user.getKeycloakSubject() == null || user.getKeycloakSubject().equals(subject);
    }

    private Role resolveRole(Jwt jwt) {
        Collection<String> roleNames = extractRealmRoles(jwt);

        if (roleNames.contains(Role.ADMIN.name())) {
            return Role.ADMIN;
        }
        if (roleNames.contains(Role.DOCTOR.name())) {
            return Role.DOCTOR;
        }
        if (roleNames.contains(Role.STAFF.name())) {
            return Role.STAFF;
        }

        return Role.PATIENT;
    }

    @SuppressWarnings("unchecked")
    private Collection<String> extractRealmRoles(Jwt jwt) {
        Object realmAccess = jwt.getClaim("realm_access");
        if (!(realmAccess instanceof Map<?, ?> realmAccessMap)) {
            return List.of();
        }

        Object roles = realmAccessMap.get("roles");
        if (roles instanceof Collection<?> roleCollection) {
            return roleCollection.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .toList();
        }

        return List.of();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String trimmed = trimToNull(value);
            if (trimmed != null) {
                return trimmed;
            }
        }
        return null;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String resolveIdentitySubject(Jwt jwt, String preferredUsername, String email) {
        String jwtSubject = trimToNull(jwt.getSubject());
        if (jwtSubject != null) {
            return jwtSubject;
        }

        if (preferredUsername != null) {
            return "preferred_username:" + preferredUsername;
        }

        if (email != null) {
            return "email:" + email.toLowerCase();
        }

        String tokenId = trimToNull(jwt.getId());
        return tokenId != null ? "jti:" + tokenId : null;
    }
}
