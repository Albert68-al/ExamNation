import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/storage.dart';
import 'auth_repository.dart';

class AuthState {
  final bool authenticated;
  final String? token;

  AuthState({required this.authenticated, this.token});

  AuthState copyWith({bool? authenticated, String? token}) => AuthState(
    authenticated: authenticated ?? this.authenticated,
    token: token ?? this.token,
  );
}

class AuthCubit extends Cubit<AuthState> {
  final AuthRepository _repo;

  AuthCubit(this._repo) : super(AuthState(authenticated: false)) {
    _hydrate();
  }

  Future<void> _hydrate() async {
    final token = await SecureStorage.readToken();
    if (token != null) {
      emit(AuthState(authenticated: true, token: token));
    }
  }

  Future<bool> login(String email, String password) async {
    final token = await _repo.login(email, password);
    if (token != null) {
      emit(AuthState(authenticated: true, token: token));
      return true;
    }
    return false;
  }

  Future<bool> signup(String name, String email, String password) async {
    final token = await _repo.signup(name, email, password);
    if (token != null) {
      emit(AuthState(authenticated: true, token: token));
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    await _repo.logout();
    emit(AuthState(authenticated: false, token: null));
  }
}
