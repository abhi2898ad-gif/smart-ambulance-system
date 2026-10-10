package com.ambulance.smartambulance.repository;

import com.ambulance.smartambulance.entity.Ambulance;
import com.ambulance.smartambulance.entity.enums.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {
    Optional<Ambulance> findByAmbulanceNumber(String ambulanceNumber);
    List<Ambulance> findByStatus(AmbulanceStatus status);
    Optional<Ambulance> findByDriverId(Long driverId);
    long countByStatus(AmbulanceStatus status);
}
