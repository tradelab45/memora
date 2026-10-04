import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Local-only by default. Supabase initialization belongs behind explicit consent.
  runApp(const ProviderScope(child: MemoraApp()));
}
