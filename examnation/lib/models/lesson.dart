class Lesson {
  final int id;
  final String title;
  final String subject;
  final String level;
  final String content;

  Lesson({
    required this.id,
    required this.title,
    required this.subject,
    required this.level,
    required this.content,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) => Lesson(
    id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
    title: json['title'] ?? '',
    subject: json['subject'] ?? '',
    level: json['level'] ?? '',
    content: json['content'] ?? '',
  );
}
