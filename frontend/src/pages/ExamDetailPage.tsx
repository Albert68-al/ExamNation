import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { PastExam } from '../types'

export function ExamDetailPage() {
  const { id } = useParams()
  const [exam, setExam] = useState<PastExam | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get<PastExam>(`/exams/${id}`)
        setExam(res.data)
      } catch (err) {
        setError("Examen introuvable")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="panel">Chargement...</div>
  if (error || !exam) return <div className="panel error">{error ?? 'Erreur'}</div>

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Examen</p>
          <h1>{exam.title}</h1>
          <p className="muted">
            {exam.subject} {exam.level != null ? `• Niveau ${exam.level}` : ''} {exam.year ? `• ${exam.year}` : ''}
          </p>
        </div>
        <Link to="/exams" className="button ghost">
          ← Retour
        </Link>
      </div>
      <div className="prose">Contenu non fourni par l API. Ajouter PDF ou énoncé.</div>
    </div>
  )
}

