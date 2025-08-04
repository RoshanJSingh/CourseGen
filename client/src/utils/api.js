import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Auth0 stores it there)
    const token = localStorage.getItem('auth0_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth0_token')
      window.location.href = '/login'
    } else if (error.response?.status === 429) {
      // Rate limited
      console.warn('Rate limited. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// API helper functions
export const apiClient = {
  // Generic request methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // Auth endpoints
  auth: {
    getProfile: () => api.get('/api/auth/profile'),
    verifyToken: () => api.get('/api/auth/verify'),
    getStatus: () => api.get('/api/auth/status'),
  },
  
  // Course endpoints
  courses: {
    getAll: (params = {}) => api.get('/api/courses', { params }),
    getById: (id) => api.get(`/api/courses/${id}`),
    create: (data) => api.post('/api/courses', data),
    update: (id, data) => api.put(`/api/courses/${id}`, data),
    delete: (id) => api.delete(`/api/courses/${id}`),
    getStats: () => api.get('/api/courses/stats'),
    getSuggestions: (partialTopic) => api.post('/api/courses/suggestions', { partialTopic }),
  },
  
  // Lesson endpoints
  lessons: {
    getById: (id) => api.get(`/api/lessons/${id}`),
    update: (id, data) => api.put(`/api/lessons/${id}`, data),
    addBlock: (id, block, position) => api.post(`/api/lessons/${id}/blocks`, { block, position }),
    updateBlock: (id, index, block) => api.put(`/api/lessons/${id}/blocks/${index}`, { block }),
    deleteBlock: (id, index) => api.delete(`/api/lessons/${id}/blocks/${index}`),
    generateHinglishAudio: (id) => api.post(`/api/lessons/${id}/audio/hinglish`),
    getAnalytics: (id) => api.get(`/api/lessons/${id}/analytics`),
  },
  
  // AI endpoints
  ai: {
    getStatus: () => api.get('/api/ai/status'),
    generateCourse: (topic) => api.post('/api/ai/generate-course', { topic }),
    generateLesson: (courseTitle, moduleTitle, lessonTitle, lessonIndex) => 
      api.post('/api/ai/generate-lesson', { courseTitle, moduleTitle, lessonTitle, lessonIndex }),
    translateToHinglish: (text) => api.post('/api/ai/translate-hinglish', { text }),
    getCourseSuggestions: (partialTopic) => api.post('/api/ai/course-suggestions', { partialTopic }),
  },
  
  // YouTube endpoints
  youtube: {
    search: (query, maxResults = 3) => api.get('/api/youtube/search', { params: { query, maxResults } }),
    getTrending: (maxResults = 10) => api.get('/api/youtube/trending', { params: { maxResults } }),
    validate: (url) => api.get('/api/youtube/validate', { params: { url } }),
    getCaptions: (videoId) => api.get(`/api/youtube/captions/${videoId}`),
    getEmbed: (videoId, title) => api.get(`/api/youtube/embed/${videoId}`, { params: { title } }),
  },
}

// Token management utilities
export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem('auth0_token', token)
  },
  getToken: () => {
    return localStorage.getItem('auth0_token')
  },
  removeToken: () => {
    localStorage.removeItem('auth0_token')
  },
  isTokenValid: () => {
    const token = tokenUtils.getToken()
    if (!token) return false
    
    try {
      // Parse JWT without verification (just for expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch (error) {
      return false
    }
  }
}

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return {
          message: data.error || 'Invalid request',
          details: data.details || [],
          type: 'validation'
        }
      case 401:
        return {
          message: 'Authentication required',
          type: 'auth'
        }
      case 403:
        return {
          message: 'Access denied',
          type: 'permission'
        }
      case 404:
        return {
          message: 'Resource not found',
          type: 'notfound'
        }
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          type: 'ratelimit'
        }
      case 500:
        return {
          message: 'Server error. Please try again later.',
          type: 'server'
        }
      default:
        return {
          message: data.error || 'An unexpected error occurred',
          type: 'unknown'
        }
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      type: 'network'
    }
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      type: 'unknown'
    }
  }
}

export { api }
export default api
