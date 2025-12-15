import { Link } from 'react-router-dom'

const cards = [
  { title: 'Lessons', desc: 'Consulter et lire les cours', to: '/lessons' },
  { title: 'MCQ', desc: 'Quiz multi-choix par sujet/niveau', to: '/mcqs' },
  { title: 'Exams', desc: 'Passé d’examens et sujets', to: '/exams' },
  { title: 'Notifications', desc: 'Alertes et messages', to: '/notifications' },
  { title: 'Progress', desc: 'Scores et suivi', to: '/progress' },
]

export function HomePage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Bienvenue</p>
          <h1>ExamNat</h1>
          <p className="muted">Accédez rapidement aux fonctionnalités clés.</p>
        </div>
      </div>
      <div className="grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card">
            <div className="card-title">{card.title}</div>
            <p className="muted">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

