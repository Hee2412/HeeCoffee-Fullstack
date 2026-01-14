package com.example.heecoffee.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.userDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http

                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        // 1. Public endpoints
                        .requestMatchers("/api/user/login", "/api/user/register", "/error", "/ws/**").permitAll()
                        .requestMatchers("/api/product/**", "/api/type/**").permitAll()
                        .requestMatchers("/api/order/qr/{id}", "/api/order/{orderId}/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/order").permitAll() // Guest checkout

                        // 2. Admin endpoints
                        .requestMatchers("/api/order/all", "/api/order/new-order", "/api/order/new-orders-count").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/order/{orderId}/status").hasRole("ADMIN")
                        .requestMatchers("/api/user/all", "/api/user/count").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/user/admin-update").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/user/{userId}").hasRole("ADMIN")
                        .requestMatchers("/api/order/sales-report").hasRole("ADMIN")

                        // 3. Authenticated endpoints (USER và ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/user/me").authenticated()
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/order/user/{userId}").authenticated()

                        // 4. Mọi request khác cần authenticated
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return builder.build();
    }
}




