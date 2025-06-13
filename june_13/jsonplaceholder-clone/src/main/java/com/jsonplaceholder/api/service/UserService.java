package com.jsonplaceholder.api.service;

import com.jsonplaceholder.api.dto.UserDto;
import com.jsonplaceholder.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDto createUser(User user);
    UserDto getUserById(Long id);
    Page<UserDto> getAllUsers(Pageable pageable);
    UserDto updateUser(Long id, User user);
    void deleteUser(Long id);
    UserDto getUserByUsername(String username);
    UserDto getUserByEmail(String email);
} 