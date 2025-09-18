import moment from "moment";
import appointmentAPI from "../api/appointmentAPI";

const appointmentsSlice = (set, get) => ({
    todayAppointments: [],
    fetchedAppointments: [],
    appointmentTypes: [],
    allAttendees: [],
    selectedFrequency: "daily",
    selectedFromDate: moment(),
    selectedToDate: moment(),

    setField: (key, value) => set({[key]: value}),

    loadAppointmentsFromDB: async () => {
        const {selectedFromDate, selectedToDate} = get().appointments;

        try {
            let response = await appointmentAPI.getAppointments(
                selectedFromDate.clone().startOf("day").utc().toISOString(),
                selectedToDate.clone().endOf("day").utc().toISOString()
            );

            let localAppointments = response.data.map((appointment) => ({
                ...appointment,
                startDateTime: moment
                    .utc(appointment.startDateTime)
                    .local()
                    .toISOString(),
                endDateTime: moment
                    .utc(appointment.endDateTime)
                    .local()
                    .toISOString(),
                parentAppointmentStartDateTime: appointment.parentAppointmentStartDateTime ? moment
                    .utc(appointment.parentAppointmentStartDateTime)
                    .local()
                    .toISOString() : null,
                parentAppointmentEndDateTime: appointment.parentAppointmentEndDateTime ? moment
                    .utc(appointment.parentAppointmentEndDateTime)
                    .local()
                    .toISOString() : null
            }));

            set({fetchedAppointments: localAppointments});

            response = await appointmentAPI.getAppointments(
                moment().startOf("day").utc().toISOString(),
                moment().endOf("day").utc().toISOString()
            );

            localAppointments = response.data.map((appointment) => ({
                ...appointment,
                startDateTime: moment
                    .utc(appointment.startDateTime)
                    .local()
                    .toISOString(),
                endDateTime: moment
                    .utc(appointment.endDateTime)
                    .local()
                    .toISOString(),
                parentAppointmentStartDateTime: appointment.parentAppointmentStartDateTime ? moment
                    .utc(appointment.parentAppointmentStartDateTime)
                    .local()
                    .toISOString() : null,
                parentAppointmentEndDateTime: appointment.parentAppointmentEndDateTime ? moment
                    .utc(appointment.parentAppointmentEndDateTime)
                    .local()
                    .toISOString() : null
            }));

            set({todayAppointments: localAppointments});

        } catch (err) {
            console.error("Failed to load appointments:", err);
        }
    },
});

export default appointmentsSlice;
