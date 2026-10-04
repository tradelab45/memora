import 'package:flutter/material.dart';

class FoundationShell extends StatefulWidget {
  const FoundationShell({super.key});
  @override
  State<FoundationShell> createState() => _FoundationShellState();
}
class _FoundationShellState extends State<FoundationShell> {
  int _index = 0;
  static const _chapters = ['Home', 'People', 'Memories', 'Books', 'Create'];
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('MEMORA')),
    body: SafeArea(
      child: Center(child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text(_chapters[_index], style: Theme.of(context).textTheme.headlineLarge),
          const SizedBox(height: 16),
          const Text('Your life. Remembered properly.', textAlign: TextAlign.center),
          const SizedBox(height: 12),
          const Text(
            'Mobile foundation — photo access and recognition are not enabled yet.',
            textAlign: TextAlign.center,
          ),
        ]),
      )),
    ),
    bottomNavigationBar: NavigationBar(
      selectedIndex: _index,
      onDestinationSelected: (value) => setState(() => _index = value),
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.people_outline), label: 'People'),
        NavigationDestination(icon: Icon(Icons.photo_outlined), label: 'Memories'),
        NavigationDestination(icon: Icon(Icons.menu_book_outlined), label: 'Books'),
        NavigationDestination(icon: Icon(Icons.add_circle_outline), label: 'Create'),
      ],
    ),
  );
}
