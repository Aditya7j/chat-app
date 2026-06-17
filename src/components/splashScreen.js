import React, { useState, useEffect } from 'react';
import '../styles/splashScreen.css';

const StartSplashScreen = ({ onFinishedLoading }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const loadTimer = setTimeout(() => {
            setIsFadingOut(true);

            const removeTimer = setTimeout(() => {
                if (onFinishedLoading) {
                    onFinishedLoading();
                }
            }, 500);

            return () => clearTimeout(removeTimer);
        }, 2500);

        return () => clearTimeout(loadTimer);
    }, [onFinishedLoading]);

    return (
        <div className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="splash-body">
                <div className="brand-logo-wrapper">
                    <svg viewBox="0 0 24 24" width="65" height="65" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.119 2 11.2c0 2.414 1.011 4.603 2.665 6.222L3.5 21l3.94-1.21A9.926 9.926 0 0012 20.4c5.523 0 10-4.119 10-9.2S17.523 2 12 2zm0 16.4c-1.477 0-2.871-.358-4.102-1l-.294-.153-2.333.717.585-1.9-.176-.277C4.78 14.61 4.2 12.973 4.2 11.2c0-4.08 3.499-7.4 7.8-7.4s7.8 3.32 7.8 7.4-3.499 7.4-7.8 7.4z" />
                    </svg>
                </div>
                <h1 className="brand-title">ChitChat</h1>
            </div>

            <div className="indicator-wrapper">
                <div className="track-bar">
                    <div className="animated-progress-line"></div>
                </div>
            </div>

            <div className="splash-footer-meta">
                <span className="meta-prefix">from</span>
                <span className="meta-company">ChitChat</span>
            </div>
        </div>
    );
};

export default StartSplashScreen;