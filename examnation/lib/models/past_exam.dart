class PastExam {
  final int id;
  final String title;
  final String subject;
  final String level;
  final int year;
  final String filePath;
  final String? fileType;

  PastExam({
    required this.id,
    required this.title,
    required this.subject,
    required this.level,
    required this.year,
    required this.filePath,
    this.fileType,
  });

  factory PastExam.fromJson(Map<String, dynamic> json) => PastExam(
    id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
    title: json['title'] ?? '',
    subject: json['subject'] ?? '',
    level: json['level'] ?? '',
    year: json['year'] is int
        ? json['year']
        : int.parse(json['year'].toString()),
    filePath: json['filePath'] ?? json['file_path'] ?? '',
    fileType: json['fileType'] ?? json['file_type'],
  );
}
