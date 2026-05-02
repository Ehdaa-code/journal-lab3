package com.example.patientservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/health").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/patients").hasAnyRole("PATIENT", "DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/patients", "/api/patients/search").hasAnyRole("DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/patients/by-user/**", "/api/patients/journal/by-user/**").hasAnyRole("PATIENT", "DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/patients/doctor/**", "/api/patients/staff/**").hasAnyRole("DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/patients/*/notes", "/api/patients/*/conditions", "/api/patients/*/encounters", "/api/encounters/**").hasAnyRole("DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/conditions/**").hasAnyRole("DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/observations/**").hasAnyRole("PATIENT", "DOCTOR", "STAFF", "ADMIN")
                        .requestMatchers("/api/patients/**").hasAnyRole("PATIENT", "DOCTOR", "STAFF", "ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                ));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
        return converter;
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Object realmAccess = jwt.getClaim("realm_access");
        if (!(realmAccess instanceof Map<?, ?> realmAccessMap)) {
            return List.of();
        }

        Object roles = realmAccessMap.get("roles");
        if (!(roles instanceof Collection<?> roleCollection)) {
            return List.of();
        }

        return roleCollection.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role))
                .toList();
    }
}
