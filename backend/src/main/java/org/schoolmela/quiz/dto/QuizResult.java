package org.schoolmela.quiz.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizResult {
    public QuizResult(int score, List<QuestionAnswer> questionAnswers) {
        this.score = score;
        this.answers = questionAnswers;
    }
    private int score;
    private List<QuestionAnswer> answers;
}
