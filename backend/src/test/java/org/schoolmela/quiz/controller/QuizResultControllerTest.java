package org.schoolmela.quiz.controller;

import org.junit.jupiter.api.Test;
import org.schoolmela.quiz.model.QuizResult;
import org.schoolmela.quiz.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuizResultController.class)
public class QuizResultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuizResultService quizResultService;

    @Test
    public void testSubmitQuiz() throws Exception {
        QuizResult result = new QuizResult();
        result.setId(1L);
        result.setScore(4);
        result.setTotalQuestions(5);

        when(quizResultService.submitQuiz(anyLong(), anyList())).thenReturn(result);

        mockMvc.perform(post("/api/quiz-results/1/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2, 3, 4, 5]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.score").value(4))
                .andExpect(jsonPath("$.totalQuestions").value(5));
    }

    @Test
    public void testGetUserResults() throws Exception {
        QuizResult result1 = new QuizResult();
        result1.setId(1L);
        result1.setScore(4);
        result1.setTotalQuestions(5);

        QuizResult result2 = new QuizResult();
        result2.setId(2L);
        result2.setScore(3);
        result2.setTotalQuestions(5);

        when(quizResultService.getUserResults(1L)).thenReturn(Arrays.asList(result1, result2));

        mockMvc.perform(get("/api/quiz-results/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].totalQuestions").value(5))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].score").value(3))
                .andExpect(jsonPath("$[1].totalQuestions").value(5));
    }
}