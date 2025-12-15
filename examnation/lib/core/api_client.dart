import 'dart:async';

import 'package:dio/dio.dart';
import 'env.dart';
import 'storage.dart';

typedef UnauthorizedCallback = FutureOr<void> Function();

class ApiClient {
  ApiClient._internal() {
    _dio = Dio(BaseOptions(baseUrl: apiBaseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            final token = await SecureStorage.readToken();
            if (token != null && token.isNotEmpty) {
              options.headers['Authorization'] = 'Bearer $token';
            }
            return handler.next(options);
          },
          onError: (err, handler) async {
            if (err.response?.statusCode == 401) {
              // token invalid/expired: clear token and call optional callback
              await SecureStorage.deleteToken();
              if (_onUnauthorized != null) {
                await _onUnauthorized!();
              }
            }
            return handler.next(err);
          },
        ),
      );
  }

  late final Dio _dio;
  UnauthorizedCallback? _onUnauthorized;

  static final ApiClient _instance = ApiClient._internal();
  static ApiClient get instance => _instance;

  void setOnUnauthorized(UnauthorizedCallback cb) {
    _onUnauthorized = cb;
  }

  Dio get client => _dio;

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) {
    return _dio.get<T>(path, queryParameters: queryParameters);
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) {
    return _dio.post<T>(path, data: data);
  }

  Future<Response<T>> put<T>(String path, {dynamic data}) {
    return _dio.put<T>(path, data: data);
  }

  Future<Response<T>> delete<T>(String path) {
    return _dio.delete<T>(path);
  }
}
