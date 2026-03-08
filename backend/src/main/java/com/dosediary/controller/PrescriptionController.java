package com.dosediary.controller;

import com.dosediary.model.Prescription;
import com.dosediary.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionRepository prescriptionRepository;
    private final com.dosediary.service.NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<Prescription> getPrescriptions(@PathVariable Long userId) {
        return prescriptionRepository.findByUserId(userId);
    }

    @PostMapping("/issue")
    public ResponseEntity<Prescription> issuePrescription(@RequestBody Prescription prescription) {
        // Issuing by doctor, simulated logic for Milestone 2
        Prescription saved = prescriptionRepository.save(prescription);
        notificationService.sendPrescriptionValidatedNotification(saved.getUserId(), saved.getMedicationName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<Prescription> renewPrescription(@PathVariable Long id) {
        // Milestone 2 requirement: renew for long-term medications
        return prescriptionRepository.findById(id)
                .map(rx -> {
                    rx.setStatus("RENEWED");
                    rx.setExpiryDate(rx.getExpiryDate().plusMonths(6)); // Default 6 months extension
                    return ResponseEntity.ok(prescriptionRepository.save(rx));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
