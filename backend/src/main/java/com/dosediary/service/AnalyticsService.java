package com.dosediary.service;

import com.dosediary.model.MedicationLog;
import com.dosediary.model.MedicationSchedule;
import com.dosediary.repository.MedicationLogRepository;
import com.dosediary.repository.MedicationScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final MedicationLogRepository logRepository;
    private final MedicationScheduleRepository scheduleRepository;

    private final NotificationService notificationService;

    public double calculateAdherence(Long userId, Long scheduleId) {
        List<MedicationLog> logs = logRepository.findByScheduleId(scheduleId);
        if (logs.isEmpty())
            return 100.0;

        long takenCount = logs.stream()
                .filter(l -> "TAKEN".equalsIgnoreCase(l.getStatus()))
                .count();

        double percentage = Math.round((double) takenCount / logs.size() * 100.0);

        // Update schedule with new percentage
        scheduleRepository.findById(scheduleId).ifPresent(s -> {
            s.setAdherencePercentage(percentage);
            scheduleRepository.save(s);

            // Generate automatic alert for doctors if adherence falls below threshold (e.g.
            // 80%)
            if (percentage < 80.0) {
                // Assuming doctorId is 2 for demo purposes
                notificationService.sendDoctorAdherenceAlert(2L, s.getUserId(), s.getMedicationName(), percentage);
            }
        });

        return percentage;
    }

    public NotificationStatus checkAdherenceThreshold(Long userId, double threshold) {
        // Mock method to simulate Milestone 3: alerts for doctors if adherence falls
        // below threshold
        return new NotificationStatus("ALERT", "Adherence check complete");
    }

    public record NotificationStatus(String status, String message) {
    }
}
