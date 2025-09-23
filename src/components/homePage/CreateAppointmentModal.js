import React, {useState, useEffect} from "react";
import styles from "./CreateAppointmentModal.module.sass";
import {IoMdClose} from "react-icons/io";
import {FaCheck} from "react-icons/fa";
import CustomDropdown from "../common/CustomDropdown";
import ToggleSwitch from "../common/ToggleSwitch";
import CustomInput from "../common/CustomInput";
import moment from "moment";
import useStore from "../../store/store";
import {toast} from "react-toastify";
import appointmentAPI from "../../api/appointmentAPI";
import {FaRegTrashCan} from "react-icons/fa6";
import Modal from "../common/Modal";
import attendeeAPI from "../../api/attendeeAPI";
import {useAuth} from "../../hooks/useAuth";


const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfMonth = Array.from({length: 31}, (_, i) => i + 1);

const CreateAppointmentModal = ({open, onClose, onSave, appointment, defaultDate}) => {
    const {appointmentTypes, allAttendees} = useStore(
        (state) => state.appointments
    );
    const {loadAppointmentsFromDB} = useStore(state => state.appointments);
    const {user} = useAuth()
    const isOrganizer = appointment ? appointment.organizerId === user.id : true;


    // ----------------- STATES -----------------
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [appointmentType, setAppointmentType] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [startDateTime, setStartDateTime] = useState(moment(defaultDate));
    const [endDateTime, setEndDateTime] = useState(defaultDate ? moment(defaultDate).add(30, "minutes") : null);

    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState("DAILY");
    const [daysOfWeekSelected, setDaysOfWeekSelected] = useState([]);
    const [daysOfMonthSelected, setDaysOfMonthSelected] = useState([]);
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

    // ----------------- PREFILL ON EDIT -----------------
    useEffect(() => {
        if (appointment) {
            setTitle(appointment.title || "");
            setDescription(appointment.description || "");
            setLocation(appointment.location || "");
            setAppointmentType(
                appointmentTypes.find((t) => t.id === appointment.appointmentType?.id) ||
                null
            );
            setParticipants(appointment.attendeeIds || []);

            setStartDateTime(moment(appointment.startDateTime));
            setEndDateTime(moment(appointment.endDateTime));


            if (appointment.recurrence) {
                setIsRecurring(true);
                setFrequency(appointment.recurrence.frequency || "DAILY");
                setDaysOfWeekSelected(appointment.recurrence.daysOfWeek || []);
                setDaysOfMonthSelected(appointment.recurrence.daysOfMonth || []);
                setRecurrenceEndDate(
                    appointment.recurrence.endDate
                        ? moment(appointment.recurrence.endDate)
                        : null
                );
            } else {
                setIsRecurring(false);
            }
        } else {
            // Reset when creating new
            setTitle("");
            setDescription("");
            setLocation("");
            setAppointmentType(null);
            setParticipants([]);
            setStartDateTime(moment(defaultDate));
            setEndDateTime(defaultDate ? moment(defaultDate).add(30, "minutes") : null);
            setIsRecurring(false);
            setFrequency("DAILY");
            setDaysOfWeekSelected([]);
            setDaysOfMonthSelected([]);
            setRecurrenceEndDate(null);
        }
    }, [appointment, appointmentTypes, open]);

    useEffect(() => {
        if (appointment) {
            attendeeAPI.getAppointmentAttendees((appointment && appointment.isRecurringInstance) ? appointment.parentAppointmentId : appointment.id).then((response) => {
                setParticipants(response.data.map(item => {
                    return item.id
                }))
            })
        }
    }, [appointment]);

    // ----------------- HANDLERS -----------------
    const toggleDayOfWeek = (dayIndex) => {
        setDaysOfWeekSelected((prev) =>
            prev.includes(dayIndex)
                ? prev.filter((d) => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    const toggleDayOfMonth = (dayIndex) => {
        setDaysOfMonthSelected((prev) =>
            prev.includes(dayIndex)
                ? prev.filter((d) => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    const toggleParticipant = (userId) => {
        setParticipants((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSave = async () => {
        // if (!title || title.trim() === "") {
        //     toast.warn("Title is required.");
        //     return;
        // }

        // if (!appointmentType) {
        //     toast.warn("Appointment type is required.");
        //     return;
        // }

        if (!startDateTime || !endDateTime) {
            toast.warn("Start date and end date are required.");
            return;
        }

        console.log(startDateTime.format());
        console.log(endDateTime.format());
        console.log(startDateTime.isSameOrAfter(endDateTime, "minutes"));


        if (startDateTime.isSameOrAfter(endDateTime, "minutes")) {
            toast.warn("End date must be after start date.");
            return;
        }

        if (isRecurring) {
            if (!recurrenceEndDate) {
                toast.warn("Recurrence end date is required for recurring appointments.");
                return;
            }
            if (
                recurrenceEndDate.isSameOrBefore(endDateTime) ||
                recurrenceEndDate.isSameOrBefore(startDateTime)
            ) {
                toast.warn(
                    "Recurrence end date must be after start date and end date."
                );
                return;
            }
            console.log(endDateTime)
            console.log(startDateTime)

            if (endDateTime.isAfter(startDateTime, "days")) {
                toast.warn("You can't create multi day appointment with recurrence.");
                return;
            }
        }

        const payload = {
            title,
            description,
            location,
            startDateTime: (appointment && appointment.isRecurringInstance) ? moment(appointment.parentAppointmentStartDateTime).clone().hour(startDateTime.hour()).minute(startDateTime.minute()).second(startDateTime.second()).utc().toISOString() : startDateTime.clone().utc().toISOString(),
            endDateTime: (appointment && appointment.isRecurringInstance) ? moment(appointment.parentAppointmentEndDateTime).clone().hour(endDateTime.hour()).minute(endDateTime.minute()).second(endDateTime.second()).utc().toISOString() : endDateTime.clone().utc().toISOString(),
            appointmentTypeId: appointmentType?.id || null,
            attendeeIds: participants,
            recurrence: isRecurring
                ? {
                    frequency,
                    daysOfWeek: frequency === "WEEKLY" ? daysOfWeekSelected : [],
                    daysOfMonth: frequency === "MONTHLY" ? daysOfMonthSelected : [],
                    endDate: recurrenceEndDate
                        ? recurrenceEndDate.clone().utc().toISOString()
                        : null,
                }
                : null,
        };

        try {
            setIsLoading(true);
            if (appointment) {
                await appointmentAPI.editAppointment((appointment && appointment.isRecurringInstance) ? appointment.parentAppointmentId : appointment.id, payload);
                toast.success("Appointment updated successfully.");
            } else {
                await appointmentAPI.addAppointment(payload);
                toast.success("Appointment created successfully.");
            }
            loadAppointmentsFromDB();
            onSave();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    // ----------------- RENDER -----------------
    return (
        <>
            <Modal
                isOpen={open}
                onClose={onClose}
                title={appointment ? isOrganizer ? "Edit Appointment" : "Appointment" : "Create Appointment"}
                fullscreen // ✅ take full screen for form modal
                footer={isOrganizer ?
                    <>
                        {appointment ? <button
                            onClick={() => {
                                setIsDeleteModalVisible(true);
                            }}
                            disabled={isLoading}
                            className={styles.deleteButton}
                        >
                            <FaRegTrashCan size={17} color={"#da0000"}/>
                        </button> : null}
                        <button onClick={onClose} disabled={isLoading} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isLoading} className={styles.saveButton}>
                            {isLoading
                                ? appointment
                                    ? "Updating..."
                                    : "Creating..."
                                : appointment
                                    ? "Update Appointment"
                                    : "Create Appointment"}
                        </button>
                    </> : null
                }
            >
                {isDeleteModalVisible && (
                    <Modal
                        isOpen={isDeleteModalVisible}
                        onClose={() => setIsDeleteModalVisible(false)}
                        title="Delete Appointment"
                        variant="prompt"
                        footer={
                            <>
                                <button
                                    onClick={() => setIsDeleteModalVisible(false)}
                                    className={styles.cancelButton}
                                >
                                    No
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            setIsDeleteModalVisible(false);
                                            onClose()
                                            await toast.promise(
                                                async () => {
                                                    await appointmentAPI.deleteAppointment(appointment.isRecurringInstance ? appointment.parentAppointmentId : appointment.id)
                                                },
                                                {
                                                    pending: 'Appointment deletion in progress...',
                                                    success: 'Appointment deleted successfully.',
                                                    error: "Appointment deletion failed.",
                                                }
                                            )
                                        } catch (e) {

                                        } finally {
                                            loadAppointmentsFromDB();
                                        }
                                    }} // <-- implement this function
                                    className={styles.deleteButton}
                                >
                                    Yes
                                </button>
                            </>
                        }
                    >
                        <p>Are you sure you want to delete this appointment?</p>
                    </Modal>
                )}
                {/* title, description, location */}
                <CustomInput
                    disabled={!isOrganizer || isLoading}
                    label={"Title"}
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <CustomInput
                    disabled={!isOrganizer || isLoading}
                    type={"textArea"}
                    label={"Description"}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <CustomInput
                    disabled={!isOrganizer || isLoading}
                    type="text"
                    placeholder="Location"
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                {/* appointment type */}
                <CustomDropdown
                    label="Appointment Type"
                    disabled={!isOrganizer || isLoading}
                    options={appointmentTypes}
                    value={appointmentType}
                    onChange={setAppointmentType}
                    labelKey="name"
                    colorKey="color"
                    placeholder="Select Appointment Type"
                />

                {/* Start & End datetime */}
                <div className={styles.row}>
                    <CustomInput
                        disabled={!isOrganizer || isLoading}
                        label={"From Date & Time"}
                        type={(appointment && appointment.isRecurringInstance) ? "time" : "datetime"}
                        placeholder={"Select appointment start date"}
                        maxDate={endDateTime}
                        value={startDateTime}
                        onChange={(date) =>
                            date ? setStartDateTime(moment(date)) : setStartDateTime(null)
                        }
                    />

                    <CustomInput
                        minDate={startDateTime}
                        disabled={!isOrganizer || isLoading}
                        label={"To Date & Time"}
                        type={(appointment && appointment.isRecurringInstance) ? "time" : "datetime"}
                        placeholder={"Select appointment end date"}
                        value={endDateTime}
                        onChange={(date) =>
                            date ? setEndDateTime(moment(date)) : setEndDateTime(null)
                        }
                    />
                </div>
                {(appointment && appointment.isRecurringInstance) ?
                    <p style={{fontSize: "small"}}>This is a recurring appointment</p> : null}
                <hr/>

                {/* Recurring */}
                <div className={styles.toggleRow}>
                    <span>Recurring Appointment</span>
                    <ToggleSwitch disabled={!isOrganizer || isLoading} checked={isRecurring} onChange={setIsRecurring}/>
                </div>

                {isRecurring && (
                    <>
                        {/* Frequency buttons */}
                        <div className={styles.frequencyButtons}>
                            {["DAILY", "WEEKLY", "MONTHLY"].map((f) => (
                                <button
                                    disabled={!isOrganizer || isLoading}
                                    key={f}
                                    type="button"
                                    className={`${styles.freqButton} ${
                                        frequency === f ? styles.selected : ""
                                    }`}
                                    onClick={() => setFrequency(f)}
                                >
                                    {f.charAt(0) + f.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>

                        {frequency === "WEEKLY" && (
                            <div className={styles.daySelector}>
                                {daysOfWeek.map((day, idx) => (
                                    <button
                                        disabled={!isOrganizer || isLoading}
                                        type="button"
                                        key={idx}
                                        className={`${styles.dayButton} ${
                                            daysOfWeekSelected.includes(idx) ? styles.selected : ""
                                        }`}
                                        onClick={() => toggleDayOfWeek(idx)}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}

                        {frequency === "MONTHLY" && (
                            <div className={styles.daySelector}>
                                {daysOfMonth.map((day) => (
                                    <button
                                        disabled={!isOrganizer || isLoading}
                                        type="button"
                                        key={day}
                                        className={`${styles.dayButton} ${
                                            daysOfMonthSelected.includes(day)
                                                ? styles.selected
                                                : ""
                                        }`}
                                        onClick={() => toggleDayOfMonth(day)}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Recurrence end date */}
                        <CustomInput
                            disabled={!isOrganizer || isLoading}
                            type={"date"}
                            label={"Recurrence end date"}
                            placeholder={"Select Recurrence End Date"}
                            value={recurrenceEndDate}
                            onChange={(date) => setRecurrenceEndDate(moment(date))}
                        />
                    </>
                )}

                <hr/>

                {/* Participants */}
                {isOrganizer ? <div className={styles.participants}>
                    <p style={{textAlign: "start"}}>Select attendees</p>
                    {allAttendees.length === 0 ? (
                        <div style={{margin: "2rem 0"}}>
                            {isOrganizer ? <p>No available attendees</p> : <p>No attendees</p>}
                        </div>
                    ) : (
                        <div className={styles.userList}>
                            {allAttendees.map((user) => {
                                const selected = participants.includes(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        className={`${styles.userCard} ${
                                            selected ? styles.selectedUser : ""
                                        }`}
                                        onClick={() => {
                                            if (!startDateTime || !endDateTime) {
                                                toast.error("Start date and end date is required to check availability");
                                                return;
                                            }
                                            if (!(participants.some(p => p === user.id))) {
                                                toast.promise(async () => {
                                                    const response = await attendeeAPI.checkAvailability({
                                                        startDateTime: startDateTime.clone().utc().toISOString(),
                                                        endDateTime: endDateTime.clone().utc().toISOString(),
                                                        attendeeId: user.id,
                                                        excludeAppointmentId: appointment ? appointment.isRecurringInstance ? appointment.parentAppointmentId : appointment.id : null
                                                    })
                                                    if (!response.data.isAvailable) {
                                                        throw new Error("Not available")
                                                    }
                                                }, {
                                                    // pending: "Checking " + user.firstName + " availability",
                                                    // success: "Added " + user.firstName,
                                                    error: user.firstName + " is busy on the time range",
                                                }).then(() => {
                                                    toggleParticipant(user.id)
                                                }).catch(e => {
                                                    console.log(e)
                                                })
                                            } else {
                                                toggleParticipant(user.id)
                                            }
                                        }}
                                    >
                                        <div className={styles.userAvatar}>
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={styles.userName}>{user.fullName}</span>
                                        {selected && <FaCheck className={styles.checkIcon}/>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div> : <div className={styles.participants}>
                    <p style={{textAlign: "start"}}>Attendees</p>
                    {participants.length === 0 ? (
                        <div style={{margin: "2rem 0"}}>
                            <p>No available attendees</p>
                        </div>
                    ) : (
                        <div className={styles.userList}>
                            {[participants.some(p => p === user.id) ? user : null, ...allAttendees.filter(a => participants.some(p => p === a.id))].map((attendee) => {
                                return (
                                    <div
                                        key={attendee.id}
                                        className={`${styles.userCard} ${styles.selectedUser}`}
                                        onClick={() => {
                                        }}
                                    >
                                        <div className={styles.userAvatar}>
                                            {attendee.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className={styles.userName}>{attendee.id === user.id ? "You" : attendee.fullName}</span>
                                        <FaCheck className={styles.checkIcon}/>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>}


            </Modal>
        </>
    )
        ;
};

export default CreateAppointmentModal;
