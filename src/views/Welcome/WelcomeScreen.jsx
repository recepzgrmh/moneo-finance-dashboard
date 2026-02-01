import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Globe, Coins, Shield, TrendingUp, Sparkles } from 'lucide-react';
import logo from '../../assets/logo.png';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onGetStarted, onSkip }) => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('app_currency');
        if (saved) return saved;
        // Smart Default: Try to guess currency from locale
        try {
            const localeCurr = new Intl.NumberFormat(navigator.language).resolvedOptions().currency;
            if (localeCurr && ['TRY', 'USD', 'EUR', 'GBP'].includes(localeCurr)) {
                return localeCurr;
            }
        } catch (e) {
            console.warn('Currency detection failed', e);
        }
        return 'TRY';
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    const handleStart = () => {
        localStorage.setItem('app_lang_set', 'true');
        localStorage.setItem('app_currency', currency);
        onGetStarted(currency);
    };

    const currencies = [
        { code: 'TRY', symbol: '₺', name: 'Lira' },
        { code: 'USD', symbol: '$', name: 'Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'Pound' }
    ];


    const [activeFeat, setActiveFeat] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveFeat((prev) => (prev + 1) % 3);
        }, 2500); // 2.5s for better readability

        return () => clearInterval(interval);
    }, [isHovered]);

    const features = [
        {
            id: 'track',
            title: t('welcome.features.track.title'),
            desc: t('welcome.features.track.desc')
        },
        {
            id: 'analyze',
            title: t('welcome.features.analyze.title'),
            desc: t('welcome.features.analyze.desc')
        },
        {
            id: 'secure',
            title: t('welcome.features.secure.title'),
            desc: t('welcome.features.secure.desc')
        }
    ];

    return (
        <div className={`welcome-wrapper ${mounted ? 'mounted' : ''}`}>
            <div className="welcome-wrapper-noise"></div>
            {/* Animated Background */}
            <div className="bg-canvas" aria-hidden="true">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="welcome-grid">
                {/* Left Panel - Brand & Features */}
                <div className="left-panel">
                    <div className="brand-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div className="logo-badge">
                                <div className="logo-glow" aria-hidden="true"></div>
                                <img src={logo} alt="MONEO Logo" className="welcome-logo-image" />
                            </div>
                            <h1 className="brand-title">
                                <span className="brand-title-gradient">MONEO</span>
                                <span className="brand-title-fallback">MONEO</span>
                            </h1>
                        </div>

                        <div className="brand-content">
                            <p className="brand-tagline">
                                {t('welcome.description')}
                            </p>
                        </div>
                    </div>

                    {/* Editorial Feature Switcher */}
                    <div
                        className="editorial-features"
                        role="list"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                role="listitem"
                                className={`editorial-item ${activeFeat === idx ? 'active' : ''}`}
                                onMouseEnter={() => setActiveFeat(idx)}
                            >
                                <div className="editorial-line"></div>
                                <div className="editorial-content">
                                    <h3 className="editorial-title">{feature.title}</h3>
                                    <div className="editorial-desc-wrapper">
                                        <p className="editorial-desc">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="trust-badge" role="status">
                        <Shield size={14} aria-hidden="true" />
                        <span>{t('welcome.trust')}</span>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="grid-divider" aria-hidden="true"></div>

                {/* Right Panel - Setup Form */}
                <div className="right-panel">
                    <div className="setup-container">
                        <div className="setup-header">
                            <h2 className="setup-title">
                                {t('welcome.setup.title')}
                            </h2>
                            <p className="setup-subtitle">
                                {t('welcome.setup.subtitle')}
                            </p>
                        </div>

                        <form className="form-section" onSubmit={(e) => { e.preventDefault(); handleStart(); }}>
                            {/* Language Selector */}
                            <div className="input-group">
                                <label className="input-label" id="language-label">
                                    <Globe size={16} strokeWidth={2} aria-hidden="true" />
                                    <span>{t('common.language')}</span>
                                </label>
                                <div className="selector-grid lang-grid" role="radiogroup" aria-labelledby="language-label">
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={language === 'tr'}
                                        className={`selector-btn ${language === 'tr' ? 'selected' : ''}`}
                                        onClick={() => handleLanguageChange('tr')}
                                    >
                                        <span className="selector-flag" aria-hidden="true">🇹🇷</span>
                                        <span className="selector-label">Türkçe</span>
                                        {language === 'tr' && (
                                            <div className="selected-indicator" aria-hidden="true">
                                                <div className="indicator-dot"></div>
                                            </div>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={language === 'en'}
                                        className={`selector-btn ${language === 'en' ? 'selected' : ''}`}
                                        onClick={() => handleLanguageChange('en')}
                                    >
                                        <span className="selector-flag" aria-hidden="true">🇬🇧</span>
                                        <span className="selector-label">English</span>
                                        {language === 'en' && (
                                            <div className="selected-indicator" aria-hidden="true">
                                                <div className="indicator-dot"></div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Currency Selector */}
                            <div className="input-group">
                                <label className="input-label" id="currency-label">
                                    <Coins size={16} strokeWidth={2} aria-hidden="true" />
                                    <span>{t('common.currency')}</span>
                                </label>
                                <div className="selector-grid currency-grid" role="radiogroup" aria-labelledby="currency-label">
                                    {currencies.map(curr => (
                                        <button
                                            key={curr.code}
                                            type="button"
                                            role="radio"
                                            aria-checked={currency === curr.code}
                                            className={`selector-btn currency-btn ${currency === curr.code ? 'selected' : ''}`}
                                            onClick={() => setCurrency(curr.code)}
                                        >
                                            <span className="currency-symbol" aria-hidden="true">{curr.symbol}</span>
                                            <div className="currency-info">
                                                <span className="currency-code">{curr.code}</span>
                                                <span className="currency-name">{curr.name}</span>
                                            </div>
                                            {currency === curr.code && (
                                                <div className="selected-indicator" aria-hidden="true">
                                                    <div className="indicator-dot"></div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="actions-section">
                                <button type="submit" className="primary-btn">
                                    <span>{t('welcome.ctaPrimary')}</span>
                                    <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
                                </button>

                                <button type="button" className="secondary-btn" onClick={onSkip}>
                                    {t('welcome.ctaSecondary')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

WelcomeScreen.propTypes = {
    onGetStarted: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired
};

export default WelcomeScreen;