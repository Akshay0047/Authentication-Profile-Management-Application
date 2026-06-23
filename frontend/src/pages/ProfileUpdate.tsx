import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function ProfileUpdate() {
  const { user, accessToken, updateUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await api.put(
        '/profile/update/',
        { name, email },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      updateUser({ name: response.data.name, email: response.data.email })
      navigate('/profile')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Update profile</h1>
      <p className="page-subtitle">Change your name or email</p>

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
        {error && <p className="form-error">{error}</p>}
        <button className="pill-button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default ProfileUpdate