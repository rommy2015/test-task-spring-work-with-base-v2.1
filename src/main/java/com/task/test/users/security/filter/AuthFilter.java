package com.task.test.users.security.filter;

import com.task.test.users.security.service.impl.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * In the class we obtain from Security context
 * of current resource data of user
 * authentication that requests a resource.
 * Then data that have been got need to pack into the request
 * as one from attributes.
 */
@Component
public class AuthFilter implements Filter {


    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse,
                         FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;

        SecurityContext securityContext = SecurityContextHolder.getContext();

        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null) {

            UserDetailsImpl details = (UserDetailsImpl) authentication.getDetails();
            request.setAttribute("owner", details);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
