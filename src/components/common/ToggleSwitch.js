import React from "react";
import styles from "./ToggleSwitch.module.sass";

const ToggleSwitch = ({ checked = false, onChange, disabled }) => {
    return (
        <div
            className={`${styles.toggleSwitch} ${checked ? styles.enabled : ""}`}
            onClick={() => {
                if (disabled) return;
                onChange(!checked)
            }}
        >
            <div className={styles.toggleKnob} />
        </div>
    );
};

export default ToggleSwitch;
