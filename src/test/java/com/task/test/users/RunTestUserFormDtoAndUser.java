package com.task.test.users;

import com.task.test.users.dao.domain.User;
import com.task.test.users.service.dto.UserFormDto;
import com.task.test.users.security.mapper.UserFormMapper;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.assertEquals;

/** These test is need for check User and UserFormDto classes */
public class RunTestUserFormDtoAndUser {

    /** create an object of mapper that is need */
    private UserFormMapper mapper =  Mappers.getMapper(UserFormMapper.class);

    private static final String DATE_FORMAT = "dd-MM-yyyy";
    /**
     * This test is need to check convert of classes: User,
     *  userFormDto
     */
    @Test
    public void convertUserFormDtoToUser(){

        Date date = new Date();

        UserFormDto userFormDto = new UserFormDto.Builder()
                .setFirstName("Anna")
                .setLastName("Stark")
                .setLogin("a.stark")
                .setPassword("123")
                .setEmail("a.stark@mail.com")
                .setCreditNumber("12345678901234456")
                .setTelephone("375295404089")
                .setDateReg("10-12-2019")
                .build();

        System.out.println(userFormDto);


        User user = mapper.userFormDtoToUser(userFormDto);

        System.out.println();
        /**
         * this condition have performed if value from source class
         * equals value from class target
         */
        SimpleDateFormat formatToString = new SimpleDateFormat(DATE_FORMAT);

        String dateRegFromUser = formatToString.format(user.getDateReg());
        String dateRegFromUserFormDto = userFormDto.getDateReg();

        assertEquals(dateRegFromUser, dateRegFromUserFormDto );
        System.out.println(user);
    }
}
