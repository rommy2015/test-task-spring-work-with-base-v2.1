package com.task.test.users;


import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.service.dto.UserFormDto;
import com.task.test.users.service.mapper.UserMapper;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.assertEquals;

/** These test is need for check User and UserDto classes */
public class RunTestMapperUserAndUserDto {

    /** create an object of mapper that is need */
    private UserMapper mapper =  Mappers.getMapper(UserMapper.class);

    private static final String DATE_FORMAT = "dd-MM-yyyy";
    /**
     * This test is need to check convert of classes: User,
     * UserDto
     */
    @Test
    public void convertUserToUserDto() throws ParseException {

        Date date = new Date();

        User user = new User.Builder()
                .setId(1L)
                .setFirstName("Anna")
                .setLastName("Stark")
                .setLogin("a.stark")
                .setPassword("123")
                .setEmail("a.stark@mail.com")
                .setCreditNumber("12345678901234456")
                .setTelephone("375295404089")
                .setDateReg(date)
                .build();

        System.out.println(user);

        UserDto userDto = mapper.userToUserDto(user);

        System.out.println();

        /**
         * this condition have performed if value from source class
         * equals value from class target
         */
        SimpleDateFormat formatToString = new SimpleDateFormat(DATE_FORMAT);

        String DateRegFromUser = formatToString.format(user.getDateReg());

        assertEquals(userDto.getDateReg(),DateRegFromUser);

        System.out.println(userDto);

    }

    /**
     * This is happening check to convert object of type UserDto
     * into object of type User. In additional here is happening check
     * to convert a field type String into a field type Date
     */
    @Test
    public void convertUserDtoToUser(){

        UserDto userDto  = new UserDto.Builder()
                .setId("2")
                .setFirstName("Anna")
                .setLastName("Stark")
                .setLogin("a.stark")
                .setPassword("123")
                .setEmail("a.stark@mail.com")
                .setCreditNumber("12345678901234456")
                .setTelephone("375295404089")
                .setDateReg("10-05-2018")
                .build();

        System.out.println(userDto);

        User user  = mapper.userDtoToUser(userDto);

        SimpleDateFormat formatToString = new SimpleDateFormat(DATE_FORMAT);

        String dateRegFromUser = formatToString.format(user.getDateReg());

        System.out.println();
        assertEquals(userDto.getDateReg(), dateRegFromUser);

        System.out.println(user);

    }

}
