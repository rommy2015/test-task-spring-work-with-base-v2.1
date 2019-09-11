package com.task.test.users.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.UserRepository;
import com.task.test.users.service.UserUpdateService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.service.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserUpdateServiceImpl implements UserUpdateService {

    private UserRepository userRepository;

    private UserMapper userMapper;

    @Autowired
    public UserUpdateServiceImpl(UserRepository userRepository,
                                 UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    @Override
    public List<UserDto> updateUsers(List<UserDto> list) {

        List<User> usersList = userMapper.convertUserDtoListToUserList(list);
        List<User> users = userRepository.saveAll(usersList);

        return userMapper.convertUserListToUserDtoList(users);

    }

}
