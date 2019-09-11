package com.task.test.users.security.service;

import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserFormDto;

/**
 * The interface describes check of data
 * from registration form
 */
public interface SignUpService {

    User getUserByLogin(String login);

    void signUp(UserFormDto userFormDto);

    User getUserByEmail(String email);


}
