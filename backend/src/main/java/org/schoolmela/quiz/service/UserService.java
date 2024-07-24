package org.schoolmela.quiz.service;

import org.schoolmela.quiz.model.User;
import org.schoolmela.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        if (userRepository.existsByMobile(user.getMobile())) {
            throw new RuntimeException("User with this mobile number already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> getUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }
}
