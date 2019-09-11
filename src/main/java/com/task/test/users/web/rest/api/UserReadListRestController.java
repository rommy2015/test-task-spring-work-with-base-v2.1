package com.task.test.users.web.rest.api;

import com.task.test.users.service.UserReadListService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class UserReadListRestController {

    private UserReadListService userReadListService;

    @Autowired
    public UserReadListRestController(UserReadListService userReadListService) {
        this.userReadListService = userReadListService;
    }

    @GetMapping("users")
    public List<UserDto> getUsers() {

        return userReadListService.getUsers();
    }

    @GetMapping("users/{id}")
    public List<UserDto> getUser(@PathVariable Long id) {

        return userReadListService.getUserListById(id);
    }

    /**
     * That avoid ambiguity you need to apply a regular expression.
     *
     * @param login - string value (allows letters and symbols
     *              `.` and `-`)
     * @return - entry is packed into collection
     */
    @GetMapping("users/login/{login:[A-Za-z-.]+}")
    public List<UserDto> getUserByLogin(@PathVariable String login) throws ResourceNotFoundException {

        return userReadListService.getUserListByLogin(login);
    }

}
