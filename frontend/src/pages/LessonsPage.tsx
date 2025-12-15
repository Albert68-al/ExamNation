import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Lesson } from '../types'
import { useAuth } from '../auth/AuthContext'

export function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', subject: '', level: '', content: '' })
  const [editForm, setEditForm] = useState({ title: '', subject: '', level: '', content: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Lesson[]>('/lessons')
        setLessons(res.data)
      } catch (err) {
        setError("Impossible de charger les lessons")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="panel">Chargement...</div>
  if (error) return <div className="panel error">{error}</div>

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = { ...form }
      const res = await api.post<Lesson>('/lessons', payload)
      setLessons((prev) => [res.data, ...prev])
      setForm({ title: '', subject: '', level: '', content: '' })
    } catch (err) {
      console.error(err)
      setError("Création de lesson échouée")
    } finally {
      setCreating(false)
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette lesson ?')) return
    try {
      await api.delete(`/lessons/${id}`)
      setLessons((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error(err)
      setError("Suppression impossible")
    }
  }

  const startEdit = (lesson: Lesson) => {
    setEditingId(lesson.id)
    setEditForm({
      title: lesson.title,
      subject: lesson.subject,
      level: lesson.level,
      content: lesson.content || '',
    })
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const res = await api.put<Lesson>(`/lessons/${editingId}`, editForm)
      setLessons((prev) => prev.map((l) => (l.id === editingId ? res.data : l)))
      setEditingId(null)
    } catch (err) {
      console.error(err)
      setError("Mise à jour échouée")
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Lessons</h1>
        </div>
      </div>

      {user && user.role === 'ROLE_ADMIN' && (
        <form className="form" onSubmit={onCreate}>
          <div className="form-grid">
            <label>
              Titre
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </label>
            <label>
              Sujet
              <input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </label>
            <label>
              Niveau
              <input
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                required
              />
            </label>
          </div>
          <label>
            Contenu
            <input
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </label>
          <button className="button" type="submit" disabled={creating}>
            {creating ? 'Création...' : 'Créer une lesson'}
          </button>
        </form>
      )}

      {user && user.role === 'ROLE_ADMIN' && editingId && (
        <form className="form" onSubmit={onUpdate}>
          <p className="eyebrow">Edition</p>
          <div className="form-grid">
            <label>
              Titre
              <input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </label>
            <label>
              Sujet
              <input
                value={editForm.subject}
                onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </label>
            <label>
              Niveau
              <input
                value={editForm.level}
                onChange={(e) => setEditForm((f) => ({ ...f, level: e.target.value }))}
                required
              />
            </label>
          </div>
          <label>
            Contenu
            <input
              value={editForm.content}
              onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
            />
          </label>
          <div className="form-grid">
            <button className="button" type="submit">
              Mettre à jour
            </button>
            <button className="button ghost" type="button" onClick={() => setEditingId(null)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid">
        {lessons.map((lesson) => (
          <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="card">
            <div className="card-title">{lesson.title}</div>
            <div className="muted">
              {lesson.subject} {lesson.level != null ? `• Niveau ${lesson.level}` : ''}
            </div>
            {lesson.content ? <p className="line-clamp">{lesson.content}</p> : null}
            {user?.role === 'ROLE_ADMIN' && (
              <button
                className="button ghost"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(lesson.id)
                }}
              >
                Supprimer
              </button>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <button
                className="button ghost"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  startEdit(lesson)
                }}
              >
                Modifier
              </button>
            )}
          </Link>
        ))}
        {lessons.length === 0 && <div className="muted">Aucune lesson disponible.</div>}
      </div>
    </div>
  )
}

