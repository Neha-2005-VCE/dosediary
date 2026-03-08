package com.dosediary.controller;

import com.dosediary.model.MedicationLog;
import com.dosediary.model.MedicationSchedule;
import com.dosediary.repository.MedicationLogRepository;
import com.dosediary.repository.MedicationScheduleRepository;
import com.dosediary.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MedicationController {
    private final MedicationScheduleRepository scheduleRepository;
    private final MedicationLogRepository logRepository;
    private final AnalyticsService analyticsService;
    private final com.dosediary.service.NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<MedicationSchedule> getSchedules(@PathVariable Long userId) {
        return scheduleRepository.findByUserIdAndActiveTrue(userId);
    }

    @PostMapping("/schedule")
    public ResponseEntity<MedicationSchedule> addMedication(@RequestBody MedicationSchedule schedule) {
        // Milestone 3: Daily, Alternate day, Custom timing logic simplified to string
        // in model
        MedicationSchedule saved = scheduleRepository.save(schedule);
        // Milestone 3: Setup email or push reminders for each dosage
        String notifyType = saved.getNotificationType() != null ? saved.getNotificationType() : "Push";
        notificationService.sendDosageReminder(saved.getUserId(), saved.getMedicationName(), notifyType);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/log")
    public ResponseEntity<MedicationLog> logDose(@RequestBody MedicationLog log) {
        // Milestone 3: mark-as-taken action
        MedicationLog savedLog = logRepository.save(log);
        analyticsService.calculateAdherence(log.getUserId(), log.getSchedule().getId());
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/analytics/{userId}")
    public List<Double> getAdherenceAnalysis(@PathVariable Long userId) {
        // Milestone 3: missed dose analytics, return adherence scores for all active
        // schedules
        return scheduleRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(MedicationSchedule::getAdherencePercentage)
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
