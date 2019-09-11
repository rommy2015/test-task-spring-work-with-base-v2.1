package com.task.test.users.web.mvc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ProjectsController {

    @GetMapping("/projects")
    public ModelAndView showLoginPage() {

        return new ModelAndView("/WEB-INF/pages/projects.html");
    }
}
