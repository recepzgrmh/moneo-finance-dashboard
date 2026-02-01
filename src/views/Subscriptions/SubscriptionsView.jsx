import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus, Calendar, AlertCircle, TrendingUp, Check, Save, Trash2, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatCard from '../../components/common/StatCard';
import './SubscriptionsView.css';

const SubscriptionsView = ({ userProfile, onUpdateProfile, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const {
        profile,
        saved,
        handleSave,
        addRecurring,
        removeRecurring,
        updateRecurring
    } = useProfile(userProfile, onUpdateProfile);

    // Destructure default if needed, though prop is robust
    const currencyCode = currency || 'TRY';

    // Calculate totals
    const totalMonthly = useMemo(() => {
        return (profile.recurringPayments || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [profile.recurringPayments]);

    const activeSubscriptions = (profile.recurringPayments || []).length;

    // Find next upcoming payment (simple logic based on day of month)
    const nextPayment = useMemo(() => {
        if (!profile.recurringPayments?.length) return null;
        const today = new Date().getDate();
        // Sort by day. If day < today, it's next month.
        const sorted = [...profile.recurringPayments].sort((a, b) => {
            const dayA = a.day < today ? a.day + 30 : a.day;
            const dayB = b.day < today ? b.day + 30 : b.day;
            return dayA - dayB;
        });
        return sorted[0];
    }, [profile.recurringPayments]);

    const saveAction = (
        <button className="btn-glass btn-primary-glow" onClick={handleSave}>
            {saved ? <><Check size={18} /> {t('common.saved')}</> : <><Save size={18} /> {t('common.save')}</>}
        </button>
    );

    const addAction = (
        <button className="btn-glass" onClick={addRecurring}>
            <Plus size={18} /> {t('subscriptions.addNew')}
        </button>
    );

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('subscriptions.title')}
                subtitle={t('subscriptions.subtitle')}
                icon={CreditCard}
                actions={saveAction}
            />

            {/* Top Stats Row */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <StatCard
                    title={t('subscriptions.totalMonthlyExpense')}
                    value={formatCurrency(totalMonthly, false, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currencyCode)}
                    icon={TrendingUp}
                    trend="Düzenli"
                    trendUp={false} // Red color usually for expenses, but let's keep neutral or check styles
                    color="var(--accent-color)"
                />
                <StatCard
                    title={t('subscriptions.activeSubscriptions')}
                    value={activeSubscriptions}
                    icon={Zap}
                    trend="Servis"
                    color="var(--primary-color)"
                />
                <StatCard
                    title={t('subscriptions.nextPayment')}
                    value={nextPayment ? `${nextPayment.day}. ${t('common.day')}` : '-'}
                    subValue={nextPayment ? nextPayment.name : t('subscriptions.none')}
                    icon={Calendar}
                    trend={nextPayment ? formatCurrency(Number(nextPayment.amount || 0), false, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currencyCode) : ''}
                    color="var(--warning)"
                />
            </div>

            {/* Subscriptions List */}
            <SectionCard title={t('subscriptions.mySubscriptions')} actions={addAction}>
                {(!profile.recurringPayments || profile.recurringPayments.length === 0) ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Zap size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{t('subscriptions.emptyState')}</p>
                        <p style={{ fontSize: '0.9rem' }}>{t('subscriptions.emptyStateDetail')}</p>
                    </div>
                ) : (
                    <div className="subscriptions-grid">
                        {profile.recurringPayments.map((sub) => (
                            <div key={sub.id} className="subscription-card animate-slideIn">
                                <div className="sub-header">
                                    <div className="sub-icon">
                                        {sub.name ? sub.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="sub-actions">
                                        <button onClick={() => removeRecurring(sub.id)} className="btn-icon danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="sub-body">
                                    <input
                                        type="text"
                                        className="sub-name-input"
                                        value={sub.name}
                                        onChange={(e) => updateRecurring(sub.id, 'name', e.target.value)}
                                        placeholder={t('subscriptions.serviceNamePlaceholder')}
                                    />
                                    <div className="sub-amount-wrapper">
                                        <input
                                            type="number"
                                            className="sub-amount-input"
                                            value={sub.amount || ''}
                                            onChange={(e) => updateRecurring(sub.id, 'amount', e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="currency">{currencyCode}</span>
                                    </div>
                                </div>

                                <div className="sub-footer">
                                    <div className="sub-field">
                                        <label>{t('subscriptions.paymentDay')}</label>
                                        <input
                                            type="number"
                                            min="1" max="31"
                                            value={sub.day}
                                            onChange={(e) => updateRecurring(sub.id, 'day', e.target.value)}
                                        />
                                    </div>
                                    <div className="sub-field">
                                        <label>{t('subscriptions.category')}</label>
                                        <select
                                            value={sub.category}
                                            onChange={(e) => updateRecurring(sub.id, 'category', e.target.value)}
                                        >
                                            <option value="Abonelik">{t('subscriptions.catSubscription')}</option>
                                            <option value="Ev">{t('subscriptions.catRent')}</option>
                                            <option value="Fatura">{t('subscriptions.catBill')}</option>
                                            <option value="Finans">{t('subscriptions.catFinance')}</option>
                                            <option value="Diğer">{t('subscriptions.catOther')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>


        </div>
    );
};

SubscriptionsView.propTypes = {
    userProfile: PropTypes.object.isRequired,
    onUpdateProfile: PropTypes.func.isRequired
};

export default SubscriptionsView;
