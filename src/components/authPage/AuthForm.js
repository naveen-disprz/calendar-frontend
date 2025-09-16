// src/components/AuthForm.js
import React, { useState } from 'react';
import CustomInput from '../common/CustomInput';
import CustomButton from '../common/CustomButton';
import styles from './AuthForm.module.sass';
import validateEmail from "../../utils/validateEmail"; // Create a corresponding Sass file for styling

const AuthForm = ({
                      isLogin,
                      loading,
                      error,
                      onSubmit,
                      onToggle,
                      setError,
                      setLoading,
                  }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validate = () => {
        if (!email || !password || (!isLogin && !firstName && !lastName)) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!isLogin) {
            if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return false;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        onSubmit({ email, password, firstName, lastName, confirmPassword });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.mobileFormHeader}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div aria-hidden>📅</div>
                    <h2 style={{ color: '#4f46e5', margin: 0 }}>Calendar</h2>
                </div>
                <p style={{ color: '#6b7280' }}>Plan your day effortlessly.</p>
            </div>
            <h2 className={styles.title}>{isLogin ? 'Login' : 'Create account'}</h2>
            <p className={styles.subtitle}>
                {isLogin ? 'Welcome back' : 'Get started with your calendar'}
            </p>
            {!isLogin && (
                <div className={styles.field}>
                    <CustomInput
                        id="firstName"
                        label="First name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        disabled={loading}
                    />
                    <CustomInput
                        id="lastName"
                        label="Last name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Your last name"
                        disabled={loading}
                    />
                </div>
            )}
            <div className={styles.field}>
                <CustomInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={loading}
                />
            </div>
            <div className={styles.field}>
                <CustomInput
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    disabled={loading}
                />
            </div>
            {!isLogin && (
                <div className={styles.field}>
                    <CustomInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>
            )}
            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}
            <div className={styles.actions}>
                <CustomButton type="submit" disabled={loading} variant="primary">
                    {loading
                        ? isLogin
                            ? 'Logging in...'
                            : 'Creating account...'
                        : isLogin
                            ? 'Log in'
                            : 'Sign up'}
                </CustomButton>
                <CustomButton type="button" onClick={onToggle} disabled={loading} variant="secondary">
                    {isLogin ? 'Create an account' : 'Have an account? Log in'}
                </CustomButton>
            </div>
        </form>
    );
};

export default AuthForm;
