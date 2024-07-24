package org.schoolmela.quiz.service;

import jakarta.transaction.Transactional;
import org.schoolmela.quiz.model.Question;
import org.schoolmela.quiz.model.Quiz;
import org.schoolmela.quiz.model.User;
import org.schoolmela.quiz.repository.QuestionRepository;
import org.schoolmela.quiz.repository.QuizRepository;
import org.schoolmela.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Quiz createQuiz(Long userId, int questionCount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Question> questions = questionRepository.findRandomQuestions(questionCount);

        Quiz quiz = new Quiz();
        quiz.setUser(user);
        quiz.setQuestions(questions);
        quiz.setCompleted(false);

        return quizRepository.save(quiz);
    }

    public Optional<Quiz> getQuiz(Long quizId) {
        return quizRepository.findById(quizId);
    }

    public List<Quiz> getUserQuizzes(Long userId) {
        return quizRepository.findByUserId(userId);
    }
}
