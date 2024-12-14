import 'quiz.dart';

class QuizResult {
  final int id;
  final Quiz quiz;
  final int score;
  final int totalQuestions;

  QuizResult({
    required this.id,
    required this.quiz,
    required this.score,
    required this.totalQuestions,
  });

  factory QuizResult.fromJson(Map<String, dynamic> json) {
    return QuizResult(
      id: json['id'],
      quiz: Quiz.fromJson(json['quiz']),
      score: json['score'],
      totalQuestions: json['totalQuestions'],
    );
  }
}