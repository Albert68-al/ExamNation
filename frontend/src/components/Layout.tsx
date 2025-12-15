import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/mcqs', label: 'MCQ' },
  { to: '/exams', label: 'Exams' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/progress', label: 'Progress' },
]

export function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-dot" />
          ExamNat
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="muted small">Connecté</div>
              <div className="user-chip">
                <div className="avatar">{user.firstName?.[0] ?? 'U'}</div>
                <div>
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="muted small">{user.email}</div>
                </div>
              </div>
              <button className="button ghost" onClick={logout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="auth-actions">
              <Link className="button" to="/login">
                Se connecter
              </Link>
              <Link className="button ghost" to="/signup">
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

