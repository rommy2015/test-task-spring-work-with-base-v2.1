package com.task.test.users.dao.repository;

import com.task.test.users.dao.domain.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface TokensRepository extends JpaRepository<Token, Long> {

    Optional<Token> findOneByValue(String value);
}
