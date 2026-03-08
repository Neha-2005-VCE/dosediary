package com.dosediary.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendPrescriptionValidatedNotification(Long patientId, String medicationName) {
        // Milestone 2 Feature: Patients receive notification once a prescription is
        // validated
        log.info("🔔 [NOTIFICATION] To Patient {}: Your prescription for '{}' has been validated and issued.",
                patientId, medicationName);
    }

    public void sendDosageReminder(Long patientId, String medicationName, String notificationType) {
        // Milestone 3 Feature: Send email or push reminders for each dosage
        log.info("⏰ [{}_REMINDER] To Patient {}: It's time to take your '{}' medication.",
                notificationType.toUpperCase(), patientId, medicationName);
    }

    public void sendDoctorAdherenceAlert(Long doctorId, Long patientId, String medicationName, double adherence) {
        // Milestone 3 Feature: Generate automatic alerts for doctors if adherence falls
        // below threshold
        log.warn(
                "🚨 [DOCTOR_ALERT] To Doctor {}: Patient {} adherence for '{}' dropped below threshold! Current compliance is {}%.",
                doctorId, patientId, medicationName, adherence);
    }
}
