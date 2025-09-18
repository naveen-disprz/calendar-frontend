import styles from "./SideBar.module.sass";
import { FaListUl } from "react-icons/fa6";
import React from "react";
import moment from "moment";
import useStore from "../../store/store";
import SideBarAppointmentItem from "./SideBarAppointmentItem";

const SideBar = () => {
    const {todayAppointments} = useStore((state) => state.appointments);

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.sidebarHeader}>
                <FaListUl size={16} style={{ marginRight: "0.5rem" }} />
                Today’s Appointments
            </h3>
            <hr/>

            {todayAppointments.length === 0 ? (
                <p className={styles.empty}>No appointments today.</p>
            ) : (
                <ul className={styles.list}>
                    {todayAppointments
                        .sort((a, b) => moment(a.startDateTime).diff(moment(b.startDateTime)))
                        .map((appt) => {
                            return <SideBarAppointmentItem key={appt.id} appt={appt}/>
                        })}
                </ul>
            )}
        </div>
    );
};

export default SideBar;
