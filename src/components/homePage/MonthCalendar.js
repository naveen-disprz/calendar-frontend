import React, { useMemo, useState } from "react";
import styles from "./MonthCalendar.module.sass";
import moment from "moment";
import useStore from "../../store/store";
import CreateAppointmentModal from "./CreateAppointmentModal";

const MonthCalendar = () => {
    const { fetchedAppointments, selectedFromDate, selectedToDate } = useStore(
        (state) => state.appointments
    );

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newAppointmentDate, setNewAppointmentDate] = useState(null);

    moment.updateLocale("en", { week: { dow: 0 } });

    const startOfMonth = selectedFromDate.clone().startOf("month");
    const endOfMonth = selectedToDate.clone().endOf("month");

    const startOfGrid = startOfMonth.clone().startOf("week");
    const endOfGrid = endOfMonth.clone().endOf("week");

    const days = useMemo(() => {
        const list = [];
        const cur = startOfGrid.clone();
        while (cur.isBefore(endOfGrid, "day") || cur.isSame(endOfGrid, "day")) {
            list.push(cur.clone());
            cur.add(1, "day");
        }
        return list;
    }, [startOfGrid, endOfGrid]);

    const weeks = Math.ceil(days.length / 7);

    const renderAppointments = (date) => {
        const dayEvents = fetchedAppointments.filter((event) =>
            moment(event.startDateTime).isSame(date, "day")
        );

        return (
            <div className={styles.events} key={date}>
                {dayEvents.slice(0, 3).map((event) => (
                    <div
                        key={event.id}
                        className={styles.event}
                        title={event.title}
                        style={{
                            backgroundColor: event.appointmentType?.color || "#1976d2",
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // prevent triggering the "create new" handler
                            setSelectedEvent(event);
                        }}
                    >
                        {event.title +
                            "   " +
                            moment(event.startDateTime).format("hh:mm A") +
                            " - " +
                            moment(event.endDateTime).format("hh:mm A")}
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
            <div
                className={styles.daysGrid}
                style={{ gridTemplateRows: `repeat(${weeks}, 1fr)` }}
            >
                {days.map((date, idx) => {
                    const isCurrentMonth = date.month() === startOfMonth.month();
                    const isToday = date.isSame(moment(), "day");
                    const isPast = date.isBefore(moment(), "day");

                    return (
                        <div
                            key={idx}
                            className={`${styles.dayCell} 
                ${isCurrentMonth ? "" : styles.outsideMonth} 
                ${isToday ? styles.today : ""} 
                ${isPast ? styles.pastDay : ""}`}
                            onClick={() => setNewAppointmentDate(date)} // click on empty cell
                        >
                            <div className={styles.dateNumber}>{date.date()}</div>
                            {renderAppointments(date)}
                        </div>
                    );
                })}
            </div>

            {/* Modal for editing existing event */}
            {selectedEvent && (
                <CreateAppointmentModal
                    open={!!selectedEvent}
                    appointment={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onSave={() => setSelectedEvent(null)}
                />
            )}

            {/* Modal for creating new appointment */}
            {newAppointmentDate && (
                <CreateAppointmentModal
                    open={!!newAppointmentDate}
                    defaultDate={newAppointmentDate} // 👈 pass clicked date
                    onClose={() => setNewAppointmentDate(null)}
                    onSave={() => setNewAppointmentDate(null)}
                />
            )}
        </div>
    );
};

export default MonthCalendar;
