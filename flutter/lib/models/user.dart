// lib/models/user.dart
class User {
  final int? id;
  final String name;
  final String mobile;
  final String? email;
  final String? pin;  // Made pin nullable since it might not come in profile response
  final String? school;

  User({
    this.id,
    required this.name,
    required this.mobile,
    this.email,
    this.pin,  // Changed from required to optional
    this.school,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'] ?? '',  // Provide default empty string if null
      mobile: json['mobile'] ?? '',  // Provide default empty string if null
      email: json['email'],  // Already nullable
      pin: json['pin'],  // Made nullable
      school: json['school'],  // Already nullable
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'mobile': mobile,
      if (email != null) 'email': email,
      if (pin != null) 'pin': pin,
      if (school != null) 'school': school,
    };
  }
}