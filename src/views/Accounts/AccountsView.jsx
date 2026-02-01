import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Wallet, Edit2, Check, X, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useAccounts } from '../../hooks/useAccounts';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import './AccountsView.css';

const AccountsView = (props) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    // Destructure props safely or pass them directly to the hook
    const {
        accounts,
        cash,
        privacyMode,
        currency = 'TRY'
    } = props;

    const {
        editingCash,
        tempCash,
        editingAccountIdx,
        tempAccountBalance,

        totalIncome,
        totalExpense,
        netBalance,
        expensesByBank,

        setEditingCash,
        setTempCash,
        setEditingAccountIdx,
        setTempAccountBalance,

        handleCashSave,
        handleAccountSave
    } = useAccounts(props);

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('accounts.title')}
                subtitle={t('accounts.subtitle')}
                icon={Wallet}
            />

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <StatCard
                    label={t('accounts.totalIncome')}
                    value={totalIncome}
                    icon={TrendingUp}
                    type="success"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('accounts.totalExpense')}
                    value={totalExpense}
                    icon={TrendingDown}
                    type="danger"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('accounts.netBalance')}
                    value={netBalance}
                    type="balance"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
            </div>

            <div className="wallet-grid">
                {/* Cash Card */}
                <div className="wallet-card">
                    <div className="wallet-header">
                        <div className="bank-logo bank-cash">{t('accounts.cashStatus')}</div>
                        {!editingCash ? (
                            <button
                                className="btn-glass edit-btn"
                                onClick={() => { setEditingCash(true); setTempCash(cash); }}
                            >
                                <Edit2 size={14} />
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button className="btn-glass save-btn" onClick={handleCashSave}>
                                    <Check size={14} />
                                </button>
                                <button className="btn-glass cancel-btn" onClick={() => setEditingCash(false)}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {editingCash ? (
                        <input
                            type="number"
                            className="api-input balance-input"
                            value={tempCash}
                            onChange={(e) => setTempCash(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <div className="debt-amount" style={{ color: 'var(--success)' }}>{formatCurrency(cash, privacyMode, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}</div>
                    )}

                    <div className="limit-info">{t('accounts.wallet')}</div>
                    <div className="w-progress-bg">
                        <div className="w-progress-fill progress-success" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Bank Accounts / Credit Cards */}
                {accounts.map((acc, idx) => {
                    const hasDebt = acc.debt !== undefined && acc.debt > 0;
                    const hasBalance = acc.balance !== undefined;
                    const usedPercent = hasDebt && acc.totalLimit ? (acc.debt / acc.totalLimit) * 100 : 0;
                    const remaining = acc.totalLimit ? acc.totalLimit - (acc.debt || 0) : 0;

                    // Calculate from expenses if no balance set
                    const bankExpenses = expensesByBank[acc.bank] || 0;
                    const displayBalance = hasBalance ? acc.balance : (acc.totalLimit ? remaining : -bankExpenses);

                    let progressClass = 'progress-warning';
                    if (usedPercent > 80) progressClass = 'progress-danger';
                    if (usedPercent < 30) progressClass = 'progress-success';

                    const isEditing = editingAccountIdx === idx;

                    return (
                        <div key={idx} className="wallet-card">
                            <div className="wallet-header">
                                <div>
                                    <div className={`bank-logo ${acc.colorClass || ''}`} style={{ color: acc.color || 'var(--primary)' }}>
                                        🏦 {acc.bank}
                                    </div>
                                    <div className="bank-type">{acc.type || t('accounts.defaultAccountType')}</div>
                                </div>
                                {!isEditing ? (
                                    <button
                                        className="btn-glass edit-btn"
                                        onClick={() => { setEditingAccountIdx(idx); setTempAccountBalance(displayBalance); }}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="btn-glass save-btn" onClick={() => handleAccountSave(idx)}>
                                            <Check size={14} />
                                        </button>
                                        <button className="btn-glass cancel-btn" onClick={() => setEditingAccountIdx(null)}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <input
                                    type="number"
                                    className="api-input balance-input"
                                    value={tempAccountBalance}
                                    onChange={(e) => setTempAccountBalance(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <div className="debt-amount" style={{ color: displayBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                    {displayBalance >= 0 ? '+' : ''}{formatCurrency(displayBalance, privacyMode, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}
                                </div>
                            )}

                            {hasDebt && acc.totalLimit && (
                                <>
                                    <div className="limit-info">
                                        <span>{t('accounts.remainingLimit')}: {formatCurrency(remaining, privacyMode, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}</span>
                                        <span>%{usedPercent.toFixed(0)}</span>
                                    </div>
                                    <div className="w-progress-bg">
                                        <div className={`w-progress-fill ${progressClass}`} style={{ width: `${usedPercent}%` }}></div>
                                    </div>
                                </>
                            )}

                            {!hasDebt && !acc.totalLimit && (
                                <div className="limit-info limit-info-center">
                                    <span>{t('accounts.expense')}: {formatCurrency(bankExpenses, privacyMode, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

AccountsView.propTypes = {
    accounts: PropTypes.array.isRequired,
    cash: PropTypes.number.isRequired,
    expenses: PropTypes.array,
    incomes: PropTypes.array,
    onUpdateCash: PropTypes.func,
    onUpdateAccounts: PropTypes.func,
    privacyMode: PropTypes.bool
};

export default AccountsView;
