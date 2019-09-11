package com.task.test.users.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.UserRepository;
import com.task.test.users.service.UsersDeleteService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.service.mapper.UserMapper;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsersDeleteServiceImpl implements UsersDeleteService {

    private UserRepository userRepository;

    private UserMapper userMapper;

    @Autowired
    public UsersDeleteServiceImpl(UserRepository userRepository,
                                  UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    @Override
    public void deleteById(String id) throws ResourceNotFoundException {

        Long stringToLong = stringToLong(id);

        boolean existsById = userRepository.existsById(stringToLong);

        if(!existsById){
            throw new ResourceNotFoundException("There is no such user with this Id.");
        }

     userRepository.deleteById(stringToLong);
    }


    private Long stringToLong(String string) {
        return string != null && !string.isEmpty() ? Long.parseLong( string ) : null;
    }

    @Transactional
    @Override
    public void deleteListUsersByIds(List<UserDto> ids) {

        List<User> usersIds = userMapper.convertUserDtoListToUserList(ids);
        userRepository.deleteInBatch(usersIds);
    }
}
