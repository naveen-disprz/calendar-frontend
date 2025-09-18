import React from "react";
import styles from "./MonthCalendar.module.sass";
import moment from "moment";
import useStore from "../../store/store";

const MonthCalendar = ({ selectedDate = new Date() }) => {
    const { fetchedAppointments } = useStore((state) => state.appointments);

    const startOfMonth = moment(selectedDate).startOf("month");
    const endOfMonth = moment(selectedDate).endOf("month");

    // Calendar grid starts from Sunday of the first week of the month
    const startOfGrid = startOfMonth.clone().startOf("week");
    // Ends on Saturday of the last week of the month
    const endOfGrid = endOfMonth.clone().endOf("week");

    const days = [];
    let day = startOfGrid.clone();

    while (day.isBefore(endOfGrid, "day") || day.isSame(endOfGrid, "day")) {
        days.push(day.clone());
        day.add(1, "day");
    }

    const renderAppointments = (date) => {
        const dayEvents = fetchedAppointments.filter((event) =>
            moment(event.startDateTime).isSame(date, "day")
        );

        return (
            <div className={styles.events}>
                {dayEvents.slice(0, 3).map((event, idx) => (
                    <div
                        key={idx}
                        className={styles.event}
                        style={{ backgroundColor: event.appointmentType?.color || "#1976d2" }}
                    >
                        {event.title || "Untitled"}
                    </div>
                ))}
                {dayEvents.length > 3 && (
                    <div className={styles.more}>+{dayEvents.length - 3} more</div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.monthCalendar}>
            {/* Weekday headers */}
            <div className={styles.weekdays}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className={styles.weekday}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid of days */}
            <div className={styles.daysGrid}>
                {days.map((date, idx) => {
                    const isCurrentMonth = date.month() === startOfMonth.month();
                    const isToday = date.isSame(moment(), "day");

                    return (
                        <div
                            key={idx}
                            className={`${styles.dayCell} ${
                                isCurrentMonth ? "" : styles.outsideMonth
                            } ${isToday ? styles.today : ""}`}
                        >
                            <div className={styles.dateNumber}>{date.date()}</div>
                            {renderAppointments(date)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthCalendar;
