import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Central place to normalize errors thrown by the backend's
// { success, message, error } response shape.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        response: { data: { message: 'Network error. Please check your connection and try again.' } }
      })
    }
    return Promise.reject(error)
  }
)

export default api
