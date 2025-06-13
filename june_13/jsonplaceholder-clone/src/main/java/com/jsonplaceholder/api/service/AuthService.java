package com.jsonplaceholder.api.service;

import com.jsonplaceholder.api.dto.auth.LoginRequest;
import com.jsonplaceholder.api.dto.auth.LoginResponse;
import com.jsonplaceholder.api.model.User;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    User register(User user);
} 