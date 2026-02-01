import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

const TransactionItem = ({ icon, title, description, amount, type, privacyMode = false, date }) => {
    const isNegative = type === 'expense' || (type === 'auto' && amount < 0);
    const displayAmount = Math.abs(amount);

    return (
        <div className="transaction-item">
            <div className="t-icon">
                {icon || (isNegative ? '💸' : '💰')}
            </div>
            <div className="t-details">
                <span className="t-cat">{title}</span>
                {description && <div className="t-desc">{description}</div>}
                {date && <div className="t-desc" style={{ fontSize: '0.7rem' }}>{date}</div>}
            </div>
            <div className={`t-amount ${isNegative ? 'amount-neg' : 'amount-pos'}`} style={{ color: isNegative ? 'var(--danger)' : 'var(--success)' }}>
                {isNegative ? '-' : '+'}{formatCurrency(displayAmount, privacyMode)}
            </div>
        </div>
    );
};

TransactionItem.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['income', 'expense', 'auto']),
    privacyMode: PropTypes.bool,
    date: PropTypes.string
};

export default TransactionItem;
