package com.dosediary.repository;

import com.dosediary.model.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {
    List<MedicationSchedule> findByUserIdAndActiveTrue(Long userId);
    List<MedicationSchedule> findByUserId(Long userId);
}
