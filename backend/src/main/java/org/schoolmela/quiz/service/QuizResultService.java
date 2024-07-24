package org.schoolmela.quiz.service;

import jakarta.transaction.Transactional;
import org.schoolmela.quiz.model.Option;
import org.schoolmela.quiz.model.Quiz;
import org.schoolmela.quiz.model.QuizResult;
import org.schoolmela.quiz.repository.OptionRepository;
import org.schoolmela.quiz.repository.QuizRepository;
import org.schoolmela.quiz.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizResultService {
    @Autowired
    private QuizResultRepository quizResultRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private OptionRepository optionRepository;

    @Transactional
    public QuizResult submitQuiz(Long quizId, List<Long> selectedOptionIds) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (quiz.isCompleted()) {
            throw new RuntimeException("Quiz already submitted");
        }

        int score = calculateScore(quiz, selectedOptionIds);
        int totalQuestions = quiz.getQuestions().size();

        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);

        quiz.setCompleted(true);
        quizRepository.save(quiz);

        return quizResultRepository.save(result);
    }

    private int calculateScore(Quiz quiz, List<Long> selectedOptionIds) {
        return (int) quiz.getQuestions().stream()
                .filter(question -> {
                    Optional<Option> selectedOption = optionRepository.findById(
                            selectedOptionIds.get(quiz.getQuestions().indexOf(question)));
                    return selectedOption.map(Option::isCorrect).orElse(false);
                })
                .count();
    }

    public List<QuizResult> getUserResults(Long userId) {
        return quizResultRepository.findByQuizUserId(userId);
    }
}
