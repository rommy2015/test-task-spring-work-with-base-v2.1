package com.task.test.users.web.rest.api;

import com.task.test.users.security.dto.TokenDto;
import com.task.test.users.security.service.LoginService;
import com.task.test.users.security.dto.UserCredentials;
import com.task.test.users.web.rest.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationRestController {

    private LoginService loginService;

    @Autowired
    public AuthenticationRestController(LoginService loginService) {
          this.loginService = loginService;

    }

    /**
     * That avoid ambiguity you need to apply a regular expression.
     *
     * @param login - string value (allows letters and symbols
     *              `.` and `-`)
     * @return - http status code if request have processed correctly
     */
    @GetMapping("/login/{login:[A-Za-z-.]+}")
    public ResponseEntity<Object> isUserByLogin(@PathVariable String login) throws ResourceNotFoundException {

        return loginService.getUserByLoginForCredentials(login);
    }

    @PostMapping("password")
    public ResponseEntity<TokenDto> isUserWithPassword(
            @Valid @RequestBody UserCredentials principal,
            BindingResult bindingResult) throws ResourceNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Invalid Input Parameters");
        }

        TokenDto token = loginService.login(principal);

        if(token.getValue() == null){
            throw new ResourceNotFoundException("A token do not get. " +
                    "You can try again.");
        }

        return ResponseEntity.ok(token);
    }
}
