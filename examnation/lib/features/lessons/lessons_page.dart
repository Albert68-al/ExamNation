import 'package:flutter/material.dart';
import '../../features/lessons/lesson_repository.dart';
import '../../models/lesson.dart';

class LessonsPage extends StatefulWidget {
  const LessonsPage({super.key});

  @override
  State<LessonsPage> createState() => _LessonsPageState();
}

class _LessonsPageState extends State<LessonsPage> {
  final _repo = LessonRepository();
  List<Lesson> _lessons = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final list = await _repo.fetchLessons();
    setState(() {
      _lessons = list;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Lessons')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _lessons.length,
              itemBuilder: (context, i) {
                final l = _lessons[i];
                return ListTile(
                  title: Text(l.title),
                  subtitle: Text('${l.subject} • ${l.level}'),
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => LessonDetailPage(lessonId: l.id),
                    ),
                  ),
                );
              },
            ),
    );
  }
}

class LessonDetailPage extends StatefulWidget {
  final int lessonId;
  const LessonDetailPage({super.key, required this.lessonId});

  @override
  State<LessonDetailPage> createState() => _LessonDetailPageState();
}

class _LessonDetailPageState extends State<LessonDetailPage> {
  final _repo = LessonRepository();
  Lesson? _lesson;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final l = await _repo.fetchLesson(widget.lessonId);
    setState(() {
      _lesson = l;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_lesson?.title ?? 'Lesson')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Text(_lesson?.content ?? ''),
            ),
    );
  }
}
