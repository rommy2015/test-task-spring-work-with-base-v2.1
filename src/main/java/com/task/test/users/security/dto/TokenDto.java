package com.task.test.users.security.dto;

public class TokenDto {

    private String value;

    public TokenDto() {
    }

    public TokenDto(String value) {
        this.value = value;
    }


    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "TokenDto{" +
                "value='" + value + '\'' +
                '}';
    }
}
