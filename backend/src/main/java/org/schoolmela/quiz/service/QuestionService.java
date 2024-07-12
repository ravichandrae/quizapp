package org.schoolmela.quiz.service;

import org.schoolmela.quiz.dto.QuestionAnswer;
import org.schoolmela.quiz.dto.QuestionOptions;
import org.schoolmela.quiz.dto.QuizResult;
import org.schoolmela.quiz.entity.Option;
import org.schoolmela.quiz.entity.Question;
import org.schoolmela.quiz.repository.OptionRepository;
import org.schoolmela.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private OptionRepository optionRepository;

    public List<QuestionOptions> generateRandomQuestions(int count) {
        List<Long> questionIds = questionRepository.getAllQuestionIds();
        Collections.shuffle(questionIds, new Random());
        List<Long> randomQuestionIds = questionIds.subList(0, count);
        List<Question> randomQuestions = questionRepository.findAllById(randomQuestionIds);
        List<Option> questionOptions = optionRepository.findAllByQuestionId(randomQuestionIds);
        return prepareQuestionAnswerResponse(randomQuestions, questionOptions);
    }

    private List<QuestionOptions> prepareQuestionAnswerResponse(List<Question> questions, List<Option> options) {
        Map<Long, List<Option>> questionOptionsMap = options.stream().collect(Collectors.groupingBy(
                Option::getQuestionId));
        List<QuestionOptions> questionAnswerList = new ArrayList<>();
        for (Question question : questions) {
            QuestionOptions qna = new QuestionOptions();
            qna.setQuestion(question);
            qna.setOptions(questionOptionsMap.get(question.getQuestionId()));
            questionAnswerList.add(qna);
        }
        return questionAnswerList;
    }

    public QuizResult evaluateQuestionAnswers(List<QuestionAnswer> questionAnswers) {
        List<Long> questionIds = questionAnswers.stream()
                .map(QuestionAnswer::getQuestion)
                .map(Question::getQuestionId)
                .toList();
        List<Object[]> answers = optionRepository.findCorrectOptionByQuestionId(questionIds);
        Map<Long, String> questionIdAnswerMap = getQuestionIdAnswerMap(answers);
        int score = 0;
        List<QuestionAnswer> correctAnswers = new ArrayList<>();
        for (QuestionAnswer questionAnswer : questionAnswers) {
            Question question = questionAnswer.getQuestion();
            String submittedAnswer = questionAnswer.getAnswer();
            String actualAnswer = questionIdAnswerMap.get(question.getQuestionId());
            if (submittedAnswer.equals(actualAnswer)) {
                score++;
            }
            correctAnswers.add(new QuestionAnswer(questionAnswer.getQuestion(), actualAnswer));
        }
        return new QuizResult(score, correctAnswers);
    }

    private Map<Long, String> getQuestionIdAnswerMap(List<Object[]> questionIdAnswers) {
        Map<Long, String> questionIdAnswersMap = new HashMap<>();
        for(Object[] questionIdAnswer: questionIdAnswers) {
            questionIdAnswersMap.put((Long) questionIdAnswer[0], (String) questionIdAnswer[1]);
        }
        return questionIdAnswersMap;
    }
}
