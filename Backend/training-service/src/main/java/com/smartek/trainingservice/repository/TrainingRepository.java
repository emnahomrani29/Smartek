package com.smartek.trainingservice.repository;

import com.smartek.trainingservice.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    Optional<Training> findByTitle(String title);
    List<Training> findByCategory(String category);
    List<Training> findByLevel(String level);
}
