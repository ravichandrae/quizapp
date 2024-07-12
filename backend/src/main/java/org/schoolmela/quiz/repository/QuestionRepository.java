package org.schoolmela.quiz.repository;

import org.schoolmela.quiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT questionId FROM Question")
    public List<Long> getAllQuestionIds();
}
