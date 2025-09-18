import api from "./axiosInitiator";

// API endpoints
const ENDPOINTS = {
    getAll: '/attendee',
    getAppointment:"/attendee/appointment",
    checkAvailability:"/attendee/checkAvailability",
}

// Authentication API functions
export const attendeeAPI = {
    // User login
    getAllAttendees: async () => {
        let url = ENDPOINTS.getAll + `?excludeCurrentUser=true`;
        return await api.get(url)
    },
    getAppointmentAttendees: async (appointmentId) => {
        let url = ENDPOINTS.getAppointment+`/${appointmentId}`;
        return await api.get(url)
    },
    checkAvailability: async (data) => {
        let url = ENDPOINTS.checkAvailability
        return await api.post(url, data)
    }
}

export default attendeeAPI
