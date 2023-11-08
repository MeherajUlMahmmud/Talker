import 'package:flutter/material.dart';
import 'package:talker/apis/auth.dart';
import 'package:talker/pages/LoginScreen.dart';
import 'package:talker/utils/helper.dart';
import 'package:talker/widgets/custom_button.dart';
import 'package:talker/widgets/custom_text_form_field.dart';

class SignUpScreen extends StatefulWidget {
  static const routeName = '/signup';
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  TextEditingController nameController = TextEditingController();
  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  Map<String, dynamic> inputData = {
    'name': '',
    'username': '',
    'password': '',
  };

  bool isObscure = true;
  bool isLoading = false;

  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    nameController.dispose();
    usernameController.dispose();
    passwordController.dispose();

    super.dispose();
  }

  handleSignUp() {
    FocusScope.of(context).unfocus();
    setState(() {
      isLoading = true;
    });

    AuthService().signUpUser(inputData).then((data) async {
      print(data);
      if (data['status'] == 200) {
        setState(() {
          isLoading = false;
        });

        Helper().showSnackBar(
          context,
          'Registration Successful',
          Colors.green,
        );

        Navigator.pushReplacementNamed(context, LoginScreen.routeName);
      } else {
        setState(() {
          isLoading = false;
        });
        Helper().showSnackBar(
          context,
          'Something went wrong',
          Colors.red,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(10),
        child: Form(
          key: _formKey,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Talker',
                  style: TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Welcome',
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Create an account to continue!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                CustomTextFormField(
                  width: width,
                  autofocus: false,
                  controller: nameController,
                  labelText: 'Name',
                  hintText: 'Name',
                  prefixIcon: Icons.person,
                  textCapitalization: TextCapitalization.words,
                  borderRadius: 10,
                  keyboardType: TextInputType.name,
                  onChanged: (value) {
                    setState(() {
                      inputData['name'] = value;
                    });
                  },
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Please enter your name';
                    }
                    return null;
                  },
                ),
                CustomTextFormField(
                  width: width,
                  controller: usernameController,
                  labelText: 'Username',
                  hintText: 'Username',
                  prefixIcon: Icons.email,
                  textCapitalization: TextCapitalization.none,
                  borderRadius: 10,
                  keyboardType: TextInputType.emailAddress,
                  onChanged: (value) {
                    setState(() {
                      inputData['username'] = value;
                    });
                  },
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Please enter your username';
                    }
                    return null;
                  },
                ),
                CustomTextFormField(
                  width: width,
                  controller: passwordController,
                  labelText: 'Password',
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
                const SizedBox(height: 15),
                CustomButton(
                  text: 'Sign Up',
                  isLoading: isLoading,
                  isDisabled: isLoading,
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      handleSignUp();
                    }
                  },
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Already have an account?'),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacementNamed(
                          context,
                          LoginScreen.routeName,
                        );
                      },
                      child: const Text('Login'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
