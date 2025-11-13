// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    login: `${API_BASE_URL}/login/`,
    register: `${API_BASE_URL}/register/`,
    logout: `${API_BASE_URL}/logout/`,
    
    // Movie endpoints (guest accessible)
    topMovies: `${API_BASE_URL}/movies/`,
    moviesByCategory: `${API_BASE_URL}/movies/category/`,
    movieDetail: (id) => `${API_BASE_URL}/movies/${id}/`,
    searchMovies: `${API_BASE_URL}/search-movies/`,
};

// API client with error handling
export const apiClient = {
    get: async (url, params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },
    
    post: async (url, data = {}, token = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },
};

export default API_ENDPOINTS;
