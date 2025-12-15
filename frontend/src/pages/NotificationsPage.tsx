import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import type { Notification } from '../types'

export function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ userId: '', message: '' })
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ userId: '', message: '', read: false })

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setError('Veuillez vous connecter pour voir vos notifications.')
      return
    }
    const load = async () => {
      try {
        const res = await api.get<Notification[]>(`/notifications/${user.id}`)
        setItems(res.data)
      } catch (err) {
        setError("Impossible de charger les notifications")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const markRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (err) {
      console.error(err)
    }
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = { userId: Number(form.userId), message: form.message }
      const res = await api.post<Notification>('/notifications', payload)
      setItems((prev) => [res, ...prev])
      setForm({ userId: '', message: '' })
    } catch (err) {
      console.error(err)
      setError("Création de notification échouée")
    } finally {
      setCreating(false)
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette notification ?')) return
    try {
      await api.delete(`/notifications/${id}`)
      setItems((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error(err)
      setError("Suppression impossible")
    }
  }

  const startEdit = (n: Notification) => {
    setEditingId(n.id)
    setEditForm({
      userId: String(n.userId),
      message: n.message,
      read: n.read,
    })
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const payload = {
        userId: Number(editForm.userId),
        message: editForm.message,
        read: editForm.read,
      }
      const res = await api.put<Notification>(`/notifications/${editingId}`, payload)
      setItems((prev) => prev.map((n) => (n.id === editingId ? res.data : n)))
      setEditingId(null)
    } catch (err) {
      console.error(err)
      setError("Mise à jour échouée")
    }
  }

  if (loading) return <div className="panel">Chargement...</div>
  if (error) return <div className="panel error">{error}</div>

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1>Notifications</h1>
        </div>
      </div>

      {user?.role === 'ROLE_ADMIN' && (
        <form className="form" onSubmit={onCreate}>
          <div className="form-grid">
            <label>
              User ID
              <input
                value={form.userId}
                onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                required
              />
            </label>
            <label>
              Message
              <input
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </label>
          </div>
          <button className="button" type="submit" disabled={creating}>
            {creating ? 'Création...' : 'Créer une notification'}
          </button>
        </form>
      )}

      {user?.role === 'ROLE_ADMIN' && editingId && (
        <form className="form" onSubmit={onUpdate}>
          <p className="eyebrow">Edition</p>
          <div className="form-grid">
            <label>
              User ID
              <input
                value={editForm.userId}
                onChange={(e) => setEditForm((f) => ({ ...f, userId: e.target.value }))}
                required
              />
            </label>
            <label>
              Message
              <input
                value={editForm.message}
                onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </label>
          </div>
          <label>
            Lu ?
            <input
              type="checkbox"
              checked={editForm.read}
              onChange={(e) => setEditForm((f) => ({ ...f, read: e.target.checked }))}
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

      <div className="stack">
        {items.map((n) => (
          <div key={n.id} className="card">
            <div className="card-title">
              {n.message}
              {!n.read && <span className="badge">Nouveau</span>}
            </div>
            <div className="muted">
              {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Date inconnue'}
            </div>
            {!n.read && (
              <button className="button ghost" onClick={() => markRead(n.id)}>
                Marquer comme lu
              </button>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <button className="button ghost" onClick={() => onDelete(n.id)}>
                Supprimer
              </button>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <button className="button ghost" onClick={() => startEdit(n)}>
                Modifier
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <div className="muted">Aucune notification.</div>}
      </div>
    </div>
  )
}

