class McqQuestion {
  final int id;
  final String questionText;
  final List<String> options;
  final int correctOptionIndex;

  McqQuestion({
    required this.id,
    required this.questionText,
    required this.options,
    required this.correctOptionIndex,
  });

  factory McqQuestion.fromJson(Map<String, dynamic> json) => McqQuestion(
    id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
    questionText: json['questionText'] ?? json['text'] ?? '',
    options:
        (json['options'] as List<dynamic>?)
            ?.map((e) => e.toString())
            .toList() ??
        [],
    correctOptionIndex: json['correctOptionIndex'] is int
        ? json['correctOptionIndex']
        : int.parse(json['correctOptionIndex'].toString()),
  );
}

class McqQuiz {
  final int id;
  final String title;
  final String subject;
  final String level;
  final List<McqQuestion> questions;

  McqQuiz({
    required this.id,
    required this.title,
    required this.subject,
    required this.level,
    required this.questions,
  });

  factory McqQuiz.fromJson(Map<String, dynamic> json) => McqQuiz(
    id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
    title: json['title'] ?? '',
    subject: json['subject'] ?? '',
    level: json['level'] ?? '',
    questions:
        (json['questions'] as List<dynamic>?)
            ?.map((q) => McqQuestion.fromJson(q as Map<String, dynamic>))
            .toList() ??
        [],
  );
}
