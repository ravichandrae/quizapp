package org.schoolmela.quiz.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.schoolmela.quiz.dto.QuizDTO;
import org.schoolmela.quiz.model.Question;
import org.schoolmela.quiz.model.Quiz;
import org.schoolmela.quiz.model.User;
import org.schoolmela.quiz.repository.QuestionRepository;
import org.schoolmela.quiz.repository.QuizRepository;
import org.schoolmela.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Quiz createSampleQuiz(Long userId, int questionCount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Question> questions = questionRepository.findRandomQuestions(questionCount);

        Quiz quiz = new Quiz();
        quiz.setUser(user);
        quiz.setQuestions(questions);
        quiz.setCompleted(false);

        return quizRepository.save(quiz);
    }

    @Transactional
    public QuizDTO createQuiz(Long userId, List<Long> questionIds) {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setUserId(userId);
        quizDTO.setQuestionIds(questionIds);
        return createQuiz(quizDTO);
    }

    public Optional<Quiz> getQuiz(Long quizId) {
        return quizRepository.findById(quizId);
    }

    public List<Quiz> getUserQuizzes(Long userId) {
        return quizRepository.findByUserId(userId);
    }

    @Transactional
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        User user = userRepository.findById(quizDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Fetch all questions by their IDs
        List<Question> questions = questionRepository.findAllById(quizDTO.getQuestionIds());

        if (questions.size() != quizDTO.getQuestionIds().size()) {
            throw new EntityNotFoundException("Some questions were not found");
        }

        Quiz quiz = new Quiz();
        quiz.setUser(user);
        quiz.setQuestions(questions);
        quiz.setCompleted(false);

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz);
    }

    public QuizDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
        return convertToDTO(quiz);
    }

    @Transactional
    public QuizDTO updateQuiz(QuizDTO quizDTO) {
        Quiz existingQuiz = quizRepository.findById(quizDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));

        // Update questions
        List<Question> questions = questionRepository.findAllById(quizDTO.getQuestionIds());

        if (questions.size() != quizDTO.getQuestionIds().size()) {
            throw new EntityNotFoundException("Some questions were not found");
        }

        existingQuiz.setQuestions(questions);
        Quiz savedQuiz = quizRepository.save(existingQuiz);
        return convertToDTO(savedQuiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    public List<QuizDTO> getQuizzesByUserId(Long userId) {
        return quizRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Quiz> getAllQuizzes() {
        return new ArrayList<>(quizRepository.findAll());
    }

    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setUserId(quiz.getUser().getId());
        dto.setCompleted(quiz.isCompleted());
        dto.setQuestionIds(quiz.getQuestions().stream()
                .map(Question::getId)
                .collect(Collectors.toList()));
        return dto;
    }
}
