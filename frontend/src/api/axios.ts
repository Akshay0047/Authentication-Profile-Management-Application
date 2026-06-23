import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

let onTokenRefreshed: ((access: string) => void) | null = null
let onRefreshFailed: (() => void) | null = null

export function registerAuthCallbacks(
  refreshedCallback: (access: string) => void,
  failedCallback: () => void
) {
  onTokenRefreshed = refreshedCallback
  onRefreshFailed = failedCallback
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh')
      if (!refreshToken) {
        onRefreshFailed?.()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        })
        const newAccess = response.data.access

        localStorage.setItem('access', newAccess)
        onTokenRefreshed?.(newAccess)

        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (refreshError) {
        onRefreshFailed?.()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api