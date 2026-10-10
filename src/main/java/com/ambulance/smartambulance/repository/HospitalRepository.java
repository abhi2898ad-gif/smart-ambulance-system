package com.ambulance.smartambulance.repository;

import com.ambulance.smartambulance.entity.Hospital;
import com.ambulance.smartambulance.entity.enums.HospitalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByStatus(HospitalStatus status);
    List<Hospital> findByStatusIn(Collection<HospitalStatus> statuses);
    long countByStatus(HospitalStatus status);
}
