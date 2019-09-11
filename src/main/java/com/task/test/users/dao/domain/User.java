package com.task.test.users.dao.domain;

import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/*A table for users*/
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String login;

    private String password;

    private String email;

    @Column(name = "credit_number")
    private String creditNumber;

    private String telephone;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_reg")
    private Date dateReg;

    @Enumerated(value = EnumType.STRING)
    private Role authority;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status_user")
    private State statusUser;

    @OneToMany(mappedBy = "user")
    List<Token> tokens;

    public User() {
    }

    public User(Long id, String firstName,
                String lastName, String login,
                String password, String email,
                String creditNumber, String telephone,
                Date dateReg, Role authority,
                State statusUser) {
        this.id = id;
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

    @Nullable
    public Long getId() {
        return id;
    }

    public void setId(@Nullable Long id) {
        this.id = id;
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

    public Date getDateReg() {
        return dateReg;
    }

    public void setDateReg(Date dateReg) {
        this.dateReg = dateReg;
    }

    public Role getAuthority() {
        return authority;
    }

    public void setAuthority(Role authority) {
        this.authority = authority;
    }

    public State getStatusUser() {
        return statusUser;
    }

    public void setStatusUser(State statusUser) {
        this.statusUser = statusUser;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(login, user.login) &&
                Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, email);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", login='" + login + '\'' +
                ", password='" + "********" + '\'' +
                ", email='" + email + '\'' +
                ", creditNumber='" + creditNumber + '\'' +
                ", telephone='" + telephone + '\'' +
                ", dateReg=" + dateReg +
                ", authority=" + authority +
                ", statusUser=" + statusUser +
                '}';
    }

    public static class Builder {

        Long id;

        String firstName;

        String lastName;

        String login;

        String password;

        String email;

        String creditNumber;

        String telephone;

        Date dateReg;

        Role authority;

        State statusUser;

        public Builder() {
        }

        public Builder setId(Long id) {
            this.id = id;
            return this;
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

        public Builder setDateReg(Date dateReg) {
            this.dateReg = dateReg;
            return this;
        }

        public Builder setAuthority(Role authority) {
            this.authority = authority;
            return this;
        }

        public Builder setStatusUser(State statusUser) {
            this.statusUser = statusUser;
            return this;
        }

        public User build(){

            User user = new User(
                    this.id, this.firstName, this.lastName,
                     this.login, this.password, this.email,
                    this.creditNumber, this.telephone,
                    this.dateReg, this.authority,this.statusUser);

            return user;
        }
    }

}
