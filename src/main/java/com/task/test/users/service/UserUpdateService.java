package com.task.test.users.service;

import com.task.test.users.service.dto.UserDto;

import java.util.List;

public interface UserUpdateService {

    List<UserDto> updateUsers(List<UserDto> list);
}
