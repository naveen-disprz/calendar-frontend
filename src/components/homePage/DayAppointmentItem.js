import styles from "./DayAppointmentItem.module.sass";
import moment from "moment/moment";
import React, {useState} from "react";
import CreateAppointmentModal from "./CreateAppointmentModal";
import useStore from "../../store/store";

const DayAppointmentItem = ({event, index, isWeekView, currentDay}) => {
    const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);

    // Get the actual event start and end times
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);

    // Determine the display start and end times based on the current day
    let displayStart, displayEnd;

    if (currentDay) {
        // We have a specific day context (for multi-day handling)
        const dayStart = currentDay.clone().startOf('day');
        const dayEnd = currentDay.clone().endOf('day');

        // If event starts before this day, show it starting at midnight
        displayStart = eventStart.isBefore(dayStart) ? dayStart : eventStart;

        // If event ends after this day, show it ending at 11:59:59 PM
        displayEnd = eventEnd.isAfter(dayEnd) ? dayEnd : eventEnd;
    } else {
        // No specific day context, use actual times
        displayStart = eventStart;
        displayEnd = eventEnd;
    }

    // Calculate the top position and height based on display times
    const startMinutes = displayStart.diff(displayStart.clone().startOf('day'), 'minutes');
    const endMinutes = displayEnd.diff(displayEnd.clone().startOf('day'), 'minutes');

    let top = (((startMinutes / 30) * 60) + 30);
    if (isWeekView) {
        top += 24;
    }

    let height = ((endMinutes - startMinutes) / 30) * 60;

    // Ensure we don't exceed the calendar bounds
    if (top + height > 2940) { // 49 * 60 = 2940 (adjusted for 11:59 PM)
        height = (2940 - top);
    }

    if (top < 0) {
        height = height - Math.abs(top);
        top = 0;
    }

    // Determine if this is a multi-day event
    const isMultiDay = !eventStart.isSame(eventEnd, 'day');
    const isStartDay = currentDay && eventStart.isSame(currentDay, 'day');
    const isEndDay = currentDay && eventEnd.isSame(currentDay, 'day');
    const isContinuation = currentDay && eventStart.isBefore(currentDay, 'day');

    return (
        <>
            {isEditAppointmentModalVisible ? (
                <CreateAppointmentModal
                    open={isEditAppointmentModalVisible}
                    onClose={() => setIsEditAppointmentModalVisible(false)}
                    onSave={() => setIsEditAppointmentModalVisible(false)}
                    appointment={event}
                />
            ) : null}

            <div
                onClick={() => setIsEditAppointmentModalVisible(true)}
                key={index}
                className={`${styles.event} ${isWeekView ? styles.weekViewLeft : styles.dayViewLeft} ${isMultiDay ? styles.multiDay : ''}`}
                style={{
                    backgroundColor: event.appointmentType?.color || "#aaaaaa",
                    filter: "brightness(130%)",
                    top: `${top}px`,
                    height: `${height}px`,
                }}
            >
                {isWeekView ? (
                    <div className={styles.eventContent}>
                        <p className={styles.title}>
                            {isContinuation && "↵ "}
                            {event.title === "" ? "(No title)" : event.title}
                            {isMultiDay && !isEndDay && " →"}
                        </p>
                        <p className={styles.time}>
                            {isMultiDay ? (
                                <>
                                    {isContinuation
                                        ? `${eventStart.format("DD MMM")}`
                                        : displayStart.format("hh:mm A")
                                    }
                                    {!isEndDay && (" - "+eventEnd.format("DD MMM "))}
                                    {isEndDay && !isContinuation && ` - ${displayEnd.format("hh:mm A")}`}
                                    {isEndDay && isContinuation && ` - ${displayEnd.format("hh:mm A")}`}
                                </>
                            ) : (
                                `${displayStart.format("hh:mm A")} - ${displayEnd.format("hh:mm A")}`
                            )}
                        </p>
                    </div>
                ) : (
                    <div className={styles.eventContent}>
                        <p className={styles.title}>
                            {isContinuation && "↵ "}
                            {event.title === "" ? "(No title)" : event.title}
                            {isMultiDay && !isEndDay && " →"}
                        </p>
                        <span className={styles.time}>
                            {isMultiDay ? (
                                <>
                                    {displayStart.format("DD MMM hh:mm A")} - {eventEnd.format("DD MMM hh:mm A")}
                                </>
                            ) : (
                                `${displayStart.format("hh:mm A")} - ${displayEnd.format("hh:mm A")}`
                            )}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default DayAppointmentItem;
