package com.dosediary.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionVersion {
    private LocalDateTime updatedAt;
    private String updatedBy;
    private String reason;

    // Flattened previous state snapshot
    private String previousMedicationName;
    private String previousDosage;
    private String previousInstructions;
}
