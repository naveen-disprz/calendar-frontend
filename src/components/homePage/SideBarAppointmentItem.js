import styles from "./SideBarAppointmentItem.module.sass";
import React, {useState} from "react";
import moment from "moment";
import {useAuth} from "../../hooks/useAuth";
import CreateAppointmentModal from "./CreateAppointmentModal";

const SideBarAppointmentItem = ({appt}) => {
    const now = moment();
    const {user} = useAuth();
    const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false)

    let status = "Upcoming";
    if (now.isBefore(moment(appt.startDateTime))) {
        status = "Upcoming";
    } else if (now.isAfter(moment(appt.endDateTime))) {
        status = "Completed";
    } else {
        status = "Ongoing";
    }

    return (<div key={appt.id} className={styles.item} onClick={() => setIsEditAppointmentModalVisible(true)}>
        {isEditAppointmentModalVisible && <CreateAppointmentModal open={isEditAppointmentModalVisible}
                                                                  appointment={appt}
                                                                  onClose={() => {
                                                                      console.log("Hellow")
                                                                      setIsEditAppointmentModalVisible(false)
                                                                  }}
                                                                  onSave={() => {
                                                                      console.log("Hellow1")
                                                                      setIsEditAppointmentModalVisible(false)
                                                                  }}/>}
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
            <div style={{display: "flex", justifyContent: "space-around", alignItems:"center"}}>
                <div>
                    <p className={styles.time}>{moment(appt.startDateTime).format("DD MMM")}</p>
                    <p className={styles.time}>{moment(appt.startDateTime).format("hh:mm A")}</p>
                </div>
                <p className={styles.time}> - </p>
                <div>
                    <p className={styles.time}>{moment(appt.endDateTime).format("DD MMM")}</p>
                    <p className={styles.time}>{moment(appt.endDateTime).format("hh:mm A")}</p>
                </div>
            </div>
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
