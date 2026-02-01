import React from 'react';
import { themes } from '../../data/themes'; // Tema verisinin yolu
import { Check, ArrowRight, Palette } from 'lucide-react';

const OnboardingDesign = ({ currentTheme, onSelectTheme, onNext }) => {
    // Aktif tema ismini bulmak için
    const activeThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

    return (
        <div className="setup-container fade-in">
            <div className="setup-header">
                <h2 className="setup-title">Görünüm Seç</h2>
                <p className="setup-subtitle">
                    Uygulamanın atmosferini belirle. Bunu daha sonra değiştirebilirsin.
                </p>
            </div>

            <div className="gallery-layout">
                {/* 1. Büyük Önizleme Alanı (Compact & Fixed Height) */}
                <div className="gallery-main-stage">
                    {themes.map(t => (
                        <div
                            key={t.id}
                            className={`gallery-preview-layer ${currentTheme === t.id ? 'active' : ''}`}
                            style={{
                                backgroundImage: t.image ? `url(${t.image})` : 'none',
                                backgroundColor: t.color || '#111' // Resim yüklenmezse renk
                            }}
                        >
                            <div className="gallery-preview-info">
                                <div className="gallery-preview-icon">
                                    {t.icon || <Palette size={16} />}
                                </div>
                                <span className="gallery-preview-name">{t.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Küçük Resim Listesi (Strip) */}
                <div className="gallery-strip">
                    {themes.map(t => {
                        const isActive = currentTheme === t.id;
                        return (
                            <div
                                key={t.id}
                                className={`gallery-thumb ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectTheme(t.id)}
                                title={t.name}
                            >
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="gallery-thumb-img"
                                />
                                {isActive && (
                                    <div className="thumb-active-indicator">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="actions-section">
                <button className="primary-btn" onClick={onNext}>
                    <span>{activeThemeObj.name} ile Devam Et</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingDesign;