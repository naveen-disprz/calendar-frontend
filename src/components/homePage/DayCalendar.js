import React from 'react';
import styles from './DayCalendar.module.sass';
import moment from 'moment';

const DayCalendar = ({ events = [], selectedDate = new Date() }) => {
    const halfHours = Array.from({ length: 48 }, (_, i) => i * 30);

    const renderEvents = () => {
        return events.map((event, index) => {
            const eventStart = moment(event.fromDateTime);
            const eventEnd = moment(event.toDateTime);

            // Calculate the top position and height based on the event's time
            const startMinutes = eventStart.diff(moment(selectedDate).startOf('day'), 'minutes');
            const endMinutes = eventEnd.diff(moment(selectedDate).startOf('day'), 'minutes');
            const top = (startMinutes / (24 * 60)) * 100;
            const height = ((endMinutes - startMinutes) / (24 * 60)) * 100;

            return (
                <div
                    key={index}
                    className={styles.event}
                    style={{
                        top: `${top}%`,
                        height: `${height}%`,
                    }}
                >
                    <p>{event.title}</p>
                </div>
            );
        });
    };

    return (
        <div className={styles.dayCalendar}>
            {halfHours.map((minutes, index) => {
                const time = moment(selectedDate).startOf('day').add(minutes, 'minutes');
                const isHour = minutes % 60 === 0;

                return (
                    <div key={index} className={styles.halfHourBlock}>
                        <div className={styles.timeLabel}>
                            {time.format('h:mm A')}
                        </div>
                        <div className={isHour ? styles.hourLine : styles.halfHourLine}></div>
                    </div>
                );
            })}
            {renderEvents()}
        </div>
    );
};

export default DayCalendar;
