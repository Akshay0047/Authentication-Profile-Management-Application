import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { accessToken, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <svg className="navbar-logo" viewBox="0 0 14 14" fill="none">
          <circle cx="3" cy="3" r="2" fill="#f5f5f5" />
          <circle cx="11" cy="3" r="2" fill="#f5f5f5" opacity="0.6" />
          <circle cx="3" cy="11" r="2" fill="#f5f5f5" opacity="0.6" />
          <circle cx="11" cy="11" r="2" fill="#f5f5f5" opacity="0.3" />
        </svg>
      </Link>

      {accessToken ? (
        <div className="navbar-links">
          <Link to="/profile">Profile</Link>
          <Link to="/profile/update">Update Profile</Link>
          <button className="pill-button primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">
            <button className="pill-button primary">Register</button>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar