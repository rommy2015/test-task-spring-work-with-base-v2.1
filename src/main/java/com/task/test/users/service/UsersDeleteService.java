package com.task.test.users.service;

import com.task.test.users.service.dto.UserDto;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;

import java.util.List;

public interface UsersDeleteService {

    /**
     * This method delete entry of user
     * ans than return List of users
     * @param id users`s
     * @return List users
     */
    void deleteById(String id) throws ResourceNotFoundException;

    /**
     * The method is got collection of identifiers
     * @param ids - collection identifiers
     * @return
     */
    void deleteListUsersByIds(List<UserDto> ids);
}
