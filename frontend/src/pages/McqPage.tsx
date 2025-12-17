import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { McqQuiz } from '../types'
import { useAuth } from '../auth/AuthContext'

/**
 * Sécurise toujours un tableau
 */
function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : []
}

export function McqPage() {
  const [quizzes, setQuizzes] = useState<McqQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    level: '',
  })

  const [editForm, setEditForm] = useState({
    title: '',
    subject: '',
    level: '',
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  const { user } = useAuth()

  /* =========================
     LOAD QUIZZES
  ========================== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/mcqs')
        setQuizzes(ensureArray<McqQuiz>(res.data))
      } catch (err) {
        console.error(err)
        setError('Impossible de charger les MCQ')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="panel">Chargement...</div>
  if (error) return <div className="panel error">{error}</div>

  /* =========================
     CREATE
  ========================== */
  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await api.post<McqQuiz>('/mcqs', form)

      setQuizzes((prev) => [
        res.data,
        ...ensureArray<McqQuiz>(prev),
      ])

      setForm({ title: '', subject: '', level: '' })
    } catch (err) {
      console.error(err)
      setError('Création du MCQ échouée')
    } finally {
      setCreating(false)
    }
  }

  /* =========================
     DELETE
  ========================== */
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce quiz ?')) return

    try {
      await api.delete(`/mcqs/${id}`)
      setQuizzes((prev) =>
        ensureArray<McqQuiz>(prev).filter((q) => q.id !== id)
      )
    } catch (err) {
      console.error(err)
      setError('Suppression impossible')
    }
  }

  /* =========================
     EDIT
  ========================== */
  const startEdit = (quiz: McqQuiz) => {
    setEditingId(quiz.id)
    setEditForm({
      title: quiz.title,
      subject: quiz.subject,
      level: quiz.level,
    })
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    try {
      const res = await api.put<McqQuiz>(`/mcqs/${editingId}`, editForm)

      setQuizzes((prev) =>
        ensureArray<McqQuiz>(prev).map((q) =>
          q.id === editingId ? res.data : q
        )
      )

      setEditingId(null)
    } catch (err) {
      console.error(err)
      setError('Mise à jour échouée')
    }
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Quiz</p>
          <h1>MCQ</h1>
        </div>
      </div>

      {/* CREATE FORM */}
      {user?.role === 'ROLE_ADMIN' && (
        <form className="form" onSubmit={onCreate}>
          <div className="form-grid">
            <label>
              Titre
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </label>

            <label>
              Sujet
              <input
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                required
              />
            </label>

            <label>
              Niveau
              <input
                value={form.level}
                onChange={(e) =>
                  setForm((f) => ({ ...f, level: e.target.value }))
                }
                required
              />
            </label>
          </div>

          <button className="button" type="submit" disabled={creating}>
            {creating ? 'Création...' : 'Créer un MCQ'}
          </button>
        </form>
      )}

      {/* EDIT FORM */}
      {user?.role === 'ROLE_ADMIN' && editingId && (
        <form className="form" onSubmit={onUpdate}>
          <p className="eyebrow">Édition</p>

          <div className="form-grid">
            <label>
              Titre
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </label>

            <label>
              Sujet
              <input
                value={editForm.subject}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, subject: e.target.value }))
                }
                required
              />
            </label>

            <label>
              Niveau
              <input
                value={editForm.level}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, level: e.target.value }))
                }
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <button className="button" type="submit">
              Mettre à jour
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => setEditingId(null)}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="grid">
        {ensureArray<McqQuiz>(quizzes).map((quiz) => (
          <Link key={quiz.id} to={`/mcqs/${quiz.id}`} className="card">
            <div className="card-title">{quiz.title}</div>

            <div className="muted">
              {quiz.subject}
              {quiz.level ? ` • Niveau ${quiz.level}` : ''}
            </div>

            {quiz.description && (
              <p className="line-clamp">{quiz.description}</p>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <div className="actions">
                <button
                  className="button ghost"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete(quiz.id)
                  }}
                >
                  Supprimer
                </button>

                <button
                  className="button ghost"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    startEdit(quiz)
                  }}
                >
                  Modifier
                </button>
              </div>
            )}
          </Link>
        ))}

        {quizzes.length === 0 && (
          <div className="muted">Aucun quiz disponible.</div>
        )}
      </div>
    </div>
  )
}
