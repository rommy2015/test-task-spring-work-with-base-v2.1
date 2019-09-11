package com.task.test.users.security.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {


   private UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User byLogin = userRepository.findByLogin(username);

       if(byLogin == null){
           throw new RuntimeException("User not found");
       }

        return new UserDetailsImpl(byLogin);
    }
}
