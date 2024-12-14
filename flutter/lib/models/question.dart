import 'option.dart';

class Question {
  final int id;
  final String text;
  final List<Option> options;

  Question({
    required this.id,
    required this.text,
    required this.options,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    try {
      return Question(
        id: json['id'] ?? 0,
        text: json['text'] ?? '',
        options: (json['options'] as List? ?? [])
            .map((option) => Option.fromJson(option))
            .toList(),
      );
    } catch (e) {
      print('Error in Question.fromJson: $e');
      print('Problematic JSON: $json');
      rethrow;
    }
  }
}