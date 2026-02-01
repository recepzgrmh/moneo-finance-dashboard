import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Globe, Coins, User } from 'lucide-react';

const OnboardingProfile = ({ onBack, onComplete, initialCurrency }) => {
    const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [language, setLanguage] = useState(i18n.language || 'tr');
    const [currency, setCurrency] = useState(initialCurrency || 'TRY');

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(true);
            setTimeout(() => setError(false), 500); // Shake animasyonu için reset
            return;
        }

        onComplete({
            name: name,
            currency,
            language
        });
    };

    const currencies = [
        { code: 'TRY', symbol: '₺' },
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: '€' },
        { code: 'GBP', symbol: '£' }
    ];

    return (
        <div className="setup-container fade-in">
            <div className="setup-header">
                <h2 className="setup-title">Profil Oluştur</h2>
                <p className="setup-subtitle">
                    Deneyimini kişiselleştirelim.
                </p>
            </div>

            <form className="form-section" onSubmit={handleSubmit}>
                {/* İsim Girişi */}
                <div className="input-group">
                    <label className="input-label">
                        <User size={14} />
                        <span>İsim</span>
                    </label>
                    <input
                        type="text"
                        className={`glass-input ${error ? 'error' : ''}`}
                        placeholder="Örn: Ali"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Dil Seçimi */}
                <div className="input-group">
                    <label className="input-label">
                        <Globe size={14} />
                        <span>Dil</span>
                    </label>
                    <div className="selector-grid lang-grid">
                        <button
                            type="button"
                            className={`selector-btn ${language === 'tr' ? 'selected' : ''}`}
                            onClick={() => handleLanguageChange('tr')}
                        >
                            <span>🇹🇷 Türkçe</span>
                        </button>
                        <button
                            type="button"
                            className={`selector-btn ${language === 'en' ? 'selected' : ''}`}
                            onClick={() => handleLanguageChange('en')}
                        >
                            <span>🇬🇧 English</span>
                        </button>
                    </div>
                </div>

                {/* Para Birimi */}
                <div className="input-group">
                    <label className="input-label">
                        <Coins size={14} />
                        <span>Para Birimi</span>
                    </label>
                    <div className="selector-grid currency-grid">
                        {currencies.map(curr => (
                            <button
                                key={curr.code}
                                type="button"
                                className={`selector-btn ${currency === curr.code ? 'selected' : ''}`}
                                onClick={() => setCurrency(curr.code)}
                                style={{ flexDirection: 'column', gap: '2px' }}
                            >
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{curr.symbol}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{curr.code}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="actions-section">
                    <button type="submit" className="primary-btn">
                        <span>Tamamla</span>
                        <Check size={18} />
                    </button>

                    <button type="button" className="secondary-btn" onClick={onBack}>
                        <ArrowLeft size={14} style={{ marginRight: '5px' }} /> Geri Dön
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OnboardingProfile;