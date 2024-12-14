package org.schoolmela.quiz.service;

import org.schoolmela.quiz.dto.LoginResponse;
import org.schoolmela.quiz.model.User;
import org.schoolmela.quiz.repository.UserRepository;
import org.schoolmela.quiz.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public User createUser(User user) {
        if (userRepository.existsByMobile(user.getMobile())) {
            throw new RuntimeException("User with this mobile number already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> getUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }
    public LoginResponse authenticateUser(String mobile, String pin) {
        // Find user by mobile number
        Optional<User> userOptional = userRepository.findByMobile(mobile);

        // Validate user and pin
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // TODO: Replace with secure password comparison
            if (user.getPin().equals(pin)) {
                // Generate JWT token
                String token = jwtTokenUtil.generateToken(mobile, user.getName());

                // Create login response
                LoginResponse response = new LoginResponse();
                response.setToken(token);
                response.setName(user.getName());
                response.setMobile(user.getMobile());

                return response;
            }
        }

        // Authentication failed
        return null;
    }

    public User getUserFromToken(String authorizationHeader) {
        // Remove "Bearer " prefix if present
        String token = authorizationHeader.replace("Bearer ", "");

        // Validate token
        if (!jwtTokenUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Extract mobile from token
        String mobile = jwtTokenUtil.getMobileFromToken(token);

        // Retrieve user
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
