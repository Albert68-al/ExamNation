import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'auth/auth_cubit.dart';
import 'auth/auth_repository.dart';
import 'core/api_client.dart';
import 'pages/login_page.dart';
import 'pages/signup_page.dart';
import 'features/lessons/lessons_page.dart';
import 'widgets/app_scaffold.dart';
import 'theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  final authRepo = AuthRepository();
  final authCubit = AuthCubit(authRepo);

  // wire ApiClient unauthorized handler to logout
  ApiClient.instance.setOnUnauthorized(() async {
    await authCubit.logout();
  });

  final router = GoRouter(
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Splash'))),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(path: '/signup', builder: (context, state) => const SignupPage()),
      GoRoute(
        path: '/',
        builder: (context, state) => const AppScaffold(child: LessonsPage()),
        routes: [
          GoRoute(
            path: 'lessons/:id',
            builder: (context, state) {
              final id = int.tryParse(state.pathParameters['id'] ?? '0') ?? 0;
              return LessonDetailPage(lessonId: id);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/mcqs',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('MCQs (todo)'))),
      ),
      GoRoute(
        path: '/exams',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Exams (todo)'))),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Notifications (todo)'))),
      ),
      GoRoute(
        path: '/progress',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Progress (todo)'))),
      ),
    ],
  );

  runApp(
    BlocProvider.value(
      value: authCubit,
      child: MyApp(router: router),
    ),
  );
}

class MyApp extends StatelessWidget {
  final GoRouter router;
  const MyApp({Key? key, required this.router}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Examnation',
      theme: appTheme,
      routerConfig: router,
    );
  }
}
