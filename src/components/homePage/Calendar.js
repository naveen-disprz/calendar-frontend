import React, {useEffect, useState} from "react";
import styles from "./Calendar.module.sass";
import moment from "moment";
import useStore from "../../store/store";
import DayAppointmentItem from "./DayAppointmentItem";
import MonthCalendar from "./MonthCalendar";
import CreateAppointmentModal from "./CreateAppointmentModal";

const Calendar = ({variant = "day"}) => {
    const halfHours = Array.from({length: 49}, (_, i) => i * 30);
    const [nowLineTop, setNowLineTop] = useState(29);
    const [isCreateAppointmentModalVisible, setIsCreateAppointmentModalVisible] = useState(false)
    const [selectedBlockDate, setSelectedBlockDate] = useState(null)

    const {fetchedAppointments, selectedFromDate, selectedToDate} = useStore(
        (state) => state.appointments
    );

    // Update "now line" every second
    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment();
            const minutes = now.diff(moment().startOf("day"), "minutes");
            setNowLineTop(((minutes / 30) * 60) + 30);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (variant === "month") {
        return <MonthCalendar selectedDate={selectedFromDate}/>;
    }

    // Filter appointments for multi-day handling
    const getAppointmentsForDay = (day) => {
        return fetchedAppointments.filter((event) => {
            const eventStart = moment(event.startDateTime);
            const eventEnd = moment(event.endDateTime);
            const dayStart = day.clone().startOf('day');
            const dayEnd = day.clone().endOf('day');

            // Include if:
            // 1. Event starts on this day
            // 2. Event ends on this day
            // 3. Event spans across this day
            return (
                eventStart.isBetween(dayStart, dayEnd, null, '[]') ||
                eventEnd.isBetween(dayStart, dayEnd, null, '[]') ||
                (eventStart.isBefore(dayStart) && eventEnd.isAfter(dayEnd))
            );
        });
    };

    // Render appointments (different for day vs week)
    const renderEvents = () => {
        if (variant === "day") {
            const dayEvents = getAppointmentsForDay(selectedFromDate);
            return dayEvents.map((event, index) => (
                <DayAppointmentItem
                    event={event}
                    index={index}
                    key={`${event.id}-${selectedFromDate.format('YYYY-MM-DD')}-${index}`}
                    currentDay={selectedFromDate}
                />
            ));
        }

        if (variant === "week") {
            const startOfWeek = selectedFromDate.clone().startOf("week");
            const endOfWeek = selectedToDate.clone().endOf("week");

            const weekDays = Array.from({length: 7}, (_, i) =>
                startOfWeek.clone().add(i, "days")
            );

            return (
                <div className={styles.weekColumns}>
                    {weekDays.map((day, dayIndex) => {
                        const dayEvents = getAppointmentsForDay(day);

                        return (
                            <div className={styles.weekColumn} key={dayIndex}>
                                <div className={styles.weekHeader}>
                                    <p style={day.isSame(moment(),"day") ? {color:"#4f46e5"} : {}}>
                                        {day.format("ddd")}
                                    </p>
                                    <span style={day.isSame(moment(),"day") ? {color: "#4f46e5"} : {}}>
                                        {day.format("D")}
                                    </span>
                                </div>
                                {dayEvents.map((event, idx) => (
                                    <DayAppointmentItem
                                        event={event}
                                        index={idx}
                                        key={`${event.id}-${day.format('YYYY-MM-DD')}-${idx}`}
                                        isWeekView
                                        currentDay={day}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    return (
        <div
            className={`${styles.calendar} ${
                variant === "week" ? styles.weekCalendar : styles.dayCalendar
            }`}
        >
            {isCreateAppointmentModalVisible ? (
                <CreateAppointmentModal
                    defaultDate={selectedBlockDate}
                    onClose={() => setIsCreateAppointmentModalVisible(false)}
                    onSave={() => setIsCreateAppointmentModalVisible(false)}
                    open={isCreateAppointmentModalVisible}
                />
            ) : null}

            {/* Red Now Line */}
            <div className={styles.nowLine} style={variant === "day" ? {top: nowLineTop} : {top: nowLineTop + 23}}>
                <div
                    style={{
                        left: 0,
                        top: -9,
                        height: 20,
                        width: 63,
                        backgroundColor: "#ca0000",
                        borderRadius: "100px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p style={{fontSize: "12px", fontWeight: "500", color: "white"}}>
                        {moment().format("hh:mm A")}
                    </p>
                </div>
            </div>

            {/* Time Grid */}
            {halfHours.map((minutes, index) => {
                const time = moment(selectedFromDate).startOf("day").add(minutes, "minutes");
                const isHour = minutes % 60 === 0;

                return (
                    <div key={index} className={styles.halfHourBlock} onClick={() => {
                        setSelectedBlockDate(time)
                        setIsCreateAppointmentModalVisible(true)
                    }}>
                        <div className={styles.timeLabel}>
                            {minutes === 1440 ? "" : time.format("h:mm A")}
                        </div>
                        <div
                            className={isHour ? styles.hourLine : styles.halfHourLine}
                        ></div>
                    </div>
                );
            })}

            {/* Events */}
            {renderEvents()}
        </div>
    );
};

export default Calendar;
