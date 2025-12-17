import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';

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

  runApp(
    BlocProvider.value(
      value: authCubit,
      child: MyApp(router: GoRouter(routes: [])),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key, required GoRouter router});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _AuthListenable extends ChangeNotifier {
  final AuthCubit cubit;
  late final StreamSubscription _sub;
  _AuthListenable(this.cubit) {
    _sub = cubit.stream.listen((_) => notifyListeners());
  }
  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}

class _MyAppState extends State<MyApp> {
  late final _AuthListenable _authListenable;

  @override
  void initState() {
    super.initState();
    final cubit = context.read<AuthCubit>();
    _authListenable = _AuthListenable(cubit);
  }

  @override
  void dispose() {
    _authListenable.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(
      refreshListenable: _authListenable,
      redirect: (context, state) {
        final auth = context.read<AuthCubit>();
        final loggedIn = auth.state.authenticated;
        // use `subloc` which is available on GoRouterState in recent versions
        final loggingIn =
            state.matchedLocation == '/login' ||
            state.matchedLocation == '/signup' ||
            state.matchedLocation == '/splash';
        if (!loggedIn && !loggingIn) return '/login';
        if (loggedIn && loggingIn) return '/';
        return null;
      },
      routes: [
        GoRoute(
          path: '/splash',
          builder: (context, state) =>
              const Scaffold(body: Center(child: Text('Splash'))),
        ),
        GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignupPage(),
        ),
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

    return MaterialApp.router(
      title: 'Examnation',
      theme: appTheme,
      routerConfig: router,
    );
  }
}
