package com.task.test.users.web.rest.api;

import com.task.test.users.service.UsersDeleteService;
import com.task.test.users.service.dto.UserDto;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api")
public class UsersDeleteRestController {

     private UsersDeleteService usersDeleteService;

     @Autowired
    public UsersDeleteRestController(UsersDeleteService usersDeleteService) {
        this.usersDeleteService = usersDeleteService;
    }

    @PostMapping("users/delete/{id}")
    public ResponseEntity<Object> deleteUserById(@PathVariable String id)
            throws ResourceNotFoundException {

        usersDeleteService.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @PostMapping("users/delete")
    public ResponseEntity<Object> deleteUserListByIds(
            @Valid @RequestBody List<UserDto> ids,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Invalid Input Parameters");
        }

        usersDeleteService.deleteListUsersByIds(ids);

        return ResponseEntity.ok().build();
    }

}
