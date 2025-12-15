import { FormEvent, useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function SignupPage() {
  const { signupStudent } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    school: '',
    level: '',
    city: '',
    birthDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const payload = { ...form, birthDate: form.birthDate || undefined }
      await signupStudent(payload)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      console.error(err)
      setError('Inscription impossible. Vérifiez les champs ou réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <p className="eyebrow">Inscription</p>
        <h1>Créer un compte étudiant</h1>
        <form onSubmit={onSubmit} className="form">
          <div className="form-grid">
            <label>
              Prénom
              <input name="firstName" value={form.firstName} onChange={onChange} required />
            </label>
            <label>
              Nom
              <input name="lastName" value={form.lastName} onChange={onChange} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Téléphone
              <input name="phone" value={form.phone} onChange={onChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Mot de passe
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
              />
            </label>
            <label>
              École
              <input name="school" value={form.school} onChange={onChange} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Niveau
              <input name="level" value={form.level} onChange={onChange} required />
            </label>
            <label>
              Ville
              <input name="city" value={form.city} onChange={onChange} required />
            </label>
          </div>
          <label>
            Date de naissance (optionnel)
            <input type="date" name="birthDate" value={form.birthDate} onChange={onChange} />
          </label>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Inscription réussie, redirection...</div>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
        <div className="muted">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}

