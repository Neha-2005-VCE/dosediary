package com.dosediary.auth;

import com.dosediary.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private UserRole role;

    // Doctor specific fields
    private String medicalLicenseNumber;
    private String specialization;

    // Patient specific fields
    private String medicalHistory;

    // Pharmacist specific fields
    private String pharmacyName;
    private String shopDetails;
}
