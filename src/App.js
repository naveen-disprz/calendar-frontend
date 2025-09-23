import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import useStore from './store/store';
import './App.css';
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import {Bounce, ToastContainer} from "react-toastify";
import styles from "react-day-picker/style.css";

// Protected Route component
const ProtectedRoute = ({children}) => {
    if (!(localStorage.getItem("token"))) {
        return <Navigate to="/auth#login" replace/>;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path={"/auth"} element={<AuthPage/>}/>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage/>
                        </ProtectedRoute>}
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    className={"toastText"}
                    style={{"fontSize": "12px", zIndex: 999999}}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                />
            </div>
        </Router>
    );
}

export default App;
