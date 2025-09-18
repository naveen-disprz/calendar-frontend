import styles from "./SideBarAppointmentItem.module.sass";
import React from "react";
import moment from "moment";
import {useAuth} from "../../hooks/useAuth";

const SideBarAppointmentItem = ({appt}) => {
    const now = moment();
    const {user} = useAuth();

    let status = "Upcoming";
    if (now.isBefore(moment(appt.startDateTime))) {
        status = "Upcoming";
    } else if (now.isAfter(moment(appt.endDateTime))) {
        status = "Completed";
    } else {
        status = "Ongoing";
    }

    return (<div key={appt.id} className={styles.item}>
        <div
            className={styles.coloredBlock}
            style={{backgroundColor: appt.appointmentType.color}}
        />

        {/* Status */}
        <span
            className={`${styles.status} ${status === "Upcoming" ? styles.upcoming : status === "Ongoing" ? styles.ongoing : styles.completed}`}
        >
        {status}
      </span>
        {/* Main Info */}
        <div className={styles.main}>
            <p className={styles.title}>{appt.title || "Untitled"}</p>
            <p className={styles.time}>
                {moment(appt.startDateTime).format("hh:mm A")} -{" "}
                {moment(appt.endDateTime).format("hh:mm A")}
            </p>
        </div>


        {/* Details */}
        <div className={styles.details}>
            <div className={styles.meta}>
                {appt.appointmentType && (<span className={styles.type}>
              <span
                  className={styles.typeDot}
                  style={{backgroundColor: appt.appointmentType.color}}
              />
                    {appt.appointmentType.name}
            </span>)}
                {appt.location && (<span className={styles.location}>{appt.location}</span>)}
            </div>

            {appt.organizerName && (<div className={styles.organizer}>Created
                by {appt.organizerId === user.id ? "You" : appt.organizerName}</div>)}
        </div>
    </div>);
};

export default SideBarAppointmentItem;
