import React, {useEffect, useState} from 'react';
import styles from './HomePage.module.sass';
import {IoIosArrowForward, IoMdRefresh} from "react-icons/io";
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
import DayCalendar from "../components/homePage/Calendar";
import CreateAppointmentModal from "../components/homePage/CreateAppointmentModal";
import appointmentAPI from "../api/appointmentAPI";
import attendeeAPI from "../api/attendeeAPI";
import {DayPicker} from "react-day-picker";


const HomePage = () => {
    const {
        setField,
        selectedFrequency,
        selectedFromDate,
        selectedToDate,
        loadAppointmentsFromDB
    } = useStore(state => state.appointments);
    const [isCreateAppointmentModalVisible, setIsCreateAppointmentModalVisible] = useState(false)
    const [isDropdownCalendarOpen, setIsDropdownCalendarOpen] = useState(false);

    useEffect(() => {
        appointmentAPI.getAppointmentTypes().then((response) => {
            setField("appointmentTypes", response.data)
        })
        attendeeAPI.getAllAttendees().then((response) => {
            setField("allAttendees", response.data)
        })
    }, [setField]);


    useEffect(() => {
        loadAppointmentsFromDB();
    }, [loadAppointmentsFromDB, selectedFromDate]);

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

    const resetDate = () => {
        if (selectedFrequency === 'daily') {
            setField("selectedFromDate", moment());
            setField("selectedToDate", moment());
        } else if (selectedFrequency === 'weekly') {
            setField("selectedFromDate", moment().startOf("week"));
            setField("selectedToDate", moment().endOf("week"));
        } else if (selectedFrequency === 'monthly') {
            setField("selectedFromDate", moment().startOf("month"));
            setField("selectedToDate", moment().endOf("month"));
        }
    }

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
            {isCreateAppointmentModalVisible ? (
                <CreateAppointmentModal
                    open={isCreateAppointmentModalVisible}
                    onClose={() => setIsCreateAppointmentModalVisible(false)}
                    onSave={() => {
                        setIsCreateAppointmentModalVisible(false);
                    }}
                />) : null}
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
                        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                            <div className={styles.dateSelectorDiv}>
                                <button className={styles.dateSelectorButton} onClick={handleBackwardDateChange}>
                                    <IoIosArrowBack size={19}/>
                                </button>
                                <div className={styles.dateWrapper}>
                                    <p className={styles.dateText} onClick={() => {
                                        setIsDropdownCalendarOpen(prev => !prev);
                                    }}>
                                        {isDropdownCalendarOpen && (
                                            <div className={styles.dropdownCalendar}>
                                                <DayPicker
                                                    mode="single"
                                                    selected={selectedFromDate}
                                                    onSelect={(day) => {
                                                        if (day === null) return;
                                                        setField("selectedFromDate", moment(day).clone());
                                                        setField("selectedToDate", moment(day).clone());
                                                        setIsDropdownCalendarOpen(false);
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {selectedFrequency === "daily" ? selectedFromDate.format("DD MMM YYYY") : selectedFrequency === "weekly" ? selectedFromDate.format("DD MMM YYYY") + " - " + selectedToDate.format("DD MMM YYYY") : selectedFromDate.format("MMMM YYYY")}
                                    </p>
                                </div>
                                <button className={styles.dateSelectorButton} onClick={handleForwardDateChange}>
                                    <IoIosArrowForward size={19}/>
                                </button>
                            </div>
                            <IoMdRefresh size={20} style={{cursor: "pointer"}} onClick={resetDate}/>

                        </div>
                        <button className={styles.createAppointmentButton} onClick={() => {
                            setIsCreateAppointmentModalVisible(true);
                        }}>
                            <IoIosAdd color={"white"} size={25}/>
                            <p style={{color: "white"}}>Create Appointment</p>
                        </button>
                    </div>
                    <div style={{flex: 1, overflowY: "auto"}}>
                        <DayCalendar
                            variant={selectedFrequency === "daily" ? "day" : selectedFrequency === "weekly" ? "week" : "month"}/>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default HomePage;
