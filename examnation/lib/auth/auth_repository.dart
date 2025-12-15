import '../core/api_client.dart';
import '../core/storage.dart';

class AuthRepository {
  final ApiClient _api = ApiClient.instance;

  Future<String?> login(String email, String password) async {
    final resp = await _api.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      final data = resp.data;
      final token = data['token'] ?? data['accessToken'] ?? data['jwt'];
      if (token != null) {
        await SecureStorage.saveToken(token.toString());
        return token.toString();
      }
    }
    return null;
  }

  Future<String?> signup(String name, String email, String password) async {
    final resp = await _api.post(
      '/auth/register/student',
      data: {'name': name, 'email': email, 'password': password},
    );
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      final data = resp.data;
      final token = data['token'] ?? data['accessToken'] ?? data['jwt'];
      if (token != null) {
        await SecureStorage.saveToken(token.toString());
        return token.toString();
      }
    }
    return null;
  }

  Future<void> logout() async {
    await SecureStorage.deleteToken();
  }
}
