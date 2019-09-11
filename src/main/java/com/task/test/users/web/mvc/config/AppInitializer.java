package com.task.test.users.web.mvc.config;

import com.task.test.users.dao.config.JpaConfigPersistence;
import com.task.test.users.security.config.WebSecurityConfig;
import com.task.test.users.service.config.ServiceConfig;
import com.task.test.users.web.rest.config.RestConfiguration;
import org.springframework.lang.Nullable;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.Filter;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;

public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {


    @Nullable
    @Override
    protected Class<?>[] getRootConfigClasses() {

        return new Class[]{
                JpaConfigPersistence.class,
                WebSecurityConfig.class
        };
    }

    @Nullable
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] {
                WebMvcConfig.class,
                ServiceConfig.class,
                RestConfiguration.class
        };
    }


    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }

    @Override
    protected FilterRegistration.Dynamic registerServletFilter(ServletContext servletContext, Filter filter) {

        FilterRegistration.Dynamic characterEncodingFilter =
                servletContext.addFilter("encodingFilter", new CharacterEncodingFilter());
        characterEncodingFilter.setInitParameter("encoding", "UTF-8");
        characterEncodingFilter.setInitParameter("forceEncoding", "true");
        characterEncodingFilter.addMappingForUrlPatterns(null, true, "/*");


        return characterEncodingFilter;
    }
}
