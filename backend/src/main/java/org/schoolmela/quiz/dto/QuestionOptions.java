package org.schoolmela.quiz.dto;

import lombok.Data;
import org.schoolmela.quiz.entity.Option;
import org.schoolmela.quiz.entity.Question;

import java.util.List;

@Data
public class QuestionOptions {

    private Question question;
    private List<Option> options;
}
