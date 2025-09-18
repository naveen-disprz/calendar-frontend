import React, {useEffect, useRef, useState} from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment";
import "react-day-picker/dist/style.css";
import styles from "./CustomInput.module.sass";
import {IoIosArrowDown} from "react-icons/io";

const CustomInput = ({
                         id,
                         label,
                         type = "text", // text | textArea | date | datetime
                         value,
                         onChange,
                         placeholder,
                         disabled = false,
                         autoComplete,
                         error,
                         maxDate,
                         minDate,
                         ...rest
                     }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderInput = () => {
        switch (type) {
            case "textArea":
                return (
                    <textarea
                        id={id}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`${styles.textarea} ${error ? styles.inputError : ""}`}
                        {...rest}
                    />
                );

            case "date":
                return (
                    <div className={styles.dateWrapper} ref={dropdownRef}>
                        <div className={styles.input}
                             style={{display: "flex", alignItems: "center", padding: 0, paddingRight: "10px"}}>
                            <div
                                style={{
                                    border: "none",
                                    outline: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                                className={`${styles.input} ${error ? styles.inputError : ""}`}
                                onClick={() => {
                                    if(disabled) return;
                                    setOpen((prev) => !prev)
                                }}
                            >
                                <p>{value ? moment(value).format("DD MMM YYYY") :
                                    <p style={{color: "gray"}}>{placeholder}</p>}</p>
                                <IoIosArrowDown/>

                            </div>
                        </div>
                        {open && (
                            <div className={styles.dropdownCalendar}>
                                <DayPicker
                                    mode="single"
                                    selected={value}
                                    onSelect={(day) => {
                                        onChange(day ? moment(day).toDate() : null);
                                        setOpen(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case "datetime":
                return (
                    <div className={styles.dateWrapper} ref={dropdownRef}>
                        <div className={styles.input}
                             style={{display: "flex", alignItems: "center", padding: 0, paddingRight: "10px"}}>
                            <div
                                className={`${styles.input} ${error ? styles.inputError : ""}`}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                                onClick={() => {
                                    if(disabled) return;
                                    setOpen((prev) => !prev)
                                }}
                            >
                                <p>{value ? moment(value).format("DD MMM YYYY hh:mm A") :
                                    <p style={{color: "gray"}}>{placeholder}</p>}</p>
                                <IoIosArrowDown/>
                            </div>

                        </div>
                        {open && (
                            <div className={styles.dropdownCalendar}>
                                <DayPicker
                                    mode="single"
                                    selected={value}
                                    onSelect={(day) => {
                                        if (!day) {
                                            onChange(null);
                                            return;
                                        }
                                        // Preserve time if value already exists
                                        const current = moment(value || new Date());
                                        const updated = moment(day)
                                            .hour(current.hour())
                                            .minute(current.minute())
                                            .toDate();
                                        onChange(updated);
                                        // setOpen(false);
                                    }}
                                />
                                <input
                                    type="time"
                                    value={value ? moment(value).format("HH:mm") : ""}
                                    onChange={(e) => {
                                        if (!value) return;
                                        const [h, m] = e.target.value.split(":");
                                        const updated = moment(value)
                                            .hour(parseInt(h, 10))
                                            .minute(parseInt(m, 10))
                                            .toDate();
                                        onChange(updated);
                                    }}
                                    className={styles.input}
                                />
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`${styles.input} ${error ? styles.inputError : ""}`}
                        {...rest}
                    />
                );
        }
    };

    return (
        <div className={styles.field}>
            {label && (
                <label htmlFor={id} style={{textAlign: "start"}} className={styles.label}>
                    {label}
                </label>
            )}
            {renderInput()}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default CustomInput;
