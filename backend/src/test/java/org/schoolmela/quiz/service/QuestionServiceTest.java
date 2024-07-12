package org.schoolmela.quiz.service;

import org.junit.jupiter.api.Test;
import org.schoolmela.quiz.dto.QuestionAnswer;
import org.schoolmela.quiz.dto.QuestionOptions;
import org.schoolmela.quiz.dto.QuizResult;
import org.schoolmela.quiz.entity.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class QuestionServiceTest {
    @Autowired
    private QuestionService questionService;

    @Test
    public void testGenerateRandomQuestions() {
        List<QuestionOptions> questionList = questionService.generateRandomQuestions(3);
        assert questionList.size() == 3;
    }

    @Test
    public void testEvaluateQuestionAnswers() {
        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        Question question1 = new Question();
        question1.setQuestionId(108L);
        question1.setQuestionText("What is the capital city of India?");
        QuestionAnswer questionAnswer1 = new QuestionAnswer(question1, "New Delhi");

        Question question2 = new Question();
        question2.setQuestionId(107L);
        question2.setQuestionText("Who was the first president of India?");
        QuestionAnswer questionAnswer2 = new QuestionAnswer(question2, "Jawaharlal Nehru");

        questionAnswers.add(questionAnswer1);
        questionAnswers.add(questionAnswer2);

        QuizResult quizResult = questionService.evaluateQuestionAnswers(questionAnswers);
        assert quizResult.getScore() == 1;
    }
}
