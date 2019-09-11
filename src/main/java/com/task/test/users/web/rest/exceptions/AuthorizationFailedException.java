package com.task.test.users.web.rest.exceptions;


public class AuthorizationFailedException extends RuntimeException {

    public AuthorizationFailedException() {
    }

    public AuthorizationFailedException(String message) {
        super(message);
    }

}
