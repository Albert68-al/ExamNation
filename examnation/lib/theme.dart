import 'package:flutter/material.dart';

final ThemeData appTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF22D3EE),
    brightness: Brightness.dark,
    primary: const Color(0xFF22D3EE),
    secondary: const Color(0xFF6366F1),
  ),
  scaffoldBackgroundColor: const Color(0xFF0F172A),
  appBarTheme: const AppBarTheme(backgroundColor: Color(0xFF111827)),
  useMaterial3: true,
);
