import 'package:flutter/material.dart';
import 'package:talker/pages/HomeScreen.dart';
import 'package:talker/pages/auth_screens/LoginScreen.dart';
import 'package:talker/pages/ProfileScreen.dart';
import 'package:talker/pages/auth_screens/SignUpScreen.dart';
import 'package:talker/pages/SplashScreen.dart';
import 'package:talker/utils/helper.dart';

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
      routes: {
        SplashScreen.routeName: (context) => const SplashScreen(),
        LoginScreen.routeName: (context) => const LoginScreen(),
        SignUpScreen.routeName: (context) => const SignUpScreen(),
        HomeScreen.routeName: (context) => const HomeScreen(),
        ProfileScreen.routeName: (context) => const ProfileScreen(),
      },
    );
  }
}
