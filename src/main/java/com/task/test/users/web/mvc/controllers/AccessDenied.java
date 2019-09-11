package com.task.test.users.web.mvc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AccessDenied {

    @GetMapping("/accessDenied")
    public ModelAndView showAccessDeniedPage() {

        return new ModelAndView("/WEB-INF/pages/accessDenied.html");
    }
}
