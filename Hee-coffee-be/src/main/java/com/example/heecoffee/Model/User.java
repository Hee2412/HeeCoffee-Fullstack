package com.example.heecoffee.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Integer id;

    @Column(name = "age")
    Integer age;

    @Column(name = "email")
    String email;

    @Column(name = "password")
    @JsonIgnore
    String password;

    @Column(name = "name")
    String name;

    @Column(name = "address")
    String address;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "role")
    String role;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
