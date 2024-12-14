package org.schoolmela.quiz.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.schoolmela.quiz.model.QuizResult;
import org.schoolmela.quiz.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-results")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuizResultController {
    @Autowired
    private QuizResultService quizResultService;

    @Operation(summary = "Submit a quiz", description = "submit a quiz")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully submitted the quiz"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizResult> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody List<Long> selectedOptionIds) {
        return ResponseEntity.ok(quizResultService.submitQuiz(quizId, selectedOptionIds));
    }

    @Operation(summary = "Get quiz results for a given user", description = "Returns quiz results for the userid")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved quiz results"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizResult>> getUserResults(@PathVariable Long userId) {
        return ResponseEntity.ok(quizResultService.getUserResults(userId));
    }
}