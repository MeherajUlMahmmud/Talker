import 'package:flutter/material.dart';
import 'package:talker/pages/HomeScreen.dart';
import 'package:talker/pages/LoginScreen.dart';
import 'package:talker/pages/ProfileScreen.dart';
import 'package:talker/pages/SignUpScreen.dart';
import 'package:talker/pages/SplashScreen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Talker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
      routes: {
        SplashScreen.routeName: (context) => const SplashScreen(),
        LoginScreen.routeName: (context) => const LoginScreen(),
        SignUpScreen.routeName: (context) => const SignUpScreen(),
        HomeScreen.routeName: (context) => HomeScreen(),
        ProfileScreen.routeName: (context) => const ProfileScreen(),
      },
    );
  }
}
