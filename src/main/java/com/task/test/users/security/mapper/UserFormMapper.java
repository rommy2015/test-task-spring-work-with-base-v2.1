package com.task.test.users.security.mapper;

import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserFormDto;
import com.task.test.users.service.mapper.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

/**
 * the mapper is worked for classes UserForm and User
 */
@Mapper(componentModel = "spring")
public interface UserFormMapper extends MapperUtils {

    /**convert object of class UserFormDto into object of class User
     * Mapping(target = "id", ignore = true) - it means that field id`
     * don't mapping
     * @param userFormDto - this object-source
     * @return - object-target of class User
     */

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "dateReg", source = "userFormDto.dateReg", dateFormat = "dd-MM-yyyy"),
            @Mapping( source = "authority", target = "authority" ),
            @Mapping(source = "statusUser" , target = "statusUser" )
    })
    User userFormDtoToUser (UserFormDto userFormDto);


 }
