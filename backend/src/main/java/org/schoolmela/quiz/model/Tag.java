package org.schoolmela.quiz.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tags")
public class Tag {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    @JsonBackReference
    @ManyToMany
    @JoinTable(
            name = "question_tags", // name of the join table
            joinColumns = @JoinColumn(name = "tag_id"), // foreign key to Tag
            inverseJoinColumns = @JoinColumn(name = "question_id") // foreign key to Question
    )
    private List<Question> questions;
}
