package com.task.test.users.service;

import com.task.test.users.service.dto.UserDto;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;

import java.util.List;

/**
 * This interface describes operations read from
 * users table and return list of data
 */
public interface UserReadListService {

    List<UserDto> getUsers();

    List<UserDto> getUserListById(Long id);

    List<UserDto> getUserListByLogin (String login) throws ResourceNotFoundException;

}

