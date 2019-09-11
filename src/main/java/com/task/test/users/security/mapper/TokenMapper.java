package com.task.test.users.security.mapper;

import com.task.test.users.dao.domain.Token;
import com.task.test.users.security.dto.TokenDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TokenMapper {

    TokenDto tokenToTokenDto(Token token);
}
