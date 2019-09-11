package com.task.test.users.security.service;


import com.task.test.users.security.dto.TokenDto;
import com.task.test.users.security.dto.UserCredentials;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;


public interface LoginService {

    TokenDto login(UserCredentials userCredentials) throws ResourceNotFoundException;

    ResponseEntity<Object> getUserByLoginForCredentials(String login) throws ResourceNotFoundException;

}
