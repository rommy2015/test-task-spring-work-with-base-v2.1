package com.task.test.users.security.token.filter;

import com.task.test.users.security.token.authentication.TokenAuthentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class TokenAuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest requestHttp = (HttpServletRequest) request;

        String token = requestHttp.getParameter("token");

        TokenAuthentication tokenAuthentication = new TokenAuthentication(token);

        if (token == null) {

            tokenAuthentication.setAuthenticated(false);
        } else {

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(tokenAuthentication);
        }

        chain.doFilter(request, response);

    }


    @Override
    public void destroy() {

    }
}
