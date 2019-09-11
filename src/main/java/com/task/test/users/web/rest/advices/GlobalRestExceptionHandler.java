package com.task.test.users.web.rest.advices;

import com.task.test.users.web.rest.dto.RestErrorInfo;
import com.task.test.users.web.rest.exceptions.AuthorizationFailedException;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalRestExceptionHandler extends ResponseEntityExceptionHandler {


  @ExceptionHandler(Exception.class)
    public ResponseEntity<RestErrorInfo> defaultExceptionHandler(Exception ex) {

        RestErrorInfo errorInfo =
                new RestErrorInfo(HttpStatus.BAD_REQUEST.value(), ex.getMessage());


        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthorizationFailedException.class)
    public ResponseEntity<Object> handleIncorrectPassword(AuthorizationFailedException ex){

        RestErrorInfo errorInfo = new RestErrorInfo(
                HttpStatus.FORBIDDEN.value(),
                "Password is incorrect");

        return new ResponseEntity<>(errorInfo, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFoundResource(ResourceNotFoundException ex){

        RestErrorInfo errorInfo = new RestErrorInfo(

                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );

        return new ResponseEntity<>(errorInfo, HttpStatus.NOT_FOUND);
    }

}
