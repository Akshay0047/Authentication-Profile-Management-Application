import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      await api.post('/register/', { name, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Create your account</h1>
      <p className="page-subtitle">Get started in seconds</p>

      <form className="auth-card" onSubmit={handleSubmit}>
        <input
          className="pill-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Register
        </button>
      </form>
    </div>
  )
}

export default Register