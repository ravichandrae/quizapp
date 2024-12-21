package org.schoolmela.quiz.controller;

import org.junit.jupiter.api.Test;
import org.schoolmela.quiz.model.Quiz;
import org.schoolmela.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuizController.class)
public class QuizControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuizService quizService;

    @Test
    public void createSampleQuiz() throws Exception {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        // Set other properties as needed

        when(quizService.createSampleQuiz(anyLong(), anyInt())).thenReturn(quiz);

        mockMvc.perform(post("/api/quizzes?userId=1&questionCount=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testGetQuiz() throws Exception {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        // Set other properties as needed

        when(quizService.getQuiz(1L)).thenReturn(Optional.of(quiz));

        mockMvc.perform(get("/api/quizzes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testGetUserQuizzes() throws Exception {
        Quiz quiz1 = new Quiz();
        quiz1.setId(1L);
        Quiz quiz2 = new Quiz();
        quiz2.setId(2L);

        when(quizService.getUserQuizzes(1L)).thenReturn(Arrays.asList(quiz1, quiz2));

        mockMvc.perform(get("/api/quizzes/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }
}
