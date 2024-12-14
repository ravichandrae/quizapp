class Option {
  final int id;
  final String text;
  final bool correct;

  Option({
    required this.id,
    required this.text,
    required this.correct,
  });

  factory Option.fromJson(Map<String, dynamic> json) {
    try {
      return Option(
        id: json['id'] ?? 0,
        text: json['text'] ?? '',
        correct: json['correct'] ?? false,
      );
    } catch (e) {
      print('Error in Option.fromJson: $e');
      print('Problematic JSON: $json');
      rethrow;
    }
  }
}