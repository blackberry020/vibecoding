package com.jsonplaceholder.api.mapper;

import com.jsonplaceholder.api.dto.AddressDto;
import com.jsonplaceholder.api.dto.CompanyDto;
import com.jsonplaceholder.api.dto.GeoDto;
import com.jsonplaceholder.api.dto.UserDto;
import com.jsonplaceholder.api.dto.auth.LoginResponse;
import com.jsonplaceholder.api.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getEmail()
        );
        
        dto.setPhone(user.getPhone());
        dto.setWebsite(user.getWebsite());

        // Create AddressDto only if any address field is not null
        if (user.getStreet() != null || user.getSuite() != null || 
            user.getCity() != null || user.getZipcode() != null || 
            user.getGeoLat() != null || user.getGeoLng() != null) {
            
            AddressDto addressDto = new AddressDto();
            addressDto.setStreet(user.getStreet());
            addressDto.setSuite(user.getSuite());
            addressDto.setCity(user.getCity());
            addressDto.setZipcode(user.getZipcode());

            // Create GeoDto only if geo coordinates are not null
            if (user.getGeoLat() != null || user.getGeoLng() != null) {
                GeoDto geoDto = new GeoDto(user.getGeoLat(), user.getGeoLng());
                addressDto.setGeo(geoDto);
            }
            
            dto.setAddress(addressDto);
        }

        // Create CompanyDto only if any company field is not null
        if (user.getCompanyName() != null || user.getCompanyCatchPhrase() != null || 
            user.getCompanyBs() != null) {
            
            CompanyDto companyDto = new CompanyDto(
                user.getCompanyName(),
                user.getCompanyCatchPhrase(),
                user.getCompanyBs()
            );
            dto.setCompany(companyDto);
        }

        return dto;
    }

    public LoginResponse toLoginResponse(User user, String token) {
        if (user == null) {
            return null;
        }

        return new LoginResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUsername(),
            user.getEmail()
        );
    }
} 