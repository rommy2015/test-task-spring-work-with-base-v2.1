package com.task.test.users.security.mapper;

import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.service.mapper.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface RequestOwnerMapper extends MapperUtils {

    /**
     * Convert object of class User into object of class UserDto
     *
     * Mapping(target...) - this field of object-target (that is UserDto)
     * Mapping(source...) - this field of object-source (that is User)
     *
     * With these setting for mapping to occur convert a field
     * with type Date в a field with type String
     *
     * @param user - this object-source
     * @return - object-target of class UserDto
     */

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "login", ignore = true),
            @Mapping(target = "password", ignore = true),
            @Mapping(target = "email", ignore = true),
            @Mapping(target = "creditNumber", ignore = true),
            @Mapping(target = "telephone", ignore = true),
            @Mapping(target = "dateReg", ignore = true),
            @Mapping(target = "statusUser", ignore = true)
    })
     UserDto userRequestOwnerToUserDto (User user);
}
