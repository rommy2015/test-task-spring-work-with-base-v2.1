package com.task.test.users.security.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.security.mapper.RequestOwnerMapper;
import com.task.test.users.security.service.RequestOwnerService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.web.rest.exceptions.AuthorizationFailedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletRequest;

@Service
public class RequestOwnerServiceImpl implements RequestOwnerService {

    private ServletRequest servletRequest;

    private RequestOwnerMapper requestOwnerMapper;

    @Autowired
    public RequestOwnerServiceImpl(ServletRequest servletRequest, RequestOwnerMapper requestOwnerMapper) {
        this.servletRequest = servletRequest;
        this.requestOwnerMapper = requestOwnerMapper;
    }

    @Override
    public UserDto getDataRequestOwner() {

        UserDetailsImpl owner = (UserDetailsImpl) servletRequest.getAttribute("owner");

        User user = owner.getUser();

        if (user != null) {

            return requestOwnerMapper.userRequestOwnerToUserDto(user);

        } else {
            throw new AuthorizationFailedException("You are not authorized.");
        }

    }
}
