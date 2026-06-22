import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface ProfileData {
  name: string
  email: string
  profile_image: string | null
}

function Profile() {
  const { accessToken } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState('')

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

  if (error) return <p>{error}</p>
  if (!profile) return <p>Loading...</p>

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      {profile.profile_image && (
        <img src={profile.profile_image} alt="Profile" width={100} />
      )}
    </div>
  )
}

export default Profile