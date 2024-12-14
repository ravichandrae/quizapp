// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<User> _profileFuture;

  @override
  void initState() {
    super.initState();
    _profileFuture = AuthService.getProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: FutureBuilder<User>(
          future: _profileFuture,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              final user = snapshot.data!;
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: CircleAvatar(
                              radius: 50,
                              backgroundColor: Theme.of(context).primaryColor,
                              child: Text(
                                user.name[0].toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 36,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListTile(
                            title: const Text('Name'),
                            subtitle: Text(user.name),
                            leading: const Icon(Icons.person),
                          ),
                          const Divider(),
                          ListTile(
                            title: const Text('Mobile'),
                            subtitle: Text(user.mobile),
                            leading: const Icon(Icons.phone),
                          ),
                          if (user.email != null && user.email!.isNotEmpty) ...[
                            const Divider(),
                            ListTile(
                              title: const Text('Email'),
                              subtitle: Text(user.email!),
                              leading: const Icon(Icons.email),
                            ),
                          ],
                          if (user.school != null && user.school!.isNotEmpty) ...[
                            const Divider(),
                            ListTile(
                              title: const Text('School'),
                              subtitle: Text(user.school!),
                              leading: const Icon(Icons.school),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Account Information',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 8),
                          ListTile(
                            title: const Text('User ID'),
                            subtitle: Text('${user.id}'),
                            leading: const Icon(Icons.badge),
                          ),
                          const Divider(),
                          ListTile(
                            title: const Text('PIN'),
                            subtitle: const Text('••••'),
                            leading: const Icon(Icons.lock),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }
            if (snapshot.hasError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 48,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading profile: ${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _profileFuture = AuthService.getProfile();
                        });
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            return const Center(
              child: CircularProgressIndicator(),
            );
          },
        ),
      ),
    );
  }
}