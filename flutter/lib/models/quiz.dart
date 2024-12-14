import 'user.dart';
import 'question.dart';

class Quiz {
  final int id;
  final User user;
  final List<Question> questions;
  final bool completed;

  Quiz({
    required this.id,
    required this.user,
    required this.questions,
    required this.completed,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    print('Parsing quiz with ID: ${json['id']}');
    try {
      return Quiz(
        id: json['id'] ?? 0,
        user: User.fromJson(json['user'] ?? {}),
        questions: (json['questions'] as List? ?? [])
            .map((question) => Question.fromJson(question))
            .toList(),
        completed: json['completed'] ?? false,
      );
    } catch (e) {
      print('Error in Quiz.fromJson: $e');
      print('Problematic JSON: $json');
      rethrow;
    }
  }
}