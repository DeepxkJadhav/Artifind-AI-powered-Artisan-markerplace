import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Artisans
  getArtisans: () => api.get('/artisans'),
  getArtisan: (id) => api.get(`/artisans/${id}`),

  // Products
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByArtisan: (artisanId) => api.get(`/products/artisan/${artisanId}`),

  // AI Services
  analyzeImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/ai/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  generateDescription: (data) => api.post('/ai/generate-description', data),
  suggestTags: (data) => api.post('/ai/suggest-tags', data),
  enhanceSearch: (query) => api.post('/ai/enhance-search', { query }),

  // Chat
  sendChatMessage: (message, sessionId) => api.post('/chat/message', { message, sessionId }),
  getChatHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  clearChatSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
};

export default api;