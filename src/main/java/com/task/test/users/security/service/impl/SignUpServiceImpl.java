package com.task.test.users.security.service.impl;

import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.UserRepository;
import com.task.test.users.security.mapper.UserFormMapper;
import com.task.test.users.security.service.SignUpService;
import com.task.test.users.service.dto.UserFormDto;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignUpServiceImpl implements SignUpService {


    private UserRepository userRepository;


    private UserFormMapper userFormMapper;


    private PasswordEncoder passwordEncoder;


    public SignUpServiceImpl(UserRepository userRepository, UserFormMapper userFormMapper,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userFormMapper = userFormMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void signUp(UserFormDto userFormDto) {

        existsData(userFormDto);

        UserFormDto userForm = setEncryptPasswordToUser(userFormDto);

        User user = userFormMapper.userFormDtoToUser(userForm);

        userRepository.save(user);
    }

    /**
     * This method encrypts the password
     *
     * @param userFormDto - data from registration form
     * @return
     */
    private UserFormDto setEncryptPasswordToUser(UserFormDto userFormDto) {

        String hashPassword = passwordEncoder.encode(userFormDto.getPassword());

        userFormDto.setPassword(hashPassword);

        return userFormDto;
    }

    /**
     * This methods checks uniqueness of data
     *
     * @param userFormDto - data that is introduced
     *                    from registration form
     * @return value boolean
     */

    private void existsData(UserFormDto userFormDto) {

        boolean isLogin = existsLogin(userFormDto);
        boolean isEmail = existsEmail(userFormDto);

        if (isLogin && isEmail) {
            throw new RuntimeException("The entered login and email already exists in the database.");
        }

        if (isLogin) {
            throw new RuntimeException("The entered login already exists in the database.");
        }

        if (isEmail) {
            throw new RuntimeException("The entered email already exists in the database.");
        }

    }

    private boolean existsLogin(UserFormDto userFormDto) {

        String login = userFormDto.getLogin();

        User userByLogin = getUserByLogin(login);

        return userByLogin != null;

    }

    private boolean existsEmail(UserFormDto userFormDto) {

        String email = userFormDto.getEmail();

        User userByEmail = getUserByEmail(email);

        return userByEmail != null;
    }


    @Override
    public User getUserByLogin(String login) {

        return userRepository.findByLogin(login);

    }


    @Override
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email);
    }
}
