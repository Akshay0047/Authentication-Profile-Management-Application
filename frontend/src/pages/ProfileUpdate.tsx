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
    <div>
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default ProfileUpdate