package com.task.test.users.security.service.impl;

import com.task.test.users.dao.domain.Token;
import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.TokensRepository;
import com.task.test.users.dao.repository.UserRepository;
import com.task.test.users.security.dto.TokenDto;
import com.task.test.users.security.dto.UserCredentials;
import com.task.test.users.security.mapper.TokenMapper;
import com.task.test.users.security.service.LoginService;

import com.task.test.users.web.rest.exceptions.AuthorizationFailedException;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.apache.commons.lang3.RandomStringUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class LoginServiceImpl implements LoginService {

    private TokensRepository tokensRepository;

    private PasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    private TokenMapper tokenMapper;

    @Autowired
    public LoginServiceImpl(TokensRepository tokensRepository,
                            PasswordEncoder passwordEncoder,
                            UserRepository userRepository,
                            TokenMapper tokenMapper) {
        this.tokensRepository = tokensRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.tokenMapper = tokenMapper;
    }

    /** The method checks of data that user have entered into
     *  form during authentication. If data exists than to equals
     *  these data with data that is into database. If data equals
     *  that generated token.
     *
     *
     * @param userCredentials -It is data that user have entered into
     *                        form during authentication.
     * @return token
     */
    @Transactional
    @Override
    public TokenDto login(UserCredentials userCredentials) throws ResourceNotFoundException {

        String login = userCredentials.getLogin();
        User userByLogin = userRepository.findByLogin(login);

        if(userByLogin != null){

            String passwordFromBase = userByLogin.getPassword();
            String passwordFromForm = userCredentials.getPassword();

            boolean isMatches = passwordEncoder.matches(passwordFromForm, passwordFromBase);


            if(isMatches){

                String random = RandomStringUtils.random(10, true, true);

                Token token = new Token.Builder()
                        .setUser(userByLogin)
                        .setValue(random)
                        .build();

                tokensRepository.save(token);

                return tokenMapper.tokenToTokenDto(token);

            } else {
                throw new AuthorizationFailedException();
            }

        } else {
            throw new ResourceNotFoundException("User not found");
        }
    }

    /**
     * Checks if the specified login exists in the database
     * @param login
     * @return - http status
     * @throws ResourceNotFoundException - if such login not exists that will throw Exception
     */
    @Transactional
    @Override
    public ResponseEntity<Object> getUserByLoginForCredentials(String login)
            throws ResourceNotFoundException {

        User userByLogin = userRepository.findByLogin(login);

        if(userByLogin == null){
            throw new ResourceNotFoundException("There is no such user with this login.");
        }

       return ResponseEntity.ok().body(HttpStatus.OK);
    }

}
