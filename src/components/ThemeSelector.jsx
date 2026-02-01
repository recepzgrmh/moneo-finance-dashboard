import React from 'react';
import { Check, X, Palette } from 'lucide-react';
import PropTypes from 'prop-types';

import { themes } from '../data/themes';

const ThemeSelector = ({ currentTheme, onSelect, onClose, customColor, onUpdateCustomColor }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            animation: 'fadeIn 0.2s'
        }}>
            <div className="section-card" style={{
                width: '1000px',
                maxWidth: '95%',
                maxHeight: '90vh',
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-card-hover)',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 'bold' }}>
                        <Palette size={24} style={{ color: 'var(--primary)' }} />
                        Atmosfer Seçimi
                    </h2>
                    <button
                        className="btn-glass"
                        onClick={onClose}
                        style={{ padding: '0.6rem', borderRadius: '50%', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Grid Content */}
                <div style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.5rem',
                    background: 'var(--bg-body)'
                }}>
                    {themes.map(t => {
                        const isActive = currentTheme === t.id;
                        // Determine border color based on active state
                        const borderColor = isActive
                            ? (t.id === 'custom' ? (customColor || 'var(--primary)') : (t.borderColor || 'var(--primary)'))
                            : 'transparent';

                        return (
                            <div
                                key={t.id}
                                onClick={() => onSelect(t.id)}
                                className="theme-card-item"
                                style={{
                                    border: `2px solid ${borderColor}`,
                                    // Default border for non-active items to keep layout stable
                                    outline: !isActive ? '1px solid var(--border-color)' : 'none',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    background: t.color,
                                    color: t.textColor || 'white',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: '1rem',
                                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isActive ? `0 0 25px -5px ${t.id === 'custom' ? customColor : (t.borderColor || 'var(--primary)')}` : '0 4px 6px rgba(0,0,0,0.1)',
                                    zIndex: isActive ? 2 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.3)';
                                        e.currentTarget.style.zIndex = 10;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.zIndex = 1;
                                    }
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.15)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid rgba(255,255,255,0.2)`,
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    {t.icon}
                                </div>

                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 800, marginBottom: '0.4rem', fontSize: '1rem', letterSpacing: '0.5px' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.9, lineHeight: '1.3', fontWeight: 500 }}>{t.desc}</div>
                                </div>

                                {/* Custom Color Picker Logic */}
                                {t.id === 'custom' && isActive && (
                                    <div
                                        style={{ marginTop: '0.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => onUpdateCustomColor && onUpdateCustomColor(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '35px',
                                                border: '2px solid rgba(255,255,255,0.4)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: 'transparent',
                                                padding: '2px'
                                            }}
                                        />
                                    </div>
                                )}

                                {isActive && (
                                    <div style={{
                                        position: 'absolute', top: -10, right: -10,
                                        background: t.id === 'custom' ? customColor : (t.borderColor || 'var(--primary)'),
                                        color: t.id === 'light' || t.id === 'comic' || t.id === 'xerox' || t.id === 'receipt' ? 'black' : 'white',
                                        borderRadius: '50%', width: '28px', height: '28px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                        border: '2px solid white'
                                    }}>
                                        <Check size={16} strokeWidth={4} />
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