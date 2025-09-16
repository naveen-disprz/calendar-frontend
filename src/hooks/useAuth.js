import {useState, useEffect, useCallback} from 'react'
import authAPI from '../api/authAPI'
import {useNavigate} from "react-router-dom"; // adjust path to where your authAPI file lives

export function useAuth() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })


    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Sync user + token with localStorage changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }

        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [user, token])

    // Login
    const login = useCallback(async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.login(credentials)
            setUser(response.data.user)
            setToken(response.data.token)
            return response
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Signup
    const signup = useCallback(async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.signup(userData)
            if (response.data.user) setUser(response.data.user)
            if (response.data.token) setToken(response.data.token)
            return response
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Logout
    const logout = useCallback(() => {
        navigate('/auth#login')
        setUser(null)
        setToken(null)
    }, [navigate])

    return {
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        setError,
        setLoading,
        isAuthenticated: !!token,
    }
}
