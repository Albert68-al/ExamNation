import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { PastExam } from '../types'
import { useAuth } from '../auth/AuthContext'

export function ExamsPage() {
  const [exams, setExams] = useState<PastExam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    subject: '',
    level: '',
    year: new Date().getFullYear().toString(),
    file: null as File | null,
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    subject: '',
    level: '',
    year: '',
    file: null as File | null,
  })
  const [creating, setCreating] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<PastExam[]>('/exams')
        setExams(res.data)
      } catch (err) {
        setError("Impossible de charger les exams")
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
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subject', form.subject)
      fd.append('level', form.level)
      fd.append('year', form.year)
      if (form.file) fd.append('file', form.file)
      const res = await api.post<PastExam>('/exams/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setExams((prev) => [res.data, ...prev])
      setForm({
        title: '',
        subject: '',
        level: '',
        year: new Date().getFullYear().toString(),
        file: null,
      })
    } catch (err) {
      console.error(err)
      setError("Création d'exam échouée")
    } finally {
      setCreating(false)
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cet examen ?')) return
    try {
      await api.delete(`/exams/${id}`)
      setExams((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
      setError("Suppression impossible")
    }
  }

  const startEdit = (exam: PastExam) => {
    setEditingId(exam.id)
    setEditForm({
      title: exam.title,
      subject: exam.subject,
      level: exam.level,
      year: String(exam.year),
      file: null,
    })
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const fd = new FormData()
      fd.append('title', editForm.title)
      fd.append('subject', editForm.subject)
      fd.append('level', editForm.level)
      fd.append('year', editForm.year)
      if (editForm.file) fd.append('file', editForm.file)
      const res = await api.put<PastExam>(`/exams/${editingId}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setExams((prev) => prev.map((ex) => (ex.id === editingId ? res.data : ex)))
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
          <p className="eyebrow">Archives</p>
          <h1>Past Exams</h1>
        </div>
      </div>

      {user?.role === 'ROLE_ADMIN' && (
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
            <label>
              Année
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Fichier (PDF)
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
                required
              />
            </label>
          </div>
          <button className="button" type="submit" disabled={creating}>
            {creating ? 'Création...' : 'Créer un exam'}
          </button>
        </form>
      )}

      {user?.role === 'ROLE_ADMIN' && editingId && (
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
            <label>
              Année
              <input
                type="number"
                value={editForm.year}
                onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Nouveau fichier (optionnel)
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setEditForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              />
            </label>
          </div>
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
        {exams.map((exam) => (
          <Link key={exam.id} to={`/exams/${exam.id}`} className="card">
            <div className="card-title">{exam.title}</div>
            <div className="muted">
              {exam.subject} {exam.level != null ? `• Niveau ${exam.level}` : ''}
            </div>
            {exam.year ? <div className="chip">Année {exam.year}</div> : null}
            {user?.role === 'ROLE_ADMIN' && (
              <button
                className="button ghost"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(exam.id)
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
                  startEdit(exam)
                }}
              >
                Modifier
              </button>
            )}
          </Link>
        ))}
        {exams.length === 0 && <div className="muted">Aucun examen disponible.</div>}
      </div>
    </div>
  )
}

