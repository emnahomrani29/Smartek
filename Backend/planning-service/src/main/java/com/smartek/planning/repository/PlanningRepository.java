package com.smartek.planning.repository;

import com.smartek.planning.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    
    @Query("SELECT p FROM Planning p WHERE p.date >= :date ORDER BY p.date ASC, p.startTime ASC")
    List<Planning> findUpcomingPlannings(LocalDate date);
    
    @Query("SELECT p FROM Planning p WHERE p.date = :date ORDER BY p.startTime ASC")
    List<Planning> findPlanningsByDate(LocalDate date);
    
    @Query("SELECT p FROM Planning p WHERE p.date BETWEEN :startDate AND :endDate ORDER BY p.date ASC, p.startTime ASC")
    List<Planning> findPlanningsByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p FROM Planning p WHERE p.date = :date AND p.eventType = :eventType ORDER BY p.startTime ASC")
    List<Planning> findPlanningsByDateAndType(LocalDate date, String eventType);
    
    @Query("SELECT p FROM Planning p WHERE p.date = :date AND " +
           "((p.startTime <= :startTime AND p.endTime > :startTime) OR " +
           "(p.startTime < :endTime AND p.endTime >= :endTime) OR " +
           "(p.startTime >= :startTime AND p.endTime <= :endTime))")
    List<Planning> findConflictingPlannings(LocalDate date, LocalTime startTime, LocalTime endTime);
}
