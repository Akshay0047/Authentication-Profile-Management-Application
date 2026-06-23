import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Landing() {
  const { user } = useAuth()

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="page landing">
      <div className="landing-glow" />
      <span className="floating-dot" style={{ top: '18%', left: '12%', animationDelay: '0s' }} />
      <span className="floating-dot" style={{ top: '72%', left: '82%', animationDelay: '2s' }} />
      <span className="floating-dot" style={{ top: '32%', left: '86%', animationDelay: '4s' }} />
      <span className="floating-dot" style={{ top: '78%', left: '18%', animationDelay: '1.2s' }} />
      <span className="floating-dot" style={{ top: '50%', left: '6%', animationDelay: '3s' }} />

      <div className="landing-content">
        <p className="eyebrow">User Authentication and Management</p>
        <h1 className="page-title">Welcome {user ? user.name : 'User'}</h1>
        <p className="page-subtitle">Manage your account, all in one place</p>

        <div className="landing-actions">
          <Link to="/register">
            <button className="pill-button">Sign In</button>
          </Link>
          <Link to="/login">
            <button className="pill-button primary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing