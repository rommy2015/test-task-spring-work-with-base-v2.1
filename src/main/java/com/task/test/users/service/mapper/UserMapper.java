package com.task.test.users.service.mapper;

import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

/**
 * The mapper is worked for classes UserDto and User
 */
@Mapper(componentModel = "spring")
public interface UserMapper extends MapperUtils{

    /**
     *  Convert object of class UserDto into object of class User
     * Mapping(target...) - this field of object-target (that is User)
     * Mapping(source...) - this field of object-source (that is UserDto)
     *
     *   With these setting for mapping to occur convert a field
     * with type String в a field with type Date
     *
     * @param userDto - this object-source
     * @return - object-target of class UserDto
     */
    @Mappings({
            @Mapping(target = "dateReg", source = "userDto.dateReg",
                    dateFormat = "dd-MM-yyyy"),
            @Mapping( source = "authority", target = "authority" ),
            @Mapping(source = "statusUser" , target = "statusUser" )
    })
    User userDtoToUser(UserDto userDto);


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
            @Mapping(target = "dateReg", source = "user.dateReg",
                    dateFormat = "dd-MM-yyyy")
    })
     UserDto userToUserDto (User user);

    List<User> convertUserDtoListToUserList (List<UserDto> list);

    List<UserDto> convertUserListToUserDtoList (List<User> list);


}
