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
    getAppointments: async (fromDate, toDate, appointmentTypeId, isRecurring) => {
        let url = ENDPOINTS.getAppointments + `?fromDate=${fromDate}&toDate=${toDate}&includeRecurring=true`;
        if (appointmentTypeId) {
            url += `&appointmentTypeId=${appointmentTypeId}`;
        }
        if (isRecurring) {
            url += `&isRecurring=${isRecurring}`;
        }
        return await api.get(url)
    },
    addAppointment: async (appointment) => {
        return await api.post(ENDPOINTS.add, appointment)
    },
    deleteAppointment: async (appointmentId) => {
        return await api.delete(ENDPOINTS.delete + `/${appointmentId}`)
    },
    getAppointmentTypes: async () => {
        return await api.get(ENDPOINTS.getTypes)
    },
    editAppointment: async (appointmentId, appointment) => {
        let url = ENDPOINTS.edit + `/${appointmentId}`;

        return await api.put(url, appointment)
    }
}

export default authAPI
