package org.schoolmela.quiz.dto;

import lombok.Data;
import org.schoolmela.quiz.entity.Question;

@Data
public class QuestionAnswer {

    public QuestionAnswer(Question question, String answer) {
        this.question = question;
        this.answer = answer;
    }
    private Question question;
    private String answer;
}
