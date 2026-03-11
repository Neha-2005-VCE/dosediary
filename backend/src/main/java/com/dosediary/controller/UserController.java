package com.dosediary.controller;

import com.dosediary.model.User;
import com.dosediary.model.UserRole;
import com.dosediary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toSafeMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/patients")
    public List<Map<String, Object>> getPatients() {
        return userRepository.findByRole(UserRole.PATIENT).stream()
                .map(this::toSafeMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(toSafeMap(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Return user data without password
    private Map<String, Object> toSafeMap(User user) {
        return Map.of(
                "id", String.valueOf(user.getId()),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "specialization", user.getSpecialization() != null ? user.getSpecialization() : "",
                "pharmacyName", user.getPharmacyName() != null ? user.getPharmacyName() : "",
                "medicalLicenseNumber", user.getMedicalLicenseNumber() != null ? user.getMedicalLicenseNumber() : "");
    }
}
