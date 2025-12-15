export type Lesson = {
  id: number
  title: string
  subject: string
  level: string
  content?: string
}

export type McqOption = { id?: number; optionText: string }

export type McqQuestion = {
  id: number
  questionText: string
  correctOptionIndex: number
  options?: McqOption[]
}

export type McqQuiz = {
  id: number
  title: string
  subject: string
  level: string
  description?: string
  questions?: McqQuestion[]
}

export type PastExam = {
  id: number
  title: string
  subject: string
  level: string
  year: number | string
  filePath: string
  fileType: string
}

export type Notification = {
  id: number
  userId: number
  message: string
  read: boolean
  createdAt?: string
}

export type ProgressEntry = {
  id: number
  quizId?: number
  examId?: number
  score: number
  completedAt?: string
}

