package org.schoolmela.quiz.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.schoolmela.quiz.model.Quiz;
import org.schoolmela.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quiz Management", description = "Operations pertaining to Quiz")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Operation(summary = "Create a new quiz", description = "Creates a new quiz in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created the quiz"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })

    @PostMapping("/user/{userId}")
    public ResponseEntity<Quiz> createQuiz(@PathVariable Long userId, @RequestBody List<Long> questionIds) {
        return ResponseEntity.ok(quizService.createQuiz(userId, questionIds));
    }

    @PostMapping("/user/{userId}/sample")
    public ResponseEntity<Quiz> createSampleQuiz(@PathVariable Long userId, @RequestParam int questionCount) {
        return ResponseEntity.ok(quizService.createSampleQuiz(userId, questionCount));
    }

    @Operation(summary = "Get a quiz by quiz id", description = "Returns a quiz based on it's id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the quiz"),
            @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long quizId) {
        return quizService.getQuiz(quizId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get a list of quizzes by user", description = "Returns a list quizzes for the given user id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the quizzes"),
            @ApiResponse(responseCode = "404", description = "user not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Quiz>> getUserQuizzes(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getUserQuizzes(userId));
    }
}
