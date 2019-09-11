package com.task.test.users.dao.repository;

import com.task.test.users.dao.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {

    User findByLogin(String login);

    List<User> findUsersByLogin(String login);

    List<User> findAllById(Long id);

    User findByEmail(String email);

}
