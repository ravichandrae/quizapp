// lib/services/quiz_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/quiz.dart';
import '../models/quiz_result.dart';
import 'auth_service.dart';

class QuizService {
  static Future<Quiz> createSampleQuiz(int userId) async {
    try {
      print('Creating sample quiz for user $userId...');
      final response = await http.post(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.createSampleQuiz(userId)),
        headers: {
          'Authorization': 'Bearer ${AuthService.token}',
          'Content-Type': 'application/json',
        },
      );

      print('Create sample quiz response status: ${response.statusCode}');
      print('Create sample quiz response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          return Quiz.fromJson(json.decode(response.body));
        } catch (e) {
          print('Error parsing created quiz: $e');
          print('Raw response body: ${response.body}');
          rethrow;
        }
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Failed to create sample quiz: $errorMessage');
      }
    } catch (e) {
      print('Create sample quiz error: $e');
      rethrow;
    }
  }

  static Future<List<Quiz>> getUserQuizzes(int userId) async {
    try {
      print('Fetching quizzes for user $userId...');
      final response = await http.get(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.userQuizzes(userId)),
        headers: {
          'Authorization': 'Bearer ${AuthService.token}',
          'Content-Type': 'application/json',
        },
      );

      print('Quizzes response status: ${response.statusCode}');
      print('Quizzes response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final List<dynamic> quizList = json.decode(response.body);
          print('Successfully decoded JSON list of length: ${quizList.length}');
          
          final quizzes = quizList.map((quiz) {
            try {
              return Quiz.fromJson(quiz);
            } catch (e) {
              print('Error parsing individual quiz: $e');
              print('Problematic quiz data: $quiz');
              rethrow;
            }
          }).toList();
          
          print('Successfully parsed ${quizzes.length} quizzes');
          return quizzes;
        } catch (e) {
          print('Error parsing quiz list: $e');
          print('Raw response body: ${response.body}');
          rethrow;
        }
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Failed to load quizzes: $errorMessage');
      }
    } catch (e) {
      print('Get user quizzes error: $e');
      rethrow;
    }
  }

  static Future<Quiz> getQuiz(int quizId) async {
    try {
      print('Fetching quiz $quizId...');
      final response = await http.get(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.quizById(quizId)),
        headers: {
          'Authorization': 'Bearer ${AuthService.token}',
          'Content-Type': 'application/json',
        },
      );

      print('Quiz response status: ${response.statusCode}');
      print('Quiz response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final quiz = Quiz.fromJson(json.decode(response.body));
          print('Successfully parsed quiz ${quiz.id}');
          return quiz;
        } catch (e) {
          print('Error parsing quiz: $e');
          print('Raw response body: ${response.body}');
          rethrow;
        }
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Failed to load quiz: $errorMessage');
      }
    } catch (e) {
      print('Get quiz error: $e');
      rethrow;
    }
  }

  static Future<QuizResult> submitQuiz(int quizId, List<int> answers) async {
    try {
      print('Submitting answers for quiz $quizId: $answers');
      final response = await http.post(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.submitQuizResult(quizId)),
        body: json.encode(answers),
        headers: {
          'Authorization': 'Bearer ${AuthService.token}',
          'Content-Type': 'application/json',
        },
      );

      print('Submit response status: ${response.statusCode}');
      print('Submit response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final result = QuizResult.fromJson(json.decode(response.body));
          print('Successfully parsed quiz result');
          return result;
        } catch (e) {
          print('Error parsing quiz result: $e');
          print('Raw response body: ${response.body}');
          rethrow;
        }
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Failed to submit quiz: $errorMessage');
      }
    } catch (e) {
      print('Submit quiz error: $e');
      rethrow;
    }
  }

  static Future<List<QuizResult>> getUserResults(int userId) async {
    try {
      print('Fetching results for user $userId...');
      final response = await http.get(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.userQuizResults(userId)),
        headers: {
          'Authorization': 'Bearer ${AuthService.token}',
          'Content-Type': 'application/json',
        },
      );

      print('Results response status: ${response.statusCode}');
      print('Results response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final List<dynamic> resultList = json.decode(response.body);
          print('Successfully decoded JSON list of length: ${resultList.length}');
          
          final results = resultList.map((result) {
            try {
              return QuizResult.fromJson(result);
            } catch (e) {
              print('Error parsing individual result: $e');
              print('Problematic result data: $result');
              rethrow;
            }
          }).toList();
          
          print('Successfully parsed ${results.length} results');
          return results;
        } catch (e) {
          print('Error parsing results list: $e');
          print('Raw response body: ${response.body}');
          rethrow;
        }
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Failed to load results: $errorMessage');
      }
    } catch (e) {
      print('Get user results error: $e');
      rethrow;
    }
  }
}