package com.task.test.users.security.token.provider;

import com.task.test.users.dao.domain.Token;
import com.task.test.users.dao.domain.User;
import com.task.test.users.dao.repository.TokensRepository;
import com.task.test.users.security.token.authentication.TokenAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TokenAuthenticationProvider implements AuthenticationProvider {


    private TokensRepository tokensRepository;

    private UserDetailsService userDetailsService;


    @Autowired
    public TokenAuthenticationProvider(TokensRepository tokensRepository,
                                       UserDetailsService userDetailsService) {
        this.tokensRepository = tokensRepository;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        TokenAuthentication tokenAuthentication = (TokenAuthentication)authentication;

        Optional<Token> tokenCandidate =
                tokensRepository.findOneByValue(tokenAuthentication.getName());

        if (tokenCandidate.isPresent()) {

            Token token = tokenCandidate.get();
            User userFromToken = token.getUser();
            String userLoginFromToken = userFromToken.getLogin();

            UserDetails userDetails = userDetailsService.loadUserByUsername(userLoginFromToken);

            tokenAuthentication.setUserDetails(userDetails);
            tokenAuthentication.setAuthenticated(true);

            return tokenAuthentication;

        } else {
            throw new IllegalArgumentException("Bad token");
        }

    }


    @Override
    public boolean supports(Class<?> authentication) {

        return TokenAuthentication.class.equals(authentication);
    }
}
