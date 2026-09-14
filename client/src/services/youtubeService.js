import api from './api.js'

export const getLocationVideos = (location) => api.get('/youtube', { params: { location } })
