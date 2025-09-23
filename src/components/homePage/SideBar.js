import styles from "./SideBar.module.sass";
import {FaListUl} from "react-icons/fa6";
import React from "react";
import moment from "moment";
import useStore from "../../store/store";
import SideBarAppointmentItem from "./SideBarAppointmentItem";

const SideBar = ({isOpen}) => {
    const {fetchedAppointments} = useStore((state) => state.appointments);


    return (
        <div className={styles.sidebar} style={isOpen ? {left: 0} : {left: "-80%"}}>
            <h3 className={styles.sidebarHeader}>
                {/*<FaListUl size={16} style={{ marginRight: "0.5rem" }} />*/}
                Appointments List
            </h3>
            <hr/>

            {fetchedAppointments.length === 0 ? (
                <p className={styles.empty}>No appointments.</p>
            ) : (
                <ul className={styles.list}>
                    {fetchedAppointments
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
