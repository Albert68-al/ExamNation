import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { McqQuiz } from '../types'
import { useAuth } from '../auth/AuthContext'

type Question = {
  id: number
  questionText: string
  correctOptionIndex: number
  options?: { id?: number; optionText: string }[]
}

type QuizResponse = McqQuiz & { questions?: Question[] }

export function McqDetailPage() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<QuizResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [questionText, setQuestionText] = useState('')
  const [choices, setChoices] = useState(['', '', '', ''])
  const [answerIndex, setAnswerIndex] = useState(0)
  const [savingQuestion, setSavingQuestion] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editQuestion, setEditQuestion] = useState({
    questionText: '',
    choices: [''],
    answerIndex: 0,
  })

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get<QuizResponse>(`/mcqs/${id}`)
        setQuiz(res.data)
      } catch (err) {
        setError("Quiz introuvable")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="panel">Chargement...</div>
  if (error || !quiz) return <div className="panel error">{error ?? 'Erreur'}</div>

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSavingQuestion(true)
    try {
      const payload = {
        questionText,
        correctOptionIndex: answerIndex,
        options: choices
          .filter((c) => c.trim().length > 0)
          .map((c) => ({ optionText: c })),
      }
      const res = await api.post(`/mcqs/${id}/questions`, payload)
      setQuiz((prev) =>
        prev
          ? { ...prev, questions: prev.questions ? [...prev.questions, res.data] : [res.data] }
          : prev,
      )
      setQuestionText('')
      setChoices(['', '', '', ''])
      setAnswerIndex(0)
    } catch (err) {
      console.error(err)
      setError("Ajout de question échoué")
    } finally {
      setSavingQuestion(false)
    }
  }

  const startEdit = (q: Question) => {
    setEditingId(q.id)
    setEditQuestion({
      questionText: q.questionText,
      choices: q.options?.map((o) => o.optionText) ?? [''],
      answerIndex: q.correctOptionIndex,
    })
  }

  const updateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !editingId) return
    setSavingQuestion(true)
    try {
      const payload = {
        questionText: editQuestion.questionText,
        correctOptionIndex: editQuestion.answerIndex,
        options: editQuestion.choices
          .filter((c) => c.trim().length > 0)
          .map((c) => ({ optionText: c })),
      }
      const res = await api.put(`/mcqs/${id}/questions/${editingId}`, payload)
      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions?.map((q) => (q.id === editingId ? res.data : q)),
            }
          : prev,
      )
      setEditingId(null)
    } catch (err) {
      console.error(err)
      setError("Mise à jour de question échouée")
    } finally {
      setSavingQuestion(false)
    }
  }

  const deleteQuestion = async (questionId: number) => {
    if (!id) return
    if (!confirm('Supprimer cette question ?')) return
    try {
      await api.delete(`/mcqs/${id}/questions/${questionId}`)
      setQuiz((prev) =>
        prev ? { ...prev, questions: prev.questions?.filter((q) => q.id !== questionId) } : prev,
      )
    } catch (err) {
      console.error(err)
      setError("Suppression de question échouée")
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Quiz</p>
          <h1>{quiz.title}</h1>
          <p className="muted">
            {quiz.subject} {quiz.level != null ? `• Niveau ${quiz.level}` : ''}
          </p>
        </div>
        <Link to="/mcqs" className="button ghost">
          ← Retour
        </Link>
      </div>

      {user?.role === 'ROLE_ADMIN' && (
        <form className="form" onSubmit={addQuestion}>
          <label>
            Question
            <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
          </label>
          <div className="form-grid">
            {choices.map((c, idx) => (
              <label key={idx}>
                Choix {idx + 1}
                <input
                  value={c}
                  onChange={(e) =>
                    setChoices((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
                  }
                  required={idx < 2}
                />
              </label>
            ))}
          </div>
          <label>
            Index réponse (0-3)
            <input
              type="number"
              min={0}
              max={choices.length - 1}
              value={answerIndex}
              onChange={(e) => setAnswerIndex(Number(e.target.value))}
            />
          </label>
          <button className="button" type="submit" disabled={savingQuestion}>
            {savingQuestion ? 'Ajout...' : 'Ajouter la question'}
          </button>
        </form>
      )}

      {user?.role === 'ROLE_ADMIN' && editingId && (
        <form className="form" onSubmit={updateQuestion}>
          <p className="eyebrow">Edition de question</p>
          <label>
            Question
            <input
              value={editQuestion.questionText}
              onChange={(e) => setEditQuestion((f) => ({ ...f, questionText: e.target.value }))}
              required
            />
          </label>
          <div className="form-grid">
            {editQuestion.choices.map((c, idx) => (
              <label key={idx}>
                Choix {idx + 1}
                <input
                  value={c}
                  onChange={(e) =>
                    setEditQuestion((f) => ({
                      ...f,
                      choices: f.choices.map((v, i) => (i === idx ? e.target.value : v)),
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <label>
            Index réponse
            <input
              type="number"
              min={0}
              max={editQuestion.choices.length - 1}
              value={editQuestion.answerIndex}
              onChange={(e) =>
                setEditQuestion((f) => ({ ...f, answerIndex: Number(e.target.value) }))
              }
            />
          </label>
          <div className="form-grid">
            <button className="button" type="submit" disabled={savingQuestion}>
              Mettre à jour
            </button>
            <button className="button ghost" type="button" onClick={() => setEditingId(null)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="stack">
        {quiz.questions?.map((q) => (
          <div key={q.id} className="card">
            <div className="card-title">{q.questionText}</div>
            <ul className="choices">
              {q.options?.map((opt, idx) => (
                <li key={idx}>
                  {opt.optionText} {idx === q.correctOptionIndex ? ' (réponse)' : ''}
                </li>
              ))}
            </ul>
            {user?.role === 'ROLE_ADMIN' && (
              <div className="form-grid">
                <button className="button ghost" onClick={(e) => { e.preventDefault(); startEdit(q) }}>
                  Modifier
                </button>
                <button className="button ghost" onClick={(e) => { e.preventDefault(); deleteQuestion(q.id) }}>
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )) || <div className="muted">Pas de questions renseignées.</div>}
      </div>
    </div>
  )
}

