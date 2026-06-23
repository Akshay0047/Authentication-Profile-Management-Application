import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface ProfileData {
  name: string
  email: string
  profile_image: string | null
}

function Profile() {
  const { accessToken, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setProfile(response.data)
      } catch (err: any) {
        setError('Failed to load profile')
      }
    }

    if (accessToken) {
      fetchProfile()
    }
  }, [accessToken])

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploading(true)

    try {
      const base64 = await fileToBase64(file)

      const response = await api.post(
        '/profile/upload/',
        { profile_image: base64 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      const newImage = response.data.profile_image ?? base64

      setProfile((prev) => (prev ? { ...prev, profile_image: newImage } : prev))
      updateUser({ profile_image: newImage })
    } catch (err: any) {
      setUploadError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (error) return <p className="page">{error}</p>
  if (!profile) return <p className="page">Loading...</p>

  return (
    <div className="page">
      <h1 className="page-title">Your Profile</h1>
      <p className="page-subtitle">Manage your account details</p>

      <div className="profile-card">
        {profile.profile_image ? (
          <img className="profile-avatar" src={profile.profile_image} alt="Profile" />
        ) : (
          <div className="profile-avatar" />
        )}

        <p className="profile-field">{profile.name}</p>
        <p className="profile-field">{profile.email}</p>

        <label className="file-input-label">
          {uploading ? 'Uploading...' : 'Change photo'}
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
        </label>
        {uploadError && <p className="form-error">{uploadError}</p>}

        <div className="profile-actions">
          <button className="pill-button" onClick={() => navigate('/profile/update')}>
            Update Profile
          </button>
          <button className="pill-button primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile