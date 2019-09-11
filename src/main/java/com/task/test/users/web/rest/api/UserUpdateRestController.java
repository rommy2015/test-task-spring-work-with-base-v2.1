package com.task.test.users.web.rest.api;

import com.task.test.users.service.UserUpdateService;
import com.task.test.users.service.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api")
public class UserUpdateRestController {

    private UserUpdateService userUpdateService;

    @Autowired
    public UserUpdateRestController(UserUpdateService userUpdateService) {
        this.userUpdateService = userUpdateService;
    }

    @PostMapping("users/update/list")
    public List<UserDto> saveUsers(@Valid @RequestBody List<UserDto> list,
                                   BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Invalid Input Parameters");
        }

        return userUpdateService.updateUsers(list);
    }
}
