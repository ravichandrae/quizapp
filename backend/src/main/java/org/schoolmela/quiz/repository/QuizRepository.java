package org.schoolmela.quiz.repository;

import org.schoolmela.quiz.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserId(Long userId);
    List<Quiz> findByUserIdAndIsCompleted(Long userId, boolean isCompleted);
}