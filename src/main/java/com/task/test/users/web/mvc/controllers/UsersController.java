package com.task.test.users.web.mvc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UsersController {

    @GetMapping("/users")
    public ModelAndView showUsersPage() {

         ModelAndView modelAndView =
                new ModelAndView("/WEB-INF/pages/users.html");
        return modelAndView;
    }
}
