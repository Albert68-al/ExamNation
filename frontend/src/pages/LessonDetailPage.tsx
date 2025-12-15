import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Lesson } from '../types'

export function LessonDetailPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get<Lesson>(`/lessons/${id}`)
        setLesson(res.data)
      } catch (err) {
        setError("Lesson introuvable")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="panel">Chargement...</div>
  if (error || !lesson) return <div className="panel error">{error ?? 'Erreur'}</div>

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Lesson</p>
          <h1>{lesson.title}</h1>
          <p className="muted">
            {lesson.subject} {lesson.level != null ? `• Niveau ${lesson.level}` : ''}
          </p>
        </div>
        <Link to="/lessons" className="button ghost">
          ← Retour
        </Link>
      </div>
      <div className="prose">{lesson.content || 'Pas de contenu fourni.'}</div>
    </div>
  )
}

