import api from './api.js'

export const createHistoryRecord = (payload) => api.post('/weather/history', payload)

export const getHistory = (params = {}) => api.get('/weather/history', { params })

export const getHistoryRecord = (id) => api.get(`/weather/history/${id}`)

export const updateHistoryRecord = (id, payload) => api.put(`/weather/history/${id}`, payload)

export const deleteHistoryRecord = (id) => api.delete(`/weather/history/${id}`)

export const exportHistory = (format) =>
  api.get(`/export/${format}`, { responseType: 'blob' })
