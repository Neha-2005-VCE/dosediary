package com.dosediary.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Patient ID
    private String medicationName;
    private String dosage;

    private String frequency; // DAILY, ALTERNATE_DAY, CUSTOM
    private String timeOfDay; // 08:00 AM etc.
    private String notificationType; // EMAIL, PUSH, BOTH
    private String instructions; // Additional instructions

    private double adherencePercentage; // Calculated adherence

    private Boolean active;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (active == null)
            active = true;
        if (adherencePercentage == 0.0)
            adherencePercentage = 100.0;
    }
}
