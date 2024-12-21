// lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'http://localhost:8080/api';
  
  // Auth endpoints
  static const String signup = '/signup';
  static const String login = '/login';
  static const String profile = '/users/profile';
  
  // Quiz endpoints
  static String quizById(int quizId) => '/quizzes/$quizId';
  static String userQuizzes(int userId) => '/quizzes/user/$userId';
  static String submitQuizResult(int quizId) => '/quiz-results/$quizId/submit';
  static String userQuizResults(int userId) => '/quiz-results/user/$userId';
  static String createSampleQuiz(int userId) => '/quizzes/user/$userId/sample?questionCount=3';
}