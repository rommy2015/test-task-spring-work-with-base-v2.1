package com.task.test.users.security.token.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;

public class TokenAuthentication implements Authentication {

    private String tokenName;
    private boolean isAuthenticated;
    private UserDetails userDetails;

    public TokenAuthentication(String tokenName) {
        this.tokenName = tokenName;
    }

    public TokenAuthentication(String tokenName,
                               boolean isAuthenticated,
                               UserDetails userDetails) {
        this.tokenName = tokenName;
        this.isAuthenticated = isAuthenticated;
        this.userDetails = userDetails;
    }

    public String getTokenName() {
        return tokenName;
    }

    public void setTokenName(String tokenName) {
        this.tokenName = tokenName;
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return this.userDetails.getAuthorities();
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return this.userDetails;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }

    @Override
    public boolean isAuthenticated() {
        return this.isAuthenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.isAuthenticated  = isAuthenticated;
    }

    @Override
    public String getName() {
        return tokenName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TokenAuthentication that = (TokenAuthentication) o;
        return Objects.equals(tokenName, that.tokenName) &&
                Objects.equals(userDetails, that.userDetails);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tokenName, userDetails);
    }

    @Override
    public String toString() {
        return "TokenAuthentication{" +
                "tokenName='" + tokenName + '\'' +
                ", isAuthenticated=" + isAuthenticated +
                ", userDetails=" + userDetails +
                '}';
    }
}
