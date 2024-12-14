// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/user.dart';

class AuthService {
  static String? _token;
  static User? _currentUser;

  static String? get token => _token;
  static User? get currentUser => _currentUser;

  static Future<User> signup(User user) async {
    try {
      print('Sending signup request to: ${ApiConfig.baseUrl + ApiConfig.signup}');
      print('Request body: ${json.encode(user.toJson())}');
      
      final response = await http.post(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.signup),
        body: json.encode(user.toJson()),
        headers: {'Content-Type': 'application/json'},
      );

      print('Response status code: ${response.statusCode}');
      print('Response body: ${response.body}');

      // Accept both 200 and 201 status codes as success
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        return User.fromJson(responseData);
      } else {
        // Try to get error message from response if available
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Signup failed: $errorMessage');
      }
    } catch (e) {
      print('Signup error: $e');
      rethrow;
    }
  }

  static Future<void> login(String mobile, String pin) async {
    try {
      print('Sending login request...');
      final response = await http.post(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.login),
        body: json.encode({
          'mobile': mobile,
          'pin': pin,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      print('Login response status: ${response.statusCode}');
      print('Login response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['token'];
        _currentUser = User(
          name: data['name'] ?? '',
          mobile: data['mobile'] ?? '',
          pin: pin,  // Store PIN from login
        );
        print('Successfully logged in as: ${_currentUser?.name}');
      } else {
        String errorMessage;
        try {
          final errorData = json.decode(response.body);
          errorMessage = errorData['message'] ?? 'Unknown error occurred';
        } catch (e) {
          errorMessage = 'Status code: ${response.statusCode}';
        }
        throw Exception('Login failed: $errorMessage');
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  static Future<User> getProfile() async {
    if (_token == null) throw Exception('Not authenticated');

    try {
      print('Fetching profile...');
      final response = await http.get(
        Uri.parse(ApiConfig.baseUrl + ApiConfig.profile),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
      );

      print('Profile response status: ${response.statusCode}');
      print('Profile response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        try {
          final user = User.fromJson(jsonData);
          print('Successfully parsed user: ${user.name}, ${user.mobile}');
          return user;
        } catch (e) {
          print('Error parsing user data: $e');
          print('Raw JSON data: $jsonData');
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
        throw Exception('Failed to get profile: $errorMessage');
      }
    } catch (e) {
      print('Get profile error: $e');
      rethrow;
    }
  }

  static void logout() {
    _token = null;
    _currentUser = null;
  }
}