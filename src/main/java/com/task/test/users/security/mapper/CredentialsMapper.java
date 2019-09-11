package com.task.test.users.security.mapper;

import com.task.test.users.dao.domain.User;
import com.task.test.users.security.dto.UserCredentials;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;


/**
 * this mapper map data of class-entity User to class-dto
 * UserCredentials
 */
@Mapper(componentModel = "spring")
public interface CredentialsMapper {

    @Mappings({
            @Mapping(target = "login", source = "login"),
            @Mapping(target = "password", ignore = true)
    })
    UserCredentials userToUserCredentials(User user);


}
