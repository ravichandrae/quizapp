package org.schoolmela.quiz.controller;

import org.schoolmela.quiz.dto.QuestionAnswer;
import org.schoolmela.quiz.dto.QuestionOptions;
import org.schoolmela.quiz.dto.QuizResult;
import org.schoolmela.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuizController {
    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<QuestionOptions> generateQuiz(
            @RequestParam(name = "count", required = false, defaultValue = "5") int count) {
        return questionService.generateRandomQuestions(count);
    }

    @PostMapping
    public QuizResult evaluateQuiz(@RequestBody List<QuestionAnswer> questionAnswers) {
        return questionService.evaluateQuestionAnswers(questionAnswers);
    }
}
