// src/components/homePage/Header.js
import React, {useState} from 'react';
import styles from './Header.module.sass';
import {MdDarkMode} from "react-icons/md";
import {MdLightMode} from "react-icons/md";
import {useAuth} from "../../hooks/useAuth";
import {HiOutlineLogout} from "react-icons/hi";


const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {user, logout} = useAuth();

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        // Implement logic to apply dark mode styles
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prevOpen) => !prevOpen);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className={styles.header}>
            <h2 className={styles.projectName}>Calendar</h2>
            <div className={styles.actions}>
                <button onClick={toggleDarkMode} className={styles.toggleButton}>
                    {isDarkMode ? <MdLightMode size={22}/> : <MdDarkMode size={22}/>}
                </button>
                <div className={styles.profile}>
                    <button onClick={toggleDropdown} className={styles.profileButton}>
                        <div className={styles.profileCircle}>
                            {user?.firstName.charAt(0).toUpperCase()}
                        </div>
                        <p className={styles.username}>{user?.firstName.charAt(0).toUpperCase() + user?.firstName.substring(1)}</p>
                    </button>
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                <HiOutlineLogout size={20} color={"red"}/> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;