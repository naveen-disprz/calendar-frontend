import styles from "./DayAppointmentItem.module.sass";
import moment from "moment/moment";
import React, {useState} from "react";
import CreateAppointmentModal from "./CreateAppointmentModal";
import useStore from "../../store/store";

const DayAppointmentItem = ({event, index, isWeekView}) => {
    const eventStart = moment(event.startDateTime);
    const eventEnd = moment(event.endDateTime);
    const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);

    // Calculate the top position and height based on the event's time
    const startMinutes = eventStart.diff(eventStart.clone().startOf('day'), 'minutes');
    const endMinutes = eventEnd.diff(eventEnd.clone().startOf('day'), 'minutes');
    let top = (((startMinutes / 30) * 60) + 30);
    if (isWeekView) {
        top += 24;
    }
    let height = ((endMinutes - startMinutes) / 30) * 60;

    if (top + height > 2908) {
        height = (2908 - top);
    }

    if (top < 0) {
        height = height - Math.abs(top)
        top = 0
    }

    return (
        <>
            {isEditAppointmentModalVisible ? (<CreateAppointmentModal open={isEditAppointmentModalVisible}
                                                                      onClose={() => {
                                                                          setIsEditAppointmentModalVisible(false)
                                                                      }}
                                                                      onSave={() => {
                                                                          setIsEditAppointmentModalVisible(false)
                                                                      }}
                                                                      appointment={event}/>) : null}
            <div
                onClick={() => {
                    setIsEditAppointmentModalVisible(true);
                }}
                key={index}
                className={styles.event}
                style={{
                    backgroundColor: event.appointmentType.color,
                    top: `${top}px`,
                    height: `${height}px`,
                    left: isWeekView ? 0 : `60px`,
                    width: isWeekView ? "100%" : `calc(100% - 60px)`
                }}
            >
                {isWeekView ? <div>
                    <p style={{textAlign: "start", fontSize:"smaller"}}>{event.title}</p>
                    <p className={styles.time} style={{fontSize:"small", textAlign: "start"}}>
                        {moment(event.startDateTime).format("DD MMM hh:mm A")} - {moment(event.endDateTime).format("DD MMM hh:mm A")}
                    </p>
                </div> : <p style={{textAlign: "start"}}>{event.title}{` - `}
                    <span className={styles.time}>
                        {moment(event.startDateTime).format("DD MMM hh:mm A")} - {moment(event.endDateTime).format("DD MMM hh:mm A")}
                        </span>
                </p>}
            </div>
        </>
    );
};

export default DayAppointmentItem;