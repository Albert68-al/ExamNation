import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { ProgressEntry } from '../types'
import { useAuth } from '../auth/AuthContext'

export function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setError('Veuillez vous connecter.')
      return
    }
    const load = async () => {
      try {
        const res = await api.get<ProgressEntry[]>('/progress/me')
        setEntries(res.data)
      } catch (err) {
        setError("Impossible de charger la progression")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <div className="panel">Chargement...</div>
  if (error) return <div className="panel error">{error}</div>

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Stats</p>
          <h1>Progression</h1>
        </div>
      </div>
      <div className="stack">
        {entries.map((p) => (
          <div key={p.id} className="card">
            <div className="card-title">
              {p.quizId ? `Quiz ${p.quizId}` : p.examId ? `Exam ${p.examId}` : 'Session'}
            </div>
            <div className="muted">Score: {p.score}</div>
            <div className="muted">
              {p.completedAt ? new Date(p.completedAt).toLocaleString() : 'Date inconnue'}
            </div>
          </div>
        ))}
        {entries.length === 0 && <div className="muted">Pas encore de progression.</div>}
      </div>
    </div>
  )
}

