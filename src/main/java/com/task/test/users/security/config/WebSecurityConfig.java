package com.task.test.users.security.config;

import com.task.test.users.security.filter.AuthFilter;
import com.task.test.users.security.handlers.CustomAccessDeniedHandler;
import com.task.test.users.security.token.filter.TokenAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;


@Configuration
@ComponentScan("com.task.test.users.security")
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final AuthenticationProvider authenticationProvider;

    private final TokenAuthFilter tokenAuthFilter;

    private final AuthFilter authFilter;

    @Autowired
    public WebSecurityConfig(AuthenticationProvider authenticationProvider,
                             TokenAuthFilter tokenAuthFilter, AuthFilter authFilter) {
        this.authenticationProvider = authenticationProvider;
        this.tokenAuthFilter = tokenAuthFilter;
        this.authFilter = authFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http

                .addFilterBefore(this.tokenAuthFilter, BasicAuthenticationFilter.class)
                .addFilterBefore(this.authFilter, BasicAuthenticationFilter.class)
                .antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/signUp/**").permitAll()
                .antMatchers("/api/signUp/**").permitAll()
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/api/users/login/**").permitAll()
                .antMatchers("/accessDenied/**").permitAll()
                .antMatchers("api/users/owner/**").permitAll()
                .antMatchers("/index/**").hasAnyAuthority("USER", "ADMIN")
                .antMatchers("/").hasAnyAuthority("USER", "ADMIN")
                .antMatchers("/admin/**").hasAuthority("ADMIN")
                .antMatchers("/users/**").hasAuthority("ADMIN")
                .antMatchers("/api/users/**").hasAuthority("ADMIN")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .usernameParameter("login")
                .defaultSuccessUrl("/index")
                .loginPage("/login").permitAll()
                .and()
                .exceptionHandling().accessDeniedHandler(accessDeniedHandler());
        http.csrf().disable();
    }

    /**
     * Here is defined the class that handler requests
     * that have been rejected Spring Security
     *
     * @return - bean the class CustomAccessDeniedHandler
     */
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

}

