import axios from 'axios'
import api from "./axiosInitiator";

// API endpoints
const ENDPOINTS = {
    add: '/appointment',
    edit: '/appointment',
    getAppointments: '/appointment',
    getTypes: '/appointment/types',
    delete: '/appointment',
}

// Authentication API functions
export const authAPI = {
    // User login
    login: async (credentials) => {
        const response = await api.post(ENDPOINTS.LOGIN, credentials)

        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }

        return response
    },

    // User signup
    signup: async (userData) => {
        const response = await api.post(ENDPOINTS.SIGNUP, userData)

        // Store token if provided (auto-login after signup)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
        }

        return response
    },
}

export default authAPI
