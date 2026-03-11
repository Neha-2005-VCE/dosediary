package com.dosediary.controller;

import com.dosediary.model.Prescription;
import com.dosediary.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionRepository prescriptionRepository;
    private final com.dosediary.service.NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<Prescription> getPrescriptions(@PathVariable Long userId) {
        return prescriptionRepository.findByUserId(userId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    @GetMapping("/all")
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @PostMapping("/issue")
    public ResponseEntity<Prescription> issuePrescription(@RequestBody Prescription prescription) {
        Prescription saved = prescriptionRepository.save(prescription);
        notificationService.sendPrescriptionValidatedNotification(saved.getUserId(), saved.getMedicationName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription updates) {
        return prescriptionRepository.findById(id)
                .map(rx -> {
                    if (updates.getMedicationName() != null)
                        rx.setMedicationName(updates.getMedicationName());
                    if (updates.getDosage() != null)
                        rx.setDosage(updates.getDosage());
                    if (updates.getFrequency() != null)
                        rx.setFrequency(updates.getFrequency());
                    if (updates.getDuration() != null)
                        rx.setDuration(updates.getDuration());
                    if (updates.getInstructions() != null)
                        rx.setInstructions(updates.getInstructions());
                    if (updates.getExpiryDate() != null)
                        rx.setExpiryDate(updates.getExpiryDate());
                    if (updates.getStatus() != null)
                        rx.setStatus(updates.getStatus());
                    return ResponseEntity.ok(prescriptionRepository.save(rx));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<Prescription> renewPrescription(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(rx -> {
                    rx.setStatus("RENEWED");
                    rx.setExpiryDate(rx.getExpiryDate().plusMonths(6));
                    return ResponseEntity.ok(prescriptionRepository.save(rx));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
