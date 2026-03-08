package com.dosediary.auth;

import com.dosediary.model.User;
import com.dosediary.model.UserRole;
import com.dosediary.repository.UserRepository;
import com.dosediary.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .medicalLicenseNumber(request.getMedicalLicenseNumber())
                                .specialization(request.getSpecialization())
                                .medicalHistory(request.getMedicalHistory())
                                .pharmacyName(request.getPharmacyName())
                                .shopDetails(request.getShopDetails())
                                .build();
                user = repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .id(user.getId())
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .id(user.getId())
                                .build();
        }
}
