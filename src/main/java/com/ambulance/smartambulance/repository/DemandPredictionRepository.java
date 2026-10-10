package com.ambulance.smartambulance.repository;

import com.ambulance.smartambulance.entity.DemandPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandPredictionRepository extends JpaRepository<DemandPrediction, Long> {
    List<DemandPrediction> findByArea(String area);
    Optional<DemandPrediction> findFirstByAreaAndPredictionDateOrderByPredictionTimeDesc(String area, LocalDate predictionDate);
}
