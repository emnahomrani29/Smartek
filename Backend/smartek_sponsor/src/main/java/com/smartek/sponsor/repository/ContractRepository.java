package com.smartek.sponsor.repository;

import com.smartek.sponsor.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findBySponsorId(Long sponsorId);
}
