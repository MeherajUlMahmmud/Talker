import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  static const routeName = '/profile';
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Talker')),
      body: const Center(
        child: Text('Hello, world!'),
      ),
    );
  }
}
