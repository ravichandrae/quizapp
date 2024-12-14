// lib/screens/quiz_screen.dart
import 'package:flutter/material.dart';
import 'dart:async';
import '../models/quiz.dart';
import '../models/question.dart';
import '../services/quiz_service.dart';

class QuizScreen extends StatefulWidget {
  final Quiz quiz;

  const QuizScreen({
    super.key,
    required this.quiz,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  late List<Question> questions;
  int currentQuestionIndex = 0;
  List<int> selectedAnswers = [];
  bool isAnswered = false;
  bool isLoading = false;
  Timer? _timer;
  int _timeLeft = 15;

  @override
  void initState() {
    super.initState();
    questions = widget.quiz.questions;
    selectedAnswers = List.filled(questions.length, -1);
    _startTimer();
  }

  void _startTimer() {
    _timeLeft = 15;
    _timer?.cancel();
    _timer = Timer.periodic(
      const Duration(seconds: 1),
      (timer) {
        if (_timeLeft > 0) {
          setState(() {
            _timeLeft--;
          });
        } else {
          _moveToNext();
        }
      },
    );
  }

  void _selectAnswer(int optionId) {
    if (!isAnswered) {
      setState(() {
        selectedAnswers[currentQuestionIndex] = optionId;
        isAnswered = true;
      });

      // Wait 1 second before moving to next question
      Future.delayed(const Duration(seconds: 1), () {
        _moveToNext();
      });
    }
  }

  void _moveToNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setState(() {
        currentQuestionIndex++;
        isAnswered = false;
        _startTimer();
      });
    } else {
      _submitQuiz();
    }
  }

  Future<void> _submitQuiz() async {
    _timer?.cancel();
    setState(() {
      isLoading = true;
    });

    try {
      final result = await QuizService.submitQuiz(
        widget.quiz.id,
        selectedAnswers,
      );

      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            title: const Text('Quiz Complete!'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Your score: ${result.score}/${result.totalQuestions}'),
                Text(
                  'Percentage: ${(result.score / result.totalQuestions * 100).toStringAsFixed(1)}%',
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context); // Return to home screen
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit quiz: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final question = questions[currentQuestionIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text('Question ${currentQuestionIndex + 1}/${questions.length}'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Quit Quiz?'),
                content: const Text(
                  'Are you sure you want to quit? Your progress will be lost.',
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Close quiz screen
                    },
                    child: const Text('Quit'),
                  ),
                ],
              ),
            );
          },
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                LinearProgressIndicator(
                  value: _timeLeft / 15,
                  backgroundColor: Colors.grey[200],
                  color: _timeLeft > 5 ? Colors.blue : Colors.red,
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    'Time left: $_timeLeft seconds',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Text(
                              question.text,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        ...question.options.map((option) {
                          final isSelected =
                              selectedAnswers[currentQuestionIndex] == option.id;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8.0),
                            child: ElevatedButton(
                              onPressed: isAnswered
                                  ? null
                                  : () => _selectAnswer(option.id),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isSelected
                                    ? Colors.blue
                                    : Theme.of(context)
                                        .buttonTheme
                                        .colorScheme
                                        ?.primary,
                                padding: const EdgeInsets.all(16),
                              ),
                              child: Text(
                                option.text,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}