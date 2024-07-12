package org.schoolmela.quiz.repository;

import org.schoolmela.quiz.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface OptionRepository extends JpaRepository<Option, Long> {
    @Query("SELECT o FROM Option o WHERE o.questionId in :questionIds")
    public List<Option> findAllByQuestionId(List<Long> questionIds);

    @Query("SELECT o.questionId, o.optionText FROM Option o WHERE o.questionId in :questionIds AND o.isCorrect = true")
    public List<Object[]> findCorrectOptionByQuestionId(List<Long> questionIds);
}
