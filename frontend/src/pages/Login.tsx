import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/login/', { email, password })
      const { access, refresh, user } = response.data
      login(user, access, refresh)
      navigate('/profile')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Welcome back</h1>
      <p className="page-subtitle">Sign in to continue</p>

      <form className="auth-card" onSubmit={handleSubmit}>
        <input
          className="pill-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="pill-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <button className="pill-button primary" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login