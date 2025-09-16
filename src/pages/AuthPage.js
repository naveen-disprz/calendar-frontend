// src/pages/AuthPage.js
import React, { useEffect, useState } from 'react';
import styles from './AuthPage.module.sass';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthForm from '../components/authPage/AuthForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(window.location.hash === '#login');
    const { user, token, loading, error, login, signup, setError, setLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleToggle = () => {
        setIsLogin((prev) => !prev);
        setError('');
        setLoading(false);
    };

    const handleSubmit = async ({ email, password, firstName, lastName, confirmPassword }) => {
        try {
            let response;
            if (isLogin) {
                response = await login({ email, password });
            } else {
                response = await signup({ email, password, firstName, lastName, confirmPassword });
            }
            if (response.status === 200) {
                toast.success('Successfully logged in!');
                navigate('/');
            }
        } catch (err) {
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftSection}>
                <div className={styles.leftContent}>
                    <div className={styles.logoRow}>
                        <div className={styles.logoMark} aria-hidden>
                            📅
                        </div>
                        <h2 className={styles.brand}>Calendar</h2>
                    </div>
                    <p className={styles.tagline}>Plan your day effortlessly.</p>
                    <ul className={styles.featureList}>
                        <li>
              <span className={styles.featureIcon} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                      d="M7.5 13.5L3.5 9.5L2 11L7.5 16.5L18 6L16.5 4.5L7.5 13.5Z"
                      fill="currentColor"
                  />
                </svg>
              </span>
                            Smart scheduling that adapts to your time
                        </li>
                        <li>
              <span className={styles.featureIcon} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                      d="M7.5 13.5L3.5 9.5L2 11L7.5 16.5L18 6L16.5 4.5L7.5 13.5Z"
                      fill="currentColor"
                  />
                </svg>
              </span>
                            Share events and collaborate instantly
                        </li>
                        <li>
              <span className={styles.featureIcon} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                      d="M7.5 13.5L3.5 9.5L2 11L7.5 16.5L18 6L16.5 4.5L7.5 13.5Z"
                      fill="currentColor"
                  />
                </svg>
              </span>
                            Works across all your devices
                        </li>
                    </ul>
                    <div className={styles.mockCard} aria-hidden>
                        <div className={styles.mockHeader}>
                            <div className={styles.pill} />
                            <div className={styles.pill} />
                            <div className={styles.pill} />
                            <span className={styles.month}>June</span>
                        </div>
                        <div className={styles.mockGrid}>
                            {Array.from({ length: 28 }, (_, i) => (
                                <span
                                    key={i}
                                    className={`${styles.day} ${i % 7 === 0 || i % 7 === 6 ? styles.busy : ''}`}
                                >
                  {i + 1}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.rightSection}>
                <AuthForm
                    isLogin={isLogin}
                    loading={loading}
                    error={error}
                    onSubmit={handleSubmit}
                    onToggle={handleToggle}
                    setError={setError}
                    setLoading={setLoading}
                />
            </div>
        </div>
    );
};

export default AuthPage;
