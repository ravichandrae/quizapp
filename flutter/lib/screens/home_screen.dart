// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import '../models/quiz.dart';
import '../models/quiz_result.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/quiz_service.dart';
import 'quiz_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<User> _profileFuture;
  late Future<List<Quiz>> _quizzesFuture;
  late Future<List<QuizResult>> _resultsFuture;
  bool _isCreatingQuiz = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    _profileFuture = AuthService.getProfile();
    _quizzesFuture = _profileFuture.then(
      (user) => QuizService.getUserQuizzes(user.id!),
    );
    _resultsFuture = _profileFuture.then(
      (user) => QuizService.getUserResults(user.id!),
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _loadData();
    });
  }

  void _logout() {
    AuthService.logout();
    Navigator.pushReplacementNamed(context, '/login');
  }

  Future<void> _createSampleQuiz() async {
    setState(() => _isCreatingQuiz = true);
    
    try {
      final user = await _profileFuture;
      await QuizService.createSampleQuiz(user.id!);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sample quiz created successfully!')),
        );
        _refresh();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to create sample quiz: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isCreatingQuiz = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz App'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ProfileScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FutureBuilder<User>(
                  future: _profileFuture,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Welcome, ${snapshot.data!.name}!',
                                style: Theme.of(context).textTheme.headlineSmall,
                              ),
                              if (snapshot.data!.school != null)
                                Text(
                                  'School: ${snapshot.data!.school}',
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                            ],
                          ),
                        ),
                      );
                    }
                    if (snapshot.hasError) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text('Error loading profile'),
                        ),
                      );
                    }
                    return const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Center(child: CircularProgressIndicator()),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isCreatingQuiz ? null : _createSampleQuiz,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _isCreatingQuiz
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Create Sample Quiz'),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Available Quizzes',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                FutureBuilder<List<Quiz>>(
                  future: _quizzesFuture,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      if (snapshot.data!.isEmpty) {
                        return const Card(
                          child: Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Text('No quizzes available'),
                          ),
                        );
                      }
                      return ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: snapshot.data!.length,
                        itemBuilder: (context, index) {
                          final quiz = snapshot.data![index];
                          return Card(
                            child: ListTile(
                              title: Text('Quiz #${quiz.id}'),
                              subtitle: Text(
                                '${quiz.questions.length} questions',
                              ),
                              trailing: quiz.completed
                                  ? const Icon(Icons.check_circle)
                                  : ElevatedButton(
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => QuizScreen(
                                              quiz: quiz,
                                            ),
                                          ),
                                        ).then((_) => _refresh());
                                      },
                                      child: const Text('Start'),
                                    ),
                            ),
                          );
                        },
                      );
                    }
                    if (snapshot.hasError) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text('Error loading quizzes'),
                        ),
                      );
                    }
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
                const SizedBox(height: 24),
                Text(
                  'Previous Results',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                FutureBuilder<List<QuizResult>>(
                  future: _resultsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      if (snapshot.data!.isEmpty) {
                        return const Card(
                          child: Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Text('No quiz results yet'),
                          ),
                        );
                      }
                      return ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: snapshot.data!.length,
                        itemBuilder: (context, index) {
                          final result = snapshot.data![index];
                          return Card(
                            child: ListTile(
                              title: Text('Quiz #${result.quiz.id}'),
                              subtitle: Text(
                                'Score: ${result.score}/${result.totalQuestions}',
                              ),
                              trailing: Text(
                                '${(result.score / result.totalQuestions * 100).toStringAsFixed(1)}%',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                            ),
                          );
                        },
                      );
                    }
                    if (snapshot.hasError) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text('Error loading results'),
                        ),
                      );
                    }
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}