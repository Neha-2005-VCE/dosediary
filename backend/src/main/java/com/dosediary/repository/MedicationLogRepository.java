package com.dosediary.repository;

import com.dosediary.model.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {
    List<MedicationLog> findByUserId(Long userId);
    List<MedicationLog> findByScheduleId(Long scheduleId);
    List<MedicationLog> findByUserIdAndStatus(Long userId, String status);
}
