import React from 'react';
import { Check, X, Palette, Moon, Sun, Zap, Sunset, Trees, Droplets, Crown, Sliders } from 'lucide-react';
import PropTypes from 'prop-types';

const themes = [
    {
        id: 'default',
        name: 'Cosmic Glass',
        icon: <Moon size={24} />,
        color: 'linear-gradient(135deg, #1e1e24, #2a2a35)',
        desc: 'Mevcut karanlık ve canlı cam tasarımı.'
    },
    {
        id: 'light',
        name: 'Profesyonel',
        icon: <Sun size={24} />,
        color: '#f8fafc',
        textColor: '#0f172a',
        desc: 'Ferah, aydınlık ve kurumsal görünüm.'
    },
    {
        id: 'neon',
        name: 'Neon Punk',
        icon: <Zap size={24} />,
        color: '#000000',
        borderColor: '#00ff9d',
        desc: 'Yüksek kontrastlı, keskin ve fütüristik.'
    },
    {
        id: 'sunset',
        name: 'Sunset Bliss',
        icon: <Sunset size={24} />,
        color: 'linear-gradient(135deg, #1a0b16, #4c1d3d)',
        borderColor: '#f43f5e',
        desc: 'Sıcak tonlar, enerjik gradyanlar ve yumuşak geçişler.'
    },
    {
        id: 'forest',
        name: 'Deep Forest',
        icon: <Trees size={24} />,
        color: 'linear-gradient(135deg, #051a10, #0f3f25)',
        borderColor: '#10b981',
        desc: 'Doğal yeşil tonlar, sakinleştirici ve huzurlu.'
    },
    {
        id: 'ocean',
        name: 'Okyanus',
        icon: <Droplets size={24} />,
        color: 'linear-gradient(135deg, #0f172a, #0ea5e9)',
        borderColor: '#0ea5e9',
        desc: 'Derin mavi tonlar ve ferahlatıcı görünüm.'
    },
    {
        id: 'royal',
        name: 'Asil Altın',
        icon: <Crown size={24} />,
        color: 'linear-gradient(135deg, #000000, #333333)',
        borderColor: '#fbbf24',
        desc: 'Siyah ve altın uyumu ile prestijli bir hava.'
    },
    {
        id: 'custom',
        name: 'Kişisel',
        icon: <Sliders size={24} />,
        color: '#27272a',
        borderColor: 'var(--user-color)',
        desc: 'Kendi renginizi seçin ve arayüzü kişiselleştirin.'
    }
];

const ThemeSelector = ({ currentTheme, onSelect, onClose, customColor, onUpdateCustomColor }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
            animation: 'fadeIn 0.2s'
        }}>
            <div className="section-card" style={{ width: '800px', maxWidth: '95%', maxHeight: '90vh', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Palette size={20} /> Görünüm Seç
                    </h2>
                    <button className="btn-glass" onClick={onClose} style={{ padding: '0.5rem' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '2rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {themes.map(t => {
                        const isActive = currentTheme === t.id;
                        return (
                            <div
                                key={t.id}
                                onClick={() => onSelect(t.id)}
                                style={{
                                    border: isActive ? `2px solid ${t.id === 'custom' ? (customColor || 'var(--primary)') : 'var(--primary)'}` : '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    background: t.color,
                                    color: t.textColor || 'white',
                                    transition: 'transform 0.2s',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: '1rem'
                                }}
                                className="theme-card"
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: 60, height: 60, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    border: t.borderColor ? `1px solid ${t.borderColor}` : 'none'
                                }}>
                                    {t.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: '1.4' }}>{t.desc}</div>
                                </div>

                                {t.id === 'custom' && isActive && (
                                    <div
                                        style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Renk Seçin</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => onUpdateCustomColor && onUpdateCustomColor(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '40px',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: 'transparent'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isActive && (
                                    <div style={{ position: 'absolute', top: 10, right: 10, color: t.id === 'custom' ? (customColor || 'var(--primary)') : 'var(--primary)' }}>
                                        <Check size={20} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

ThemeSelector.propTypes = {
    currentTheme: PropTypes.string,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    customColor: PropTypes.string,
    onUpdateCustomColor: PropTypes.func
};

export default ThemeSelector;
