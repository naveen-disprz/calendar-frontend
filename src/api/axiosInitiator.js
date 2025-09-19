import axios from "axios";
import {toast} from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor → add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor → handle errors consistently
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "API request failed";

        if (error?.response?.status === 401) {
            console.log(error.response)
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.replace("auth#login");
            return Promise.reject(new Error(message));
        }


        return Promise.reject(new Error(message));
    }
);
export default api;