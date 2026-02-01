import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

const StatCard = ({ label, value, icon: Icon, trend, type = 'neutral', privacyMode = false, onClick, locale = 'en-US', currency = 'TRY' }) => {
    // Determine color based on type
    let valueColor = 'var(--text-main)';
    if (type === 'income' || type === 'success') valueColor = 'var(--success)';
    if (type === 'expense' || type === 'danger') valueColor = 'var(--danger)';
    if (type === 'balance') valueColor = value >= 0 ? 'var(--success)' : 'var(--danger)';

    return (
        <div className="stat-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
            <div className="stat-label">
                {Icon && <Icon size={16} style={{ marginRight: '5px', color: valueColor }} />}
                {label}
            </div>
            <div className="stat-value" style={{ color: valueColor }}>
                {typeof value === 'number' ? formatCurrency(value, privacyMode, locale, currency) : value}
            </div>
            {trend && (
                <div className="stat-trend" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {trend}
                </div>
            )}
        </div>
    );
};

StatCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    icon: PropTypes.elementType,
    trend: PropTypes.node,
    type: PropTypes.oneOf(['income', 'expense', 'balance', 'neutral', 'success', 'danger']),
    privacyMode: PropTypes.bool,
    onClick: PropTypes.func,
    locale: PropTypes.string,
    currency: PropTypes.string
};

export default StatCard;
