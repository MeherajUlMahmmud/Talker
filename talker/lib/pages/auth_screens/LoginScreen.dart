// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:talker/apis/auth.dart';
import 'package:talker/pages/HomeScreen.dart';
import 'package:talker/pages/auth_screens/SignUpScreen.dart';
import 'package:talker/utils/helper.dart';
import 'package:talker/utils/local_storage.dart';
import 'package:talker/widgets/custom_button.dart';
import 'package:talker/widgets/custom_text_form_field.dart';

class LoginScreen extends StatefulWidget {
  static const routeName = '/login';
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final LocalStorage localStorage = LocalStorage();

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  Map<String, dynamic> inputData = {
    'username': '',
    'password': '',
  };

  bool isObscure = true;
  bool isLoading = false;

  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();

    super.dispose();
  }

  handleLogin() {
    FocusScope.of(context).unfocus();
    setState(() {
      isLoading = true;
    });

    AuthService().loginUser(inputData).then((data) async {
      print(data);
      // if (data['status'] == 200) {
      //   await localStorage.writeData('token', data['data']['token']);

      //   Helper().showSnackBar(context, 'Login Successful', Colors.green);
      //   setState(() {
      //     isLoading = false;
      //   });
      //   Navigator.pushReplacementNamed(context, HomeScreen.routeName);
      // } else {
      //   setState(() {
      //     isLoading = false;
      //   });
      //   Helper().showSnackBar(context, data['error'], Colors.red);
      // }
    });
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.grey.shade900,
      body: Container(
        padding: const EdgeInsets.all(10),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(height: 80),
              Text(
                'Talker',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Helper().createMaterialColor(const Color(0xFFF2F3F5)),
                ),
              ),
              const SizedBox(height: 30),
              Text(
                'Welcome back!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Helper().createMaterialColor(const Color(0xFFF2F3F5)),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "We're so excited to see you again!",
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFFF2F3F5),
                ),
              ),
              const SizedBox(height: 30),
              CustomTextFormField(
                width: width,
                autofocus: true,
                controller: usernameController,
                labelText: 'USERNAME',
                hintText: 'Username',
                prefixIcon: Icons.person,
                textCapitalization: TextCapitalization.none,
                borderRadius: 10,
                keyboardType: TextInputType.name,
                onChanged: (value) {
                  setState(() {
                    inputData['username'] = value;
                  });
                },
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 25),
              CustomTextFormField(
                width: width,
                controller: passwordController,
                labelText: 'PASSWORD',
                hintText: 'Password',
                prefixIcon: Icons.lock,
                suffixIcon:
                    !isObscure ? Icons.visibility : Icons.visibility_off,
                textCapitalization: TextCapitalization.none,
                borderRadius: 10,
                keyboardType: TextInputType.visiblePassword,
                isObscure: isObscure,
                suffixIconOnPressed: () {
                  setState(() {
                    isObscure = !isObscure;
                  });
                },
                onChanged: (value) {
                  setState(() {
                    inputData['password'] = value;
                  });
                },
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 25),
              CustomButton(
                text: 'Login',
                isLoading: isLoading,
                isDisabled: isLoading,
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    handleLogin();
                  }
                },
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?",
                    style: TextStyle(
                      color:
                          Helper().createMaterialColor(const Color(0xFFF2F3F5)),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushReplacementNamed(
                        context,
                        SignUpScreen.routeName,
                      );
                    },
                    child: const Text(
                      'Sign Up',
                      style: TextStyle(
                        color: Color(0xFF2E3B62),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
