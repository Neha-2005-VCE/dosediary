package com.dosediary.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Patient ID
    private Long doctorId; // Doctor ID
    private String patientName;
    private String doctorName;
    private String medicationName;
    private String dosage;
    private String frequency; // Added for frontend parity
    private String duration;
    private String instructions;

    @Column(length = 2000)
    private String pdfUrl; // Simulated PDF download URL

    private LocalDate issuedDate;
    private LocalDate expiryDate;

    private String renewalPeriod; // e.g. "6 months"
    private String status; // ACTIVE, EXPIRED, RENEW_REQUIRED

    @ElementCollection
    @CollectionTable(name = "prescription_versions", joinColumns = @JoinColumn(name = "prescription_id"))
    @Builder.Default
    private java.util.List<PrescriptionVersion> history = new java.util.ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (issuedDate == null)
            issuedDate = LocalDate.now();
        if (status == null)
            status = "ACTIVE";
    }
}
