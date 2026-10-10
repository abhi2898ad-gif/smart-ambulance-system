package com.ambulance.smartambulance.repository;

import com.ambulance.smartambulance.entity.EmergencyRequest;
import com.ambulance.smartambulance.entity.enums.EmergencyPriority;
import com.ambulance.smartambulance.entity.enums.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    List<EmergencyRequest> findByUserIdOrderByRequestedAtDesc(Long userId);
    List<EmergencyRequest> findByAmbulanceIdOrderByRequestedAtDesc(Long ambulanceId);
    List<EmergencyRequest> findByHospitalIdOrderByRequestedAtDesc(Long hospitalId);
    List<EmergencyRequest> findByStatus(EmergencyStatus status);
    List<EmergencyRequest> findByStatusIn(Collection<EmergencyStatus> statuses);

    long countByPriority(EmergencyPriority priority);
    long countByEmergencyType(String emergencyType);
    long countByStatus(EmergencyStatus status);
    long countByStatusIn(Collection<EmergencyStatus> statuses);
    long countByRequestedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT e.emergencyType, COUNT(e) FROM EmergencyRequest e GROUP BY e.emergencyType")
    List<Object[]> countGroupedByEmergencyType();

    @Query("SELECT e.priority, COUNT(e) FROM EmergencyRequest e GROUP BY e.priority")
    List<Object[]> countGroupedByPriority();

    @Query("SELECT e.status, COUNT(e) FROM EmergencyRequest e GROUP BY e.status")
    List<Object[]> countGroupedByStatus();
}
