package com.task.test.users.web.mvc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
@ComponentScan("com.task.test.users.web.mvc")
public class WebMvcConfig implements WebMvcConfigurer {

    @Bean
    InternalResourceViewResolver initViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("");
        viewResolver.setSuffix("");
        return viewResolver;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        ResourceHandlerRegistration resourceHandlerRegistration =
                registry.addResourceHandler(
                        "/resources/**",
                        "/resources/css/images/**",
                        "/WEB-INF/pages/**"
                );

        resourceHandlerRegistration.addResourceLocations(

                "/resources/",
                "/resources/css/images/",
                "/WEB-INF/pages/"
        );
    }
}
