package org.schoolmela.quiz.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.schoolmela.quiz.dto.OptionDTO;
import org.schoolmela.quiz.dto.QuestionDTO;
import org.schoolmela.quiz.dto.TagDTO;
import org.schoolmela.quiz.model.Option;
import org.schoolmela.quiz.model.Question;
import org.schoolmela.quiz.model.Tag;
import org.schoolmela.quiz.repository.OptionRepository;
import org.schoolmela.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @Autowired private QuestionRepository questionRepository;
    @Autowired private OptionRepository optionRepository;

    @Transactional
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Question question = new Question();
        question.setText(questionDTO.getText());

        List<Option> options = new ArrayList<>();
        for (OptionDTO optionDTO : questionDTO.getOptions()) {
            Option option = new Option();
            option.setText(optionDTO.getText());
            option.setCorrect(optionDTO.isCorrect());
            option.setQuestion(question);
            options.add(option);
        }

        question.setOptions(options);
        Question savedQuestion = questionRepository.save(question);
        return convertToDTO(savedQuestion);
    }

    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        return convertToDTO(question);
    }

    @Transactional
    public QuestionDTO updateQuestion(QuestionDTO questionDTO) {
        Question existingQuestion = questionRepository.findById(questionDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));

        existingQuestion.setText(questionDTO.getText());

        // Update options
        List<Option> updatedOptions = new ArrayList<>();
        for (OptionDTO optionDTO : questionDTO.getOptions()) {
            Option option;
            if (optionDTO.getId() != null) {
                option = optionRepository.findById(optionDTO.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Option not found"));
                option.setText(optionDTO.getText());
                option.setCorrect(optionDTO.isCorrect());
            } else {
                option = new Option();
                option.setText(optionDTO.getText());
                option.setCorrect(optionDTO.isCorrect());
                option.setQuestion(existingQuestion);
            }
            updatedOptions.add(option);
        }

        existingQuestion.setOptions(updatedOptions);
        Question savedQuestion = questionRepository.save(existingQuestion);
        return convertToDTO(savedQuestion);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert Question entity to DTO
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setText(question.getText());
        dto.setDifficulty(question.getDifficulty());
        dto.setOptions(question.getOptions().stream()
                .map(this::convertToOptionDTO)
                .collect(Collectors.toList()));
        dto.setTags(question.getTags().stream()
                .map(this::convertToTagDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private OptionDTO convertToOptionDTO(Option option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setText(option.getText());
        dto.setCorrect(option.isCorrect());
        return dto;
    }

    private TagDTO convertToTagDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        return dto;
    }
}