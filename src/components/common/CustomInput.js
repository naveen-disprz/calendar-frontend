import React, {useRef} from "react";
import moment from "moment";
import styles from "./CustomInput.module.sass";
import {IoCalendarOutline, IoTimeOutline} from "react-icons/io5";
import {IoIosArrowDown} from "react-icons/io";

const CustomInput = ({
                         id,
                         label,
                         type = "text", // text | textArea | date | time | datetime
                         value,
                         onChange,
                         placeholder,
                         disabled = false,
                         autoComplete,
                         error,
                         maxDate,
                         minDate,
                         dateFormat = "DD MMM YYYY", // Custom format for date display
                         timeFormat = "hh:mm A", // Custom format for time display
                         dateTimeFormat = "DD MMM YYYY, hh:mm A", // Custom format for datetime display
                         ...rest
                     }) => {

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    const formatDateForInput = (date) => {
        if (!date) return '';
        return moment(date).format('YYYY-MM-DD');
    };

    const formatTimeForInput = (date) => {
        if (!date) return '';
        return moment(date).format('HH:mm');
    };

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
                    <div className={styles.customDateWrapper}>
                        <div
                            className={`${styles.dateDisplay} ${error ? styles.inputError : ""} ${disabled ? styles.disabled : ""}`}
                            onClick={() => !disabled && dateInputRef.current?.showPicker()}
                        >
                            <span className={value ? styles.value : styles.placeholder}>
                                {value ? moment(value).format(dateFormat) : placeholder || "Select date"}
                            </span>
                            <IoCalendarOutline className={styles.icon} />
                        </div>
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={formatDateForInput(value)}
                            onChange={(e) => {
                                const newDate = e.target.value ? moment(e.target.value).toDate() : null;
                                onChange(newDate);
                            }}
                            disabled={disabled}
                            min={minDate ? formatDateForInput(minDate) : undefined}
                            max={maxDate ? formatDateForInput(maxDate) : undefined}
                            className={styles.hiddenInput}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                    </div>
                );

            case "time":
                return (
                    <div className={styles.customTimeWrapper}>
                        <div
                            className={`${styles.timeDisplay} ${error ? styles.inputError : ""} ${disabled ? styles.disabled : ""}`}
                            onClick={() => !disabled && timeInputRef.current?.showPicker()}
                        >
                            <span className={value ? styles.value : styles.placeholder}>
                                {value ? moment(value).format(timeFormat) : placeholder || "Select time"}
                            </span>
                            <IoTimeOutline className={styles.icon} />
                        </div>
                        <input
                            ref={timeInputRef}
                            type="time"
                            value={formatTimeForInput(value)}
                            onChange={(e) => {
                                if (e.target.value) {
                                    const [hours, minutes] = e.target.value.split(':');
                                    // Create a date object with today's date and the selected time
                                    const newTime = moment()
                                        .hour(parseInt(hours, 10))
                                        .minute(parseInt(minutes, 10))
                                        .second(0)
                                        .toDate();
                                    onChange(newTime);
                                } else {
                                    onChange(null);
                                }
                            }}
                            disabled={disabled}
                            className={styles.hiddenInput}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                    </div>
                );

            case "datetime":
                return (
                    <div className={styles.customDateTimeWrapper}>
                        <div
                            className={`${styles.dateTimeDisplay} ${error ? styles.inputError : ""} ${disabled ? styles.disabled : ""}`}
                        >
                            <div
                                className={styles.dateSection}
                                onClick={() => !disabled && dateInputRef.current?.showPicker()}
                            >
                                <span className={value ? styles.value : styles.placeholder}>
                                    {value ? moment(value).format("DD MMM YYYY") : "Select date"}
                                </span>
                                <IoCalendarOutline className={styles.icon} />
                            </div>
                            <div
                                className={`${styles.timeSection} ${!value ? styles.disabled : ''}`}
                                onClick={() => !disabled && value && timeInputRef.current?.showPicker()}
                            >
                                <span className={value ? styles.value : styles.placeholder}>
                                    {value ? moment(value).format("hh:mm A") : "Time"}
                                </span>
                                <IoIosArrowDown className={styles.icon} />
                            </div>
                        </div>

                        <input
                            ref={dateInputRef}
                            type="date"
                            value={formatDateForInput(value)}
                            onChange={(e) => {
                                if (e.target.value) {
                                    const newDate = moment(e.target.value);
                                    if (value) {
                                        // Preserve existing time
                                        newDate.hour(moment(value).hour());
                                        newDate.minute(moment(value).minute());
                                    } else {
                                        // Set default time to 12:00 PM
                                        newDate.hour(12).minute(0);
                                    }
                                    onChange(newDate.toDate());
                                } else {
                                    onChange(null);
                                }
                            }}
                            disabled={disabled}
                            min={minDate ? formatDateForInput(minDate) : undefined}
                            max={maxDate ? formatDateForInput(maxDate) : undefined}
                            className={styles.hiddenInput}
                            tabIndex={-1}
                            aria-hidden="true"
                        />

                        <input
                            ref={timeInputRef}
                            type="time"
                            value={formatTimeForInput(value)}
                            onChange={(e) => {
                                if (e.target.value && value) {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDateTime = moment(value)
                                        .hour(parseInt(hours, 10))
                                        .minute(parseInt(minutes, 10))
                                        .toDate();
                                    onChange(newDateTime);
                                }
                            }}
                            disabled={disabled || !value}
                            className={styles.hiddenInput}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
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
