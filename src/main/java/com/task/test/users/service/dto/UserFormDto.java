package com.task.test.users.service.dto;

import java.util.Objects;


/**
 * The class is need to create new User
 */
public class UserFormDto {

    private String firstName;

    private String lastName;

    private String login;

    private String password;

    private String email;

    private String creditNumber;

    private String telephone;

    private String dateReg;

    private String authority;

    private String statusUser;

    public UserFormDto() {
    }

    public UserFormDto(String firstName, String lastName,
                       String login, String password,
                       String email, String creditNumber,
                       String telephone, String dateReg,
                       String authority, String statusUser) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.login = login;
        this.password = password;
        this.email = email;
        this.creditNumber = creditNumber;
        this.telephone = telephone;
        this.dateReg = dateReg;
        this.authority = authority;
        this.statusUser = statusUser;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCreditNumber() {
        return creditNumber;
    }

    public void setCreditNumber(String creditNumber) {
        this.creditNumber = creditNumber;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getDateReg() {
        return dateReg;
    }

    public void setDateReg(String dateReg) {
        this.dateReg = dateReg;
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public String getStatusUser() {
        return statusUser;
    }

    public void setStatusUser(String statusUser) {
        this.statusUser = statusUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFormDto that = (UserFormDto) o;
        return Objects.equals(login, that.login) &&
                Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, email);
    }

    @Override
    public String toString() {
        return "UserFormDto{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", login='" + login + '\'' +
                ", password='" + "*******" + '\'' +
                ", email='" + email + '\'' +
                ", creditNumber='" + creditNumber + '\'' +
                ", telephone='" + telephone + '\'' +
                ", dateReg=" + dateReg +
                ", authority='" + authority + '\'' +
                ", statusUser='" + statusUser + '\'' +
                '}';
    }

    public static class Builder{

         String firstName;

         String lastName;

         String login;

         String password;

         String email;

         String creditNumber;

         String telephone;

         String dateReg;

         String authority;

         String statusUser;

        public Builder() {
        }

        public Builder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder setLogin(String login) {
            this.login = login;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setCreditNumber(String creditNumber) {
            this.creditNumber = creditNumber;
            return this;
        }

        public Builder setTelephone(String telephone) {
            this.telephone = telephone;
            return this;
        }

        public Builder setDateReg(String dateReg) {
            this.dateReg = dateReg;
            return this;
        }

        public Builder setAuthority(String authority) {
            this.authority = authority;
            return this;
        }

        public Builder setStatusUser(String statusUser) {
            this.statusUser = statusUser;
            return this;
        }

        public UserFormDto build() {

            UserFormDto userFormDto = new UserFormDto(
                    this.firstName, this.lastName,
                    this.login, this.password, this.email,
                    this.creditNumber, this.telephone, this.dateReg,
                    this.authority, this.statusUser
                    );

            return userFormDto;
        }

    }
}
