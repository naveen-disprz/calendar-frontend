import React, {useEffect, useState} from 'react';
import styles from './HomePage.module.sass';
import {IoIosArrowForward} from "react-icons/io";
import {IoIosArrowBack} from "react-icons/io";
import {FaListUl} from "react-icons/fa6";
import {HiViewGrid} from "react-icons/hi";
import {TbCalendarMonthFilled} from "react-icons/tb";
import SideBar from "../components/homePage/SideBar";
import Header from "../components/homePage/Header";
import useStore from "../store/store";
import {IoIosAdd} from "react-icons/io";


import CustomButton from "../components/common/CustomButton";
import moment from "moment";
import DayCalendar from "../components/homePage/DayCalendar";


const HomePage = () => {
    const {setField, selectedFrequency, selectedFromDate, selectedToDate} = useStore(state => state.appointments);

    useEffect(() => {
        const today = moment();

        if (selectedFrequency === 'daily') {
            setField("selectedFromDate", today)
            setField("selectedToDate", today)
        } else if (selectedFrequency === 'weekly') {
            setField("selectedFromDate", today.clone().startOf('week'))
            setField("selectedToDate", today.clone().endOf('week'))
        } else if (selectedFrequency === 'monthly') {
            setField("selectedFromDate", today.clone().startOf('month'))
            setField("selectedToDate", today.clone().endOf('month'))
        }
    }, [selectedFrequency, setField]);

    const handleForwardDateChange = () => {
        if (selectedFrequency === 'daily') {
            setField("selectedFromDate", selectedFromDate.clone().add(1, 'days'));
            setField("selectedToDate", selectedToDate.clone().add(1, 'days'));
        } else if (selectedFrequency === 'weekly') {
            setField("selectedFromDate", selectedFromDate.clone().add(1, 'weeks'));
            setField("selectedToDate", selectedToDate.clone().add(1, 'weeks'));
        } else if (selectedFrequency === 'monthly') {
            setField("selectedFromDate", selectedFromDate.clone().add(1, 'months'));
            setField("selectedToDate", selectedToDate.clone().add(1, 'months'));
        }
    };

    const handleBackwardDateChange = () => {
        if (selectedFrequency === 'daily') {
            setField("selectedFromDate", selectedFromDate.clone().subtract(1, 'days'));
            setField("selectedToDate", selectedToDate.clone().subtract(1, 'days'));
        } else if (selectedFrequency === 'weekly') {
            setField("selectedFromDate", selectedFromDate.clone().subtract(1, 'weeks'));
            setField("selectedToDate", selectedToDate.clone().subtract(1, 'weeks'));
        } else if (selectedFrequency === 'monthly') {
            setField("selectedFromDate", selectedFromDate.clone().subtract(1, 'months'));
            setField("selectedToDate", selectedToDate.clone().subtract(1, 'months'));
        }
    };

    return (
        <div className={styles.container}>
            <SideBar/>
            <div className={styles.content}>
                <Header/>
                <div>
                    <div className={styles.header}>
                        <div className={styles.viewSelector}>
                            <button onClick={() => setField("selectedFrequency", "daily")}
                                    className={[styles.viewButton, selectedFrequency === "daily" && styles.selected].filter(Boolean).join(" ")}>
                                <FaListUl size={15}/>
                                <p>Day</p>
                            </button>
                            <button onClick={() => setField("selectedFrequency", "weekly")}
                                    className={[styles.viewButton, selectedFrequency === "weekly" && styles.selected].filter(Boolean).join(" ")}>
                                <HiViewGrid size={18}/>
                                <p>Week</p>
                            </button>
                            <button onClick={() => setField("selectedFrequency", "monthly")}
                                    className={[styles.viewButton, selectedFrequency === "monthly" && styles.selected].filter(Boolean).join(" ")}>
                                <TbCalendarMonthFilled size={19}/>
                                <p>Month</p>
                            </button>
                        </div>
                        <div className={styles.dateSelectorDiv}>
                            <button className={styles.dateSelectorButton} onClick={handleBackwardDateChange}>
                                <IoIosArrowBack size={19}/>
                            </button>
                            <p className={styles.dateText}>
                                {selectedFrequency === "daily" ? selectedFromDate.format("DD MMM YYYY") : selectedFrequency === "weekly" ? selectedFromDate.format("DD MMM YYYY") + " - " + selectedToDate.format("DD MMM YYYY") : selectedFromDate.format("MMMM YYYY")}
                            </p>
                            <button className={styles.dateSelectorButton} onClick={handleForwardDateChange}>
                                <IoIosArrowForward size={19}/>
                            </button>
                        </div>
                        <button className={styles.createAppointmentButton} onClick={() => {
                        }}>
                            <IoIosAdd color={"white"} size={25}/>
                            <p style={{color: "white"}}>Create Appointment</p>
                        </button>
                    </div>
                    <DayCalendar/>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
