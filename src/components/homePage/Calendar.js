import React, {useEffect, useState} from "react";
import styles from "./Calendar.module.sass";
import moment from "moment";
import useStore from "../../store/store";
import DayAppointmentItem from "./DayAppointmentItem";
import MonthCalendar from "./MonthCalendar";

const Calendar = ({variant = "day", selectedDate = new Date()}) => {
    if (variant === "month") {
        return <MonthCalendar selectedDate={selectedDate} />;
    }
    const halfHours = Array.from({length: 49}, (_, i) => i * 30);
    const [nowLineTop, setNowLineTop] = useState(29);

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

    // Render appointments (different for day vs week)
    const renderEvents = () => {
        if (variant === "day") {
            return fetchedAppointments.map((event, index) => (
                <DayAppointmentItem event={event} index={index} key={index}/>
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
                        const dayEvents = fetchedAppointments.filter((event) =>
                            moment(event.startDateTime).isSame(day, "day")
                        );

                        return (
                            <div className={styles.weekColumn} key={dayIndex}>
                                <div className={styles.weekHeader}>
                                    <p>{day.format("ddd")}</p>
                                    <span>{day.format("D")}</span>
                                </div>
                                {dayEvents.map((event, idx) => (
                                    <DayAppointmentItem
                                        event={event}
                                        index={idx}
                                        key={idx}
                                        isWeekView
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
                const time = moment(selectedDate).startOf("day").add(minutes, "minutes");
                const isHour = minutes % 60 === 0;

                return (
                    <div key={index} className={styles.halfHourBlock}>
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
