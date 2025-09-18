import React, {useState, useRef, useEffect} from "react";
import styles from "./CustomDropdown.module.sass";
import {IoIosArrowDown} from "react-icons/io";


const CustomDropdown = ({
                            options = [],
                            value = null,
                            onChange,
                            labelKey = "name",
                            colorKey = "color",
                            placeholder = "Select",
                            disabled,
                            label
                        }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onChange(option);
        setOpen(false);
    };

    // Close dropdown on outside click
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

    return (
        <div style={{display: "flex", flexDirection: "column", gap:"10px"}}>
            {label && <label htmlFor={"dropdown"} className={styles.label} style={{textAlign: "start"}}>{label}</label>}
            <div className={styles.customDropdown} ref={dropdownRef} id={"dropdown"}>
                <div

                    className={styles.dropdownSelected}
                    onClick={() => {
                        if(disabled) return;
                        setOpen((prev) => !prev)
                    }}
                >
                    {value ? (
                        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                            {colorKey && (
                                <div
                                    className={styles.colorCircle}
                                    style={{backgroundColor: value[colorKey]}}
                                />
                            )}
                            {value[labelKey]}
                        </div>
                    ) : (
                        <p className={styles.dropdownPlaceholder}>{placeholder}</p>
                    )}
                    <IoIosArrowDown color={"#6b7280"}/>
                </div>
                {open && (
                    <div className={styles.dropdownList}>
                        {options.map((option) => (
                            <div
                                key={option.id || option[labelKey]}
                                className={styles.dropdownItem}
                                onClick={() => handleSelect(option)}
                            >
                                {colorKey && (
                                    <span
                                        className={styles.colorCircle}
                                        style={{backgroundColor: option[colorKey]}}
                                    />
                                )}
                                {option[labelKey]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
