import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield } from 'lucide-react';
import logo from '../../assets/logo.png';
import './WelcomeScreen.css';

import OnboardingDesign from './OnboardingDesign';
import OnboardingProfile from './OnboardingProfile';

const WelcomeScreen = ({ onGetStarted, onSkip, onUpdateTheme }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState('welcome'); // welcome, design, profile
    const [mounted, setMounted] = useState(false);

    // Veri Saklama
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [initialCurrency, setInitialCurrency] = useState('TRY');
    const [activeFeat, setActiveFeat] = useState(0);

    useEffect(() => {
        setMounted(true);
        // Tarayıcı diline göre para birimi tahmini
        try {
            const localeCurr = new Intl.NumberFormat(navigator.language).resolvedOptions().currency;
            if (localeCurr) setInitialCurrency(localeCurr);
        } catch (e) { console.warn(e); }
    }, []);

    // Özellik animasyonu döngüsü
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeat((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleThemeSelect = (themeId) => {
        setSelectedTheme(themeId);
        if (onUpdateTheme) onUpdateTheme(themeId); // Anlık önizleme için
    };

    const handleFinalComplete = (profileData) => {
        // Verileri ana uygulamaya gönder
        onGetStarted({
            currency: profileData.currency,
            theme: selectedTheme,
            userProfile: {
                userName: profileData.name,
                language: profileData.language
            }
        });
    };

    const features = [
        { title: t('welcome.features.track.title'), desc: t('welcome.features.track.desc') },
        { title: t('welcome.features.plan.title'), desc: t('welcome.features.plan.desc') },
        { title: t('welcome.features.secure.title'), desc: t('welcome.features.secure.desc') }
    ];

    const renderStep = () => {
        switch (step) {
            case 'design':
                return (
                    <OnboardingDesign
                        currentTheme={selectedTheme}
                        onSelectTheme={handleThemeSelect}
                        onNext={() => setStep('profile')}
                    />
                );
            case 'profile':
                return (
                    <OnboardingProfile
                        initialCurrency={initialCurrency}
                        onBack={() => setStep('design')}
                        onComplete={handleFinalComplete}
                    />
                );
            default: // 'welcome'
                return (
                    <div className="setup-container fade-in">
                        <div className="setup-header">
                            <h2 className="setup-title">{t('welcome.heroTitle')}</h2>
                            <p className="setup-subtitle">
                                {t('welcome.heroSubtitle')}
                            </p>
                        </div>
                        <div className="actions-section">
                            <button className="primary-btn" onClick={() => setStep('design')}>
                                <span>{t('welcome.startSetup')}</span>
                                <ArrowRight size={18} />
                            </button>
                            <button className="secondary-btn" onClick={onSkip}>
                                {t('welcome.skipSetup')}
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`welcome-wrapper ${mounted ? 'mounted' : ''}`}>
            <div className="bg-canvas">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="welcome-grid">
                {/* Sol Panel: Marka ve Özellikler */}
                <div className="left-panel">
                    <div className="brand-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="logo-badge">
                                <img src={logo} alt="Logo" className="welcome-logo-image" />
                            </div>
                            <h1 className="brand-title">
                                <span className="brand-title-gradient">MONEO</span>
                            </h1>
                        </div>
                        <p className="brand-tagline" dangerouslySetInnerHTML={{ __html: t('welcome.brandTagline') }}></p>
                    </div>

                    <div className="editorial-features">
                        {features.map((f, i) => (
                            <div key={i} className={`editorial-item ${activeFeat === i ? 'active' : ''}`}>
                                <div className="editorial-title">{f.title}</div>
                                <p className="editorial-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '0.8rem' }}>
                        <Shield size={14} />
                        <span>{t('welcome.localStorage')}</span>
                    </div>
                </div>

                <div className="grid-divider"></div>

                {/* Sağ Panel: Dinamik İçerik */}
                <div className="right-panel">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

WelcomeScreen.propTypes = {
    onGetStarted: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    onUpdateTheme: PropTypes.func
};

export default WelcomeScreen;