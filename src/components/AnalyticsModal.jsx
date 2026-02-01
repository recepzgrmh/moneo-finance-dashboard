import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, BarChart2, PieChart, Activity, TrendingUp, Settings, Layout, Zap, ShieldCheck, AlertTriangle, Clock, Bell, Info } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsModal = ({ isOpen, onClose, weeklyData, categoryBudgetData, privacyMode, visibleWidgets = [], onToggleWidget, minWidgets = 0 }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'appearance'

    if (!isOpen) return null;

    const isAtLimit = visibleWidgets.length <= minWidgets;

    const dashboardWidgets = [
        { id: 'stat-income', label: t('dashboard.income'), icon: <TrendingUp size={18} /> },
        { id: 'stat-expense', label: t('dashboard.expenses'), icon: <TrendingUp size={18} /> },
        { id: 'stat-balance', label: t('dashboard.net'), icon: <TrendingUp size={18} /> },
        { id: 'spending-flow', label: t('dashboard.spendingFlow'), icon: <Activity size={18} /> },
        { id: 'trend-6m', label: t('dashboard.trend6m'), icon: <TrendingUp size={18} /> },
        { id: 'category-trends', label: t('dashboard.categoryTrends'), icon: <Layout size={18} /> },
        { id: 'category-dist', label: t('dashboard.categoryDistribution'), icon: <PieChart size={18} /> },
        { id: 'insights', label: t('dashboard.smartInsights'), icon: <Zap size={18} /> },
        { id: 'salary-limit', label: t('dashboard.salaryLimit'), icon: <ShieldCheck size={18} /> },
        { id: 'goal-reward', label: t('dashboard.goalReward'), icon: <Clock size={18} /> },
        { id: 'expenses-list', label: t('dashboard.expensesList'), icon: <Bell size={18} /> },
        { id: 'incomes-list', label: t('dashboard.incomesList'), icon: <Info size={18} /> },
        { id: 'daily-heatmap', label: t('dashboard.dailyHeatmap'), icon: <Activity size={18} /> },
        { id: 'year-comparison', label: t('dashboard.yearComparison'), icon: <TrendingUp size={18} /> },
        { id: 'expense-forecast', label: t('dashboard.expenseForecast'), icon: <TrendingUp size={18} /> },
        { id: 'budget-depletion', label: t('dashboard.budgetDepletion'), icon: <Clock size={18} /> },
        { id: 'goal-prediction', label: t('dashboard.goalPrediction'), icon: <Activity size={18} /> },
        { id: 'income-projection', label: t('dashboard.incomeProjection'), icon: <Activity size={18} /> },
    ];

    const weeklyChartData = {
        labels: weeklyData.map(w => w.label),
        datasets: [{
            label: 'Haftalık Harcama',
            data: weeklyData.map(w => w.amount),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 8
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content analytics-modal" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="icon-box-primary">
                            {activeTab === 'analytics' ? <Activity size={20} /> : <Settings size={20} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {activeTab === 'analytics' ? t('dashboard.detailedAnalysis') : t('dashboard.appearanceOptions')}
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {activeTab === 'analytics' ? t('dashboard.analysisDesc') : t('dashboard.manageWidgetsDesc')}
                            </p>
                        </div>
                    </div>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <button
                            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'analytics' ? 600 : 400,
                                padding: '0.5rem 1rem',
                                borderBottom: activeTab === 'analytics' ? '2px solid var(--primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <BarChart2 size={16} style={{ marginRight: '6px' }} /> {t('dashboard.analysis')}
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appearance')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeTab === 'appearance' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'appearance' ? 600 : 400,
                                padding: '0.5rem 1rem',
                                borderBottom: activeTab === 'appearance' ? '2px solid var(--primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Layout size={16} style={{ marginRight: '6px' }} /> {t('dashboard.appearanceOptions')}
                        </button>
                    </div>

                    {activeTab === 'analytics' ? (
                        <div className="analytics-grid">
                            {/* Weekly Spending */}
                            <div className="analytics-card">
                                <h3 className="card-subtitle">
                                    <TrendingUp size={16} /> {t('dashboard.weeklyTrend')}
                                </h3>
                                <div style={{ height: '220px', marginTop: '1rem' }}>
                                    <Bar data={weeklyChartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Category vs Budget */}
                            <div className="analytics-card">
                                <h3 className="card-subtitle">
                                    <PieChart size={16} /> {t('dashboard.categorySpending')}
                                </h3>
                                <div className="category-budget-list">
                                    {categoryBudgetData.slice(0, 5).map((item, idx) => {
                                        const perc = Math.min((item.spent / item.budget) * 100, 100);
                                        return (
                                            <div key={idx} className="budget-item">
                                                <div className="budget-info">
                                                    <span>{item.category}</span>
                                                    <span className="budget-amounts">
                                                        {formatCurrency(item.spent, privacyMode)} / {formatCurrency(item.budget, privacyMode)}
                                                    </span>
                                                </div>
                                                <div className="budget-progress-bg">
                                                    <div
                                                        className="budget-progress-bar"
                                                        style={{
                                                            width: `${perc}%`,
                                                            background: perc > 90 ? 'var(--danger)' : 'var(--primary)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="widget-management-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                {dashboardWidgets.map(widget => {
                                    const isVisible = visibleWidgets.includes(widget.id);
                                    const disabled = isVisible && isAtLimit;
                                    return (
                                        <div key={widget.id} className="widget-toggle-item" style={{ margin: 0, opacity: disabled ? 0.6 : 1 }}>
                                            <div className="widget-info-side">
                                                <div className="widget-icon-box">
                                                    {widget.icon}
                                                </div>
                                                <div className="widget-label">{widget.label}</div>
                                            </div>
                                            <label className={`switch ${disabled ? 'disabled' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={isVisible}
                                                    onChange={() => onToggleWidget(widget.id)}
                                                    disabled={disabled}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            {isAtLimit && (
                                <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertTriangle size={14} /> En az {minWidgets} kart görünür olmalıdır.
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="analytics-summary-footer">
                            <div className="summary-stat">
                                <span className="label">{t('dashboard.weeklyAverage')}</span>
                                <span className="value">{formatCurrency(weeklyData.reduce((acc, w) => acc + w.amount, 0) / (weeklyData.length || 1), privacyMode)}</span>
                            </div>
                            <div className="summary-stat">
                                <span className="label">{t('dashboard.topSpendingWeek')}</span>
                                <span className="value">
                                    {weeklyData.length > 0 ? weeklyData.sort((a, b) => b.amount - a.amount)[0].label : '-'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

AnalyticsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    weeklyData: PropTypes.array.isRequired,
    categoryBudgetData: PropTypes.array.isRequired,
    privacyMode: PropTypes.bool,
    visibleWidgets: PropTypes.array,
    onToggleWidget: PropTypes.func
};

export default AnalyticsModal;
