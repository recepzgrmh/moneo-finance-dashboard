import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Wallet, Target, Sparkles, User, Palette, Upload, Download, TrendingUp, TrendingDown, Eye, EyeOff, Trash2, CreditCard, Languages } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ currentView, onNavigate, onOpenTheme, onExportData, privacyMode, onTogglePrivacy, onClearData, userName, isMobileOpen = false, onCloseMobile }) => {
    const { t, i18n } = useTranslation();

    const navItems = [
        { id: 'overview', label: t('sidebar.overview'), icon: <LayoutDashboard size={20} /> },
        { id: 'subscriptions', label: t('sidebar.subscriptions'), icon: <CreditCard size={20} /> },
        { id: 'accounts', label: t('sidebar.accounts'), icon: <Wallet size={20} /> },
        { id: 'expenses', label: t('sidebar.expenses'), icon: <TrendingDown size={20} /> },
        { id: 'incomes', label: t('sidebar.incomes'), icon: <TrendingUp size={20} /> },
        { id: 'goals', label: t('sidebar.goals'), icon: <Target size={20} /> },
        { id: 'ai', label: t('sidebar.aiAssistant'), icon: <Sparkles size={20} /> },
        { id: 'profile', label: t('sidebar.profile'), icon: <User size={20} /> },
        { id: 'import', label: t('sidebar.import'), icon: <Upload size={20} /> },
    ];

    const handleClearData = () => {
        if (window.confirm(t('common.clearDataConfirmation'))) {
            if (onClearData) onClearData();
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    return (
        <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
            {/* Mobile Close Button */}
            <button
                className="sidebar-close-btn"
                onClick={onCloseMobile}
                aria-label="Close menu"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div>
                <div className="logo-area">
                    <img src={logo} alt="MONEO Logo" className="logo-image" />
                    <div className="logo-text">MONEO</div>
                </div>

                <ul className="nav-links">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            {item.icon}
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                <div
                    className="nav-item"
                    onClick={toggleLanguage}
                    style={{ color: 'var(--text-main)' }}
                    title="Switch Language"
                >
                    <Languages size={20} />
                    {i18n.language === 'tr' ? 'English' : 'Türkçe'}
                </div>
                <div
                    className="nav-item"
                    onClick={onTogglePrivacy}
                    style={{ color: privacyMode ? 'var(--warning)' : 'var(--text-muted)' }}
                    title={privacyMode ? t('sidebar.showAmounts') : t('sidebar.hideAmounts')}
                >
                    {privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    {privacyMode ? t('sidebar.privacyModeOn') : t('sidebar.privacyMode')}
                </div>
                <div className="nav-item" onClick={onOpenTheme}>
                    <Palette size={20} />
                    {t('sidebar.theme')}
                </div>
                <div className="nav-item" onClick={onExportData} style={{ color: 'var(--success)' }}>
                    <Download size={20} />
                    {t('sidebar.exportBackup')}
                </div>
                <div className="nav-item" onClick={handleClearData} style={{ color: 'var(--danger)' }}>
                    <Trash2 size={20} />
                    {t('sidebar.clearData')}
                </div>
            </div>

            <div className="user-profile" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--bg-card-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                    {userName?.charAt(0) || 'U'}
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: 600 }}>{userName || 'Kullanıcı'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('sidebar.premiumMember')}</div>
                </div>
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    currentView: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onOpenTheme: PropTypes.func,
    onExportData: PropTypes.func,
    privacyMode: PropTypes.bool,
    onTogglePrivacy: PropTypes.func,
    onClearData: PropTypes.func,
    userName: PropTypes.string,
    isMobileOpen: PropTypes.bool,
    onCloseMobile: PropTypes.func
};

export default Sidebar;
