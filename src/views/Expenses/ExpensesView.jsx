import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';
import PageHeader from '../../components/common/PageHeader';
import MonthSelector from '../../components/common/MonthSelector';
import StatCard from '../../components/common/StatCard';
import SectionCard from '../../components/common/SectionCard';
import TransactionItem from '../../components/common/TransactionItem';
import './ExpensesView.css';

const ExpensesView = ({ expenses, privacyMode = false, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    // Retrieve months as an array
    const MONTHS_TR = t('common.months', { returnObjects: true });

    const {
        selectedMonth,
        filteredExpenses,
        groupedExpenses,
        sortedDates,
        totalExpense,
        categoryMap,
        goToPrevMonth,
        goToNextMonth
    } = useExpenses(expenses);

    const getCategoryIcon = (category) => {
        if (category.includes('Yemek')) return '🍔';
        if (category.includes('Ulaşım')) return '🚌';
        if (category.includes('Market')) return '🛒';
        if (category.includes('Kahve') || category.includes('İçecek')) return '☕';
        if (category.includes('Eğlence')) return '🎮';
        if (category.includes('Kişisel')) return '💇';
        if (category.includes('Finans') || category.includes('Kredi')) return '💳';
        return '💸';
    };

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('expenses.title')}
                subtitle={t('expenses.subtitle')}
                icon={TrendingDown}
                iconColor="var(--danger)"
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

            {/* Summary Cards */}
            <div className="stats-grid summary-stats-mb">
                <StatCard
                    label={t('expenses.monthlyTotal')}
                    value={-totalExpense}
                    type="danger"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('expenses.transactionCount')}
                    value={filteredExpenses.length}
                    type="neutral"
                    locale={currentLocale}
                    currency={currency}
                />
                <StatCard
                    label={t('expenses.dailyAverage')}
                    value={sortedDates.length > 0 ? totalExpense / sortedDates.length : 0}
                    type="neutral"
                    privacyMode={privacyMode}
                    locale={currentLocale}
                    currency={currency}
                />
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryMap).length > 0 && (
                <SectionCard title={t('expenses.categoryBreakdown')} className="category-breakdown-mb">
                    <div className="category-grid">
                        {Object.entries(categoryMap)
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, amount]) => (
                                <div key={cat} className="category-card">
                                    <div className="category-icon">{getCategoryIcon(cat)}</div>
                                    <div className="category-name">{cat}</div>
                                    <div className="category-amount">-{formatCurrency(amount, privacyMode, currentLocale, currency)}</div>
                                </div>
                            ))}
                    </div>
                </SectionCard>
            )}

            {/* Expense List */}
            <SectionCard title={<span>💸 {MONTHS_TR[selectedMonth.month]} {t('dashboard.expensesSuffix')}</span>}>
                {sortedDates.length === 0 ? (
                    <div className="empty-expenses">
                        {t('expenses.noExpenses')}
                    </div>
                ) : (
                    sortedDates.map(date => {
                        const items = groupedExpenses[date];
                        const dayTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                        const isToday = date === new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                        return (
                            <div key={date} className="day-group">
                                <div className="day-header">
                                    <span className="day-date">
                                        <Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                        {isToday ? t('common.today') : date}
                                    </span>
                                    <span className="day-total" style={{ color: 'var(--danger)' }}>-{formatCurrency(dayTotal, privacyMode, currentLocale, currency)}</span>
                                </div>
                                <div>
                                    {items.map((item, idx) => (
                                        <TransactionItem
                                            key={idx}
                                            icon={getCategoryIcon(item.category)}
                                            title={item.category}
                                            description={item.desc}
                                            amount={item.amount}
                                            type="expense"
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

ExpensesView.propTypes = {
    expenses: PropTypes.array.isRequired,
    privacyMode: PropTypes.bool
};

export default ExpensesView;
