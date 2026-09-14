import api from './api.js'

export const getMapData = (location) => api.get('/location/map', { params: { location } })
