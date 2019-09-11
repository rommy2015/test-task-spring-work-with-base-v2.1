package com.task.test.users.service.mapper;

import com.task.test.users.dao.domain.Role;
import com.task.test.users.dao.domain.State;

public interface MapperUtils {

    default Role roleToEnum(String userFormDto){

        for (Role authority : Role.values()) {

            String name = authority.name();

            boolean isEquals = name.equalsIgnoreCase(userFormDto);

            if(isEquals){
                return authority;
            }
        }
        return null;
    }

    default State stateToEnum(String userFormDto){

        for (State state : State.values()) {

            String name = state.name();

            boolean isEquals = name.equalsIgnoreCase(userFormDto);

            if(isEquals){
                return state;
            }
        }
        return null;
    }

}
