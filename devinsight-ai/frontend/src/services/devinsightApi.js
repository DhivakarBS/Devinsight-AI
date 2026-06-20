import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' })

export const analyzeProfile = (username, token) => {
  return API.post('/github/analyze', { username }, { headers: { Authorization: `Bearer ${token}` } })
}

export const getCareerRecommendations = (username, token) => {
  return API.post('/github/career-recommendations', { username }, { headers: { Authorization: `Bearer ${token}` } })
}

export const getHistory = (params, token) => {
  return API.get('/github/history', { params, headers: { Authorization: `Bearer ${token}` } })
}

export default API
