package com.task.test.users.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.UserRepository;
import com.task.test.users.service.UserReadListService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.service.mapper.UserMapper;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserReadListServiceImpl implements UserReadListService {

    private UserRepository userRepository;

    private UserMapper userMapper;

    @Autowired
    public UserReadListServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    @Override
    public List<UserDto> getUsers() {
        List<User> list = userRepository.findAll();

        return userMapper.convertUserListToUserDtoList(list);
    }

    @Transactional
    @Override
    public List<UserDto> getUserListById(Long id) {
        List<User> list = userRepository.findAllById(id);

        return userMapper.convertUserListToUserDtoList(list);
    }



    @Transactional
    @Override
    public List<UserDto> getUserListByLogin(String login) throws ResourceNotFoundException {

        List<User> list = userRepository.findUsersByLogin(login);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("There is no such users with this login.");
        }

        return userMapper.convertUserListToUserDtoList(list);
    }
}
