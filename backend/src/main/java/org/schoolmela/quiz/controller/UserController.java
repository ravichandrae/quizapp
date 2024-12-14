package org.schoolmela.quiz.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.schoolmela.quiz.dto.LoginRequest;
import org.schoolmela.quiz.dto.LoginResponse;
import org.schoolmela.quiz.dto.SignupRequest;
import org.schoolmela.quiz.model.User;
import org.schoolmela.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "User Management", description = "Operations pertaining to users in the Quiz Application")
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200", "http://localhost:5000"})
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @Operation(summary = "User Signup", description = "Register a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successfully created the user"),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            // Validate input
            if (signupRequest.getMobile() == null || signupRequest.getMobile().isEmpty()) {
                return ResponseEntity.badRequest().body("Mobile number is required");
            }
            if (signupRequest.getPin() == null || signupRequest.getPin().length() != 4) {
                return ResponseEntity.badRequest().body("PIN must be 4 digits");
            }

            // Create user
            User user = new User();
            user.setName(signupRequest.getName());
            user.setMobile(signupRequest.getMobile());
            user.setPin(signupRequest.getPin());
            user.setSchool(signupRequest.getSchool());
            user.setEmail(signupRequest.getEmail());

            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "User Login", description = "Authenticate user and generate token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged in"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validate input
            if (loginRequest.getMobile() == null || loginRequest.getMobile().isEmpty()) {
                return ResponseEntity.badRequest().body("Mobile number is required");
            }
            if (loginRequest.getPin() == null || loginRequest.getPin().length() != 4) {
                return ResponseEntity.badRequest().body("PIN must be 4 digits");
            }

            // Attempt login
            LoginResponse loginResponse = userService.authenticateUser(
                    loginRequest.getMobile(),
                    loginRequest.getPin()
            );

            if (loginResponse != null) {
                return ResponseEntity.ok(loginResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        }
    }

    @Operation(summary = "Get User Profile", description = "Retrieve user profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            // Extract user from token and retrieve profile
            User user = userService.getUserFromToken(token);
            if (user != null) {
                // Remove sensitive information before sending
                user.setPin(null);
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        }
    }
}