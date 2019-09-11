package com.task.test.users.security.service.impl;

import com.task.test.users.dao.domain.State;
import com.task.test.users.dao.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;


public class UserDetailsImpl implements UserDetails {

    private User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    /**
     * This method convert of value that describes the level access
     * user to a data type  that Spring Security understands
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        String userRole = user.getAuthority().name();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userRole);
        return Collections.singletonList(authority);
    }

    @Override
    public String getPassword() {

        return user.getPassword();
    }

    @Override
    public String getUsername() {

        return user.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        State statusUser = user.getStatusUser();
        String nameStatus = statusUser.name();
        String nameBanned = State.BANNED.name();

        return !nameStatus.equals(nameBanned);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {

        State statusUser = user.getStatusUser();
        String nameStatus = statusUser.name();
        String nameActive = State.ACTIVE.name();

        return nameStatus.equals(nameActive);
    }

    public User getUser() {

        return user;
    }

    @Override
    public String toString() {
        return "UserDetailsImpl{" +
                "user=" + user +
                '}';
    }
}
