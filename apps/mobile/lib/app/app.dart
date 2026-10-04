import 'package:flutter/material.dart';
import '../features/home/presentation/foundation_shell.dart';

class MemoraApp extends StatelessWidget {
  const MemoraApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'MEMORA',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF9B4932),
        surface: const Color(0xFFF8F5EE),
      ),
      scaffoldBackgroundColor: const Color(0xFFF8F5EE),
    ),
    home: const FoundationShell(),
  );
}
