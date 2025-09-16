import styles from "./SideBar.module.sass";
import {FaListUl} from "react-icons/fa6";
import React from "react";

const SideBar = () => {
    return <div className={styles.sidebar}>
        <h2>Upcoming Appointments</h2>
        {/* Render upcoming appointments here */}
    </div>
}

export default SideBar;