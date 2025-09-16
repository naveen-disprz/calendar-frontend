import moment from "moment";

const appointmentsSlice = (set) => ({
    dailyAppointments: [],
    fetchedAppointments: [],
    selectedFrequency: 'daily',
    selectedFromDate: moment(),
    selectedToDate: moment(),
    setField: (key, value) => set({ [key]: value }),
})

export default appointmentsSlice;
