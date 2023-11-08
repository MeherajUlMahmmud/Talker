import 'package:talker/screens/auth_screens/LoginScreen.dart';
import 'package:talker/screens/home_screen.dart';
import 'package:talker/screens/main_screens/MainScreen.dart';
import 'package:talker/utils/local_storage.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  static const routeName = "/";
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  LocalStorage localStorage = LocalStorage();

  void checkUser() async {
    final Map<String, dynamic> tokens = await localStorage.readData('tokens');
    final Map<String, dynamic> user = await localStorage.readData('user');
    if (tokens['access'] == null || tokens['refresh'] == null) {
      Future.delayed(const Duration(seconds: 2), () {
        Navigator.pushReplacementNamed(context, LoginScreen.routeName);
      });
    } else {
      Provider.of<UserProvider>(context, listen: false).setUser(user);
      Provider.of<UserProvider>(context, listen: false).setTokens(tokens);
      Future.delayed(const Duration(seconds: 2), () {
        Navigator.pushReplacementNamed(context, MainScreen.routeName);
      });
    }
  }

  @override
  void initState() {
    super.initState();
    checkUser();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          "Talker",
          style: TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.bold,
            color: Theme.of(context).primaryColor,
          ),
        ),
      ),
    );
  }
}