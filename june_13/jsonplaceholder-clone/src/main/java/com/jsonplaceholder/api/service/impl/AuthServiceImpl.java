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
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Encode password and save user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
} 