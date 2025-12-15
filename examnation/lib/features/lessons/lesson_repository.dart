import '../../core/api_client.dart';
import '../../models/lesson.dart';

class LessonRepository {
  final ApiClient _api = ApiClient.instance;

  Future<List<Lesson>> fetchLessons() async {
    final resp = await _api.get('/lessons');
    if (resp.statusCode == 200) {
      final list = resp.data as List<dynamic>;
      return list
          .map((e) => Lesson.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  Future<Lesson?> fetchLesson(int id) async {
    final resp = await _api.get('/lessons/\$id');
    if (resp.statusCode == 200) {
      return Lesson.fromJson(resp.data as Map<String, dynamic>);
    }
    return null;
  }
}
