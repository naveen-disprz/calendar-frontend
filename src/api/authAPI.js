import axios from 'axios'
import api from "./axiosInitiator";

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// API endpoints
const ENDPOINTS = {
    login: '/auth/login',
    signup: '/auth/signup',
}

// Authentication API functions
export const authAPI = {
    // User login
    login: async (credentials) => {
        const response = await api.post(ENDPOINTS.login, credentials)

        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }

        return response
    },

    // User signup
    signup: async (userData) => {
        const response = await api.post(ENDPOINTS.signup, userData)

        // Store token if provided (auto-login after signup)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
        }

        return response
    },
}

export default authAPI
