package com.jsonplaceholder.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private AddressDto address;
    private String phone;
    private String website;
    private CompanyDto company;

    public UserDto(Long id, String name, String username, String email) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
    }
} 