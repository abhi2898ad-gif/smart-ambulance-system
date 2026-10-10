package com.ambulance.smartambulance.repository;

import com.ambulance.smartambulance.entity.Trip;
import com.ambulance.smartambulance.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDriverIdOrderByStartTimeDesc(Long driverId);
    Optional<Trip> findByEmergencyId(Long emergencyId);
    List<Trip> findByAmbulanceIdOrderByStartTimeDesc(Long ambulanceId);
    long countByStatus(TripStatus status);
}
