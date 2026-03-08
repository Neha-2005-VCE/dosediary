package com.dosediary.repository;

import com.dosediary.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserId(Long userId);
    List<Prescription> findByUserIdAndStatus(Long userId, String status);
}
