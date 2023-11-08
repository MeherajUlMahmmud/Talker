import 'dart:convert';

import 'package:jobboard/utils/urls.dart';
import 'package:http/http.dart' as http;

class AuthService {
  Future<Map<String, dynamic>> signUpUser( Map<String, dynamic> inputData) async {
    try {
      final response = await http.post(
        Uri.parse(URLS.kRegisterUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(inputData),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'data': data,
          'status': response.statusCode,
        };
      } else {
        final data = jsonDecode(response.body);
        print(data);
        return {
          'error': data['detail'],
          'status': response.statusCode,
        };
      }
    } catch (e) {
      print(e.toString());
      return {
        'error': e.toString(),
        'status': 500,
      };
    }
  }

  Future<Map<String, dynamic>> loginUser( Map<String, dynamic> inputData) async {
    try {
      final response = await http.post(
        Uri.parse(URLS.kLoginUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(inputData),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'data': data,
          'status': response.statusCode,
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'error': data['detail'],
          'status': response.statusCode,
        };
      }
    } catch (e) {
      print(e.toString());
      return {
        'error': e.toString(),
        'status': 500,
      };
    }
  }

  Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    try {
      final response = await http.post(
        Uri.parse(URLS.kRefreshTokenUrl),
        body: {
          'refresh': refreshToken,
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'data': data,
          'status': response.statusCode,
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'error': data['detail'],
          'status': response.statusCode,
        };
      }
    } catch (e) {
      print(e.toString());
      return {
        'error': e.toString(),
        'status': 500,
      };
    }
  }
}