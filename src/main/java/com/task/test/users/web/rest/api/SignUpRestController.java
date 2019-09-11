package com.task.test.users.web.rest.api;

import com.task.test.users.security.service.SignUpService;
import com.task.test.users.service.dto.UserFormDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequestMapping("api")
@RestController
public class SignUpRestController {


    private SignUpService signUpService;

    @Autowired
    public SignUpRestController(SignUpService signUpService) {

          this.signUpService = signUpService;

    }

    @PostMapping("signup")
    public ResponseEntity<Object> saveUser (@Valid @RequestBody UserFormDto userFormDto,
                                             BindingResult bindingResult){

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Invalid Input Parameters");
        }

        signUpService.signUp(userFormDto);

        return ResponseEntity.ok().build();
    }




}
