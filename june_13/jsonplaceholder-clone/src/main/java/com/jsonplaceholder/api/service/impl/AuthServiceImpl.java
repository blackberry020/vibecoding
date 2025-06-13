package com.jsonplaceholder.api.service.impl;

import com.jsonplaceholder.api.dto.auth.LoginRequest;
import com.jsonplaceholder.api.dto.auth.LoginResponse;
import com.jsonplaceholder.api.exception.ResourceNotFoundException;
import com.jsonplaceholder.api.mapper.UserMapper;
import com.jsonplaceholder.api.model.User;
import com.jsonplaceholder.api.repository.UserRepository;
import com.jsonplaceholder.api.security.JwtService;
import com.jsonplaceholder.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return userMapper.toLoginResponse(user, token);
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public User register(User user) {
        log.info("Registering user: username={}, email={}", user.getUsername(), user.getEmail());
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                log.warn("Registration failed: Email already exists: {}", user.getEmail());
                throw new IllegalArgumentException("Email already exists");
            }
            if (userRepository.existsByUsername(user.getUsername())) {
                log.warn("Registration failed: Username already exists: {}", user.getUsername());
                throw new IllegalArgumentException("Username already exists");
            }
            // Encode password and save user
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            log.info("User registered successfully: id={}, username={}", savedUser.getId(), savedUser.getUsername());
            return savedUser;
        } catch (Exception e) {
            log.error("Registration failed for username={}, email={}: {}", user.getUsername(), user.getEmail(), e.getMessage(), e);
            throw e;
        }
    }
} 