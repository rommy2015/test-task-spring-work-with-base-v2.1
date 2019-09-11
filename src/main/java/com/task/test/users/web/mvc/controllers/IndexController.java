package com.task.test.users.web.mvc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.text.ParseException;

@Controller
public class IndexController {


	@GetMapping({"/", "/index"})
	public ModelAndView showUsersPage() throws ParseException {

		return new ModelAndView("/WEB-INF/pages/index.html");
	}

}
