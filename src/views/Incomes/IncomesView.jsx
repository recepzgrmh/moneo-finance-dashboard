import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Calendar, User } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useIncomes } from '../../hooks/useIncomes';
import PageHeader from '../../components/common/PageHeader';
import MonthSelector from '../../components/common/MonthSelector';
import StatCard from '../../components/common/StatCard';
import SectionCard from '../../components/common/SectionCard';
import TransactionItem from '../../components/common/TransactionItem';
import './IncomesView.css';

const IncomesView = ({ incomes, privacyMode = false, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    const MONTHS_TR = t('common.months', { returnObjects: true });

    const {
        selectedMonth,
        filteredIncomes,
        groupedIncomes,
        sortedDates,
        totalIncome,
        goToPrevMonth,
        goToNextMonth
    } = useIncomes(incomes);

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('incomes.title')}
                subtitle={t('incomes.subtitle')}
                icon={TrendingUp}
            />

            {/* Month Selector */}
            <div className="month-selector-mb">
                <MonthSelector
                    selectedMonth={selectedMonth}
                    onPrev={goToPrevMonth}
                    onNext={goToNextMonth}
                    monthNames={MONTHS_TR}
                />
            </div>

            {/* Summary Card */}
            <div className="stats-grid summary-stats-mb">
                <StatCard
                    label={t('incomes.monthlyTotal')}
                    value={totalIncome}
                    type="success"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('incomes.transactionCount')}
                    value={filteredIncomes.length}
                    type="neutral"
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('incomes.averageIncome')}
                    value={filteredIncomes.length > 0 ? totalIncome / filteredIncomes.length : 0}
                    type="neutral"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
            </div>

            {/* Income List */}
            <SectionCard title={<span>💰 {MONTHS_TR[selectedMonth.month]} {t('dashboard.incomesSuffix')}</span>}>
                {sortedDates.length === 0 ? (
                    <div className="empty-incomes">
                        {t('incomes.noIncomes')}
                    </div>
                ) : (
                    sortedDates.map(date => {
                        const items = groupedIncomes[date];
                        const dayTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                        const isToday = date === new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                        return (
                            <div key={date} className="day-group">
                                <div className="day-header">
                                    <span className="day-date">
                                        <Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                        {isToday ? t('common.today') : date}
                                    </span>
                                    <span className="day-total" style={{ color: 'var(--success)' }}>+{formatCurrency(dayTotal, privacyMode, currentLocale, currency)}</span>
                                </div>
                                <div>
                                    {items.map((item, idx) => (
                                        <TransactionItem
                                            key={idx}
                                            icon={<div className="t-icon t-icon-wrapper"><User size={16} color="var(--success)" /></div>}
                                            title={item.sender || t('incomes.defaultSender')}
                                            description={item.desc}
                                            amount={item.amount}
                                            type="income"
                                            privacyMode={privacyMode}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </SectionCard>
        </div>
    );
};

IncomesView.propTypes = {
    incomes: PropTypes.array.isRequired,
    privacyMode: PropTypes.bool
};

export default IncomesView;
