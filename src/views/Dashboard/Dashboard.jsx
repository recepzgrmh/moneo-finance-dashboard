import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Doughnut, Bar, Line, Chart } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingUp, Zap, ShieldCheck, Info, Bell, Clock, PieChart, CheckCircle2, Activity, Layout, RotateCcw, X, Upload, Calendar, Target, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';
import AnalyticsModal from '../../components/AnalyticsModal';
import { useDashboard } from '../../hooks/useDashboard';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import SectionCard from '../../components/common/SectionCard';
import TransactionItem from '../../components/common/TransactionItem';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, MatrixController, MatrixElement);

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ totals, dailyLimit, nextSalary, goalProgress, insights, expensesGroups, sortedDates, chartData, onOpenAI, theme = 'default', incomes = [], expenses = [], privacyMode = false, userProfile, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    const MONTHS_TR = t('common.months', { returnObjects: true });

    const {
        selectedMonth,
        showAnalyticsModal,
        isEditMode,
        layoutVersion,
        visibleWidgets,

        setSelectedMonth,
        setShowAnalyticsModal,
        setIsEditMode,
        removeWidget,
        resetLayout,
        onLayoutChange,
        goToPrevMonth,
        goToNextMonth,
        toggleWidget,

        monthlyIncomeTotal,
        monthlyExpenseTotal,
        monthlyBalance,
        calculatedLayouts,
        monthlySortedDates,
        monthlyExpensesGroups,
        monthlySortedIncomeDates,
        monthlyIncomesGroups,
        weeklyData,
        categoryBudgetData,
        MIN_WIDGETS,

        doughnutData,
        barData,
        trendData,
        categoryTrendData,
        weeklyBudgetData,
        cumulativeBalanceData,
        chartOptions,
        textColor,

        // Advanced Analytics
        dailyHeatmapData,
        yearComparisonData,
        expenseForecast,
        budgetDepletion,
        goalPrediction,
        incomeProjection,
        palette,
    } = useDashboard({ expenses, incomes, theme, userProfile });

    // Custom Header Actions
    const headerActions = (
        <>
            <button className={`btn-glass ${isEditMode ? 'btn-primary-glow' : ''}`} onClick={() => setIsEditMode(!isEditMode)}>
                <Layout size={18} /> {isEditMode ? t('dashboard.finishEditing') : t('dashboard.editLayout')}
            </button>
            {isEditMode && (
                <button className="btn-glass" onClick={resetLayout}>
                    <RotateCcw size={18} /> {t('common.reset')}
                </button>
            )}
            <button className="btn-glass" onClick={() => setShowAnalyticsModal(true)}>
                <Activity size={18} /> {t('dashboard.manageCards')}
            </button>
            <button className="btn-glass btn-primary-glow" onClick={onOpenAI}>
                <Zap size={18} /> {t('sidebar.aiAssistant')}
            </button>
        </>
    );

    // Custom Month Selector for Subtitle
    const monthSelector = (
        <div className="month-selector">
            <button className="btn-glass month-nav-btn" onClick={goToPrevMonth}>
                <ChevronLeft size={16} />
            </button>
            <span className="month-label">
                {MONTHS_TR[selectedMonth.month]} {selectedMonth.year}
            </span>
            <button className="btn-glass month-nav-btn" onClick={goToNextMonth}>
                <ChevronRight size={16} />
            </button>
        </div>
    );

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('dashboard.title')}
                subtitle={monthSelector}
                actions={headerActions}
            />

            <ResponsiveGridLayout
                key={layoutVersion}
                className="layout"
                layouts={calculatedLayouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                onLayoutChange={onLayoutChange}
                margin={[16, 16]}
                containerPadding={[16, 16]}
                compactType="vertical"
                preventCollision={false}
                resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
            >
                {/* Individual Stat Cards */}
                {visibleWidgets.includes('stat-income') && (
                    <div key="stat-income" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('stat-income')}><X size={14} /></button>
                            </>
                        )}
                        <div className="stats-grid-container">
                            <StatCard label={t('dashboard.monthlyIncome')} value={monthlyIncomeTotal} type="income" privacyMode={privacyMode} locale={currentLocale} currency={currency} />
                        </div>
                    </div>
                )}

                {visibleWidgets.includes('stat-expense') && (
                    <div key="stat-expense" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('stat-expense')}><X size={14} /></button>
                            </>
                        )}
                        <div className="stats-grid-container">
                            <StatCard label={t('dashboard.monthlyExpense')} value={monthlyExpenseTotal} type="expense" privacyMode={privacyMode} locale={currentLocale} currency={currency} />
                        </div>
                    </div>
                )}

                {visibleWidgets.includes('stat-balance') && (
                    <div key="stat-balance" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('stat-balance')}><X size={14} /></button>
                            </>
                        )}
                        <div className="stats-grid-container">
                            <StatCard label={t('dashboard.monthlyNet')} value={monthlyBalance} type="balance" privacyMode={privacyMode} locale={currentLocale} currency={currency} />
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {visibleWidgets.includes('spending-flow') && (
                    <div key="spending-flow" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('spending-flow')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.monthlySpendingFlow')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Bar data={barData} options={chartOptions} />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {visibleWidgets.includes('trend-6m') && (
                    <div key="trend-6m" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('trend-6m')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.incomeVsExpenseTrend')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Line data={trendData} options={{
                                    ...chartOptions,
                                    plugins: { legend: { display: true, labels: { color: textColor, boxWidth: 10 } } }
                                }} />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {visibleWidgets.includes('category-trends') && (
                    <div key="category-trends" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('category-trends')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.categoryTrends')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Line data={categoryTrendData} options={{
                                    ...chartOptions,
                                    plugins: { legend: { display: true, position: 'bottom', labels: { color: textColor, boxWidth: 8, font: { size: 10 } } } }
                                }} />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {visibleWidgets.includes('category-dist') && (
                    <div key="category-dist" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('category-dist')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.categoryDistribution')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Doughnut
                                    data={doughnutData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { color: textColor, boxWidth: 10 }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Weekly Budget Performance */}
                {visibleWidgets.includes('weekly-budget') && (
                    <div key="weekly-budget" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('weekly-budget')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.weeklyBudgetPerformance')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Bar
                                    data={weeklyBudgetData}
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                                labels: { color: textColor, boxWidth: 10 }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Cumulative Balance Trend */}
                {visibleWidgets.includes('cumulative-balance') && (
                    <div key="cumulative-balance" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('cumulative-balance')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.cumulativeBalanceTrend')} className="chart-section-card">
                            <div className="chart-wrapper">
                                <Line
                                    data={cumulativeBalanceData}
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            legend: { display: false }
                                        },
                                        scales: {
                                            ...chartOptions.scales,
                                            y: {
                                                ...chartOptions.scales.y,
                                                beginAtZero: false
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Insights Section */}
                {visibleWidgets.includes('insights') && (
                    <div key="insights" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('insights')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.smartInsights')} className="chart-section-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div id="insights-container" className="insights-list">
                                {insights.map((insight, idx) => {
                                    // Translate title and text
                                    const title = t(insight.titleKey, insight.params);
                                    // For text involving HTML or dynamic values, we need to handle it carefully.
                                    // The updated financeEngine returns keys. 
                                    const text = t(insight.textKey, insight.params);

                                    const maskedText = privacyMode
                                        ? text.replace(/[\d.,]+\s*TL/g, '****** TL').replace(/[\d.,]+\s*₺/g, '****** ₺')
                                        : text;

                                    const getIcon = (emoji) => {
                                        if (emoji === '🔥') return <Zap size={20} color="#ff4d4d" />;
                                        if (emoji === '🛡️') return <ShieldCheck size={20} color="#10b981" />;
                                        if (emoji === '⚠️') return <AlertTriangle size={20} color="#ff4d4d" />;
                                        if (emoji === '📊') return <PieChart size={20} color="#f59e0b" />;
                                        if (emoji === '⏳') return <Clock size={20} color="#6366f1" />;
                                        if (emoji === '🔔') return <Bell size={20} color="#ef4444" />;
                                        return <Info size={20} />;
                                    };

                                    return (
                                        <div key={idx} className="simple-insight-item">
                                            <div className="insight-icon-simple">
                                                {getIcon(insight.icon)}
                                            </div>
                                            <div className="insight-content">
                                                <span className="insight-label-simple">{title}</span>
                                                <div className="insight-text-simple" dangerouslySetInnerHTML={{ __html: maskedText }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {insights.length === 0 && (
                                    <div className="empty-insights">
                                        <div className="empty-insights-content">
                                            <CheckCircle2 size={32} style={{ marginBottom: '1rem' }} />
                                            <br />{t('dashboard.allGood')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Salary & Daily Limit Section */}
                {visibleWidgets.includes('salary-limit') && (
                    <div key="salary-limit" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('salary-limit')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard title={t('dashboard.salaryLimitAnalysis')} className="chart-section-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="salary-limit-container">
                                <div className="salary-info-row">
                                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.salaryDate')}</span>
                                    <span className="salary-date-val">
                                        {new Date(nextSalary.targetDate).toLocaleDateString(currentLocale, { day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                                <div className="salary-info-row">
                                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.dailySpendingLimit')}</span>
                                    <span className="salary-limit-val">{formatCurrency(dailyLimit, privacyMode, currentLocale, currency)}</span>
                                </div>
                                <div className="salary-progress-wrapper">
                                    <div className="progress-container" style={{ height: '10px', margin: '0.5rem 0' }}>
                                        <div className="progress-bar" style={{ width: `${goalProgress.progress}%` }}></div>
                                    </div>
                                    <div className="salary-progress-text">
                                        {t('dashboard.salaryCycleProgress', { progress: Math.round(goalProgress.progress) })}
                                    </div>
                                </div>
                                <div className="salary-balance-row">
                                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.remainingBalance')}</span>
                                    <span style={{ fontWeight: 600, color: totals.netBalance < 0 ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(totals.netBalance, privacyMode, currentLocale, currency)}</span>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Next Reward / Goal Card */}
                {visibleWidgets.includes('goal-reward') && (
                    <div key="goal-reward" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('goal-reward')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={`🎯 ${goalProgress.titleText}`}
                            className="goal-reward-container"
                        >
                            <div className="goal-reward-content">
                                <div className="goal-days-left" style={{
                                    color: goalProgress.daysLeft <= 3 ? 'var(--danger)' : 'var(--primary)',
                                }}>
                                    {goalProgress.daysLeft}
                                </div>
                                <div className="goal-days-label">{t('dashboard.daysLeft')}</div>
                                <div className="goal-dates-row">
                                    <div style={{ textAlign: 'left' }}>
                                        <div className="goal-date-label">{t('common.start')}</div>
                                        <div className="goal-date-val">
                                            {new Date(goalProgress.startDate).toLocaleDateString(currentLocale, { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="goal-date-label">{t('common.target')}</div>
                                        <div className="goal-date-val">
                                            {new Date(goalProgress.targetDate).toLocaleDateString(currentLocale, { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Expenses List */}
                {visibleWidgets.includes('expenses-list') && (
                    <div key="expenses-list" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('expenses-list')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={
                                <div className="list-section-header">
                                    <span>💸 {MONTHS_TR[selectedMonth.month]} {t('dashboard.expensesSuffix')}</span>
                                    <span className="list-day-count">{t('dashboard.dayCount', { count: monthlySortedDates.length })}</span>
                                </div>
                            }
                            className="chart-section-card"
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {monthlySortedDates.length === 0 ? (
                                <div className="empty-list-msg">
                                    {t('dashboard.noExpensesForMonth')}
                                </div>
                            ) : (
                                <div className="scrollable-list">
                                    {monthlySortedDates.map(date => {
                                        const items = monthlyExpensesGroups[date];
                                        const dayTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                                        const isToday = date === new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                        return (
                                            <div key={date} className="day-group">
                                                <div className="day-header">
                                                    <span className="day-date">{isToday ? t('common.today') : date}</span>
                                                    <span className="day-total">-{formatCurrency(dayTotal, privacyMode, currentLocale, currency)}</span>
                                                </div>
                                                <div>
                                                    {items.map((item, idx) => (
                                                        <TransactionItem
                                                            key={idx}
                                                            icon={item.category.includes('Yemek') ? '🍔' :
                                                                item.category.includes('Ulaşım') ? '🚌' :
                                                                    item.category.includes('Market') ? '🛒' :
                                                                        item.category.includes('Kahve') ? '☕' : '💸'
                                                            }
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
                                    })}
                                </div>
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* Incomes List */}
                {visibleWidgets.includes('incomes-list') && (
                    <div key="incomes-list" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('incomes-list')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={
                                <div className="list-section-header">
                                    <span>💰 {MONTHS_TR[selectedMonth.month]} {t('dashboard.incomesSuffix')}</span>
                                    <span className="list-day-count">{t('dashboard.dayCount', { count: monthlySortedIncomeDates.length })}</span>
                                </div>
                            }
                            className="chart-section-card"
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {monthlySortedIncomeDates.length === 0 ? (
                                <div className="empty-list-msg">
                                    {t('dashboard.noIncomesForMonth')}
                                </div>
                            ) : (
                                <div className="scrollable-list">
                                    {monthlySortedIncomeDates.map(date => {
                                        const items = monthlyIncomesGroups[date];
                                        const dayTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                                        const isToday = date === new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                        return (
                                            <div key={date} className="day-group">
                                                <div className="day-header">
                                                    <span className="day-date">{isToday ? t('common.today') : date}</span>
                                                    <span className="day-total">+{formatCurrency(dayTotal, privacyMode, currentLocale, currency)}</span>
                                                </div>
                                                <div>
                                                    {items.map((item, idx) => (
                                                        <TransactionItem
                                                            key={idx}
                                                            icon={item.source === 'Maaş' ? '💵' :
                                                                item.source === 'Freelance' ? '💻' :
                                                                    item.source === 'Yatırım' ? '📈' : '💰'
                                                            }
                                                            title={item.source}
                                                            description={item.desc}
                                                            amount={item.amount}
                                                            type="income"
                                                            privacyMode={privacyMode}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* Daily Heatmap */}
                {visibleWidgets.includes('daily-heatmap') && (
                    <div key="daily-heatmap" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('daily-heatmap')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><Calendar size={18} /> {t('dashboard.dailyHeatmap')}</>}
                            className="chart-section-card"
                        >
                            <div className="note-text" style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {t('dashboard.heatmapDesc')}
                            </div>
                            {dailyHeatmapData && dailyHeatmapData.length > 0 ? (
                                <div className="chart-wrapper">
                                    <Chart
                                        type="matrix"
                                        data={{
                                            datasets: [{
                                                label: t('dashboard.dailyHeatmap'),
                                                data: dailyHeatmapData,
                                                backgroundColor: (context) => {
                                                    const value = context.dataset.data[context.dataIndex].d;
                                                    const alpha = Math.min(0.2 + (value / 5000) * 0.8, 1);
                                                    return `rgba(99, 102, 241, ${alpha})`;
                                                },
                                                width: ({ chart }) => ((chart.chartArea?.width || 0) / 32) - 1,
                                                height: ({ chart }) => ((chart.chartArea?.height || 0) / 7) - 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (item) => {
                                                            const d = item.dataset.data[item.dataIndex];
                                                            return `${d.x}: ${formatCurrency(d.d, privacyMode, currentLocale, currency)}`;
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    type: 'category',
                                                    offset: true,
                                                    grid: { display: false },
                                                    ticks: { display: false }
                                                },
                                                y: {
                                                    type: 'linear',
                                                    offset: true,
                                                    min: -0.5,
                                                    max: 6.5,
                                                    grid: { display: false },
                                                    ticks: {
                                                        display: true,
                                                        callback: (value) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value],
                                                        color: textColor
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="empty-chart-msg">{t('dashboard.noDataForHeatmap')}</div>
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* Year Comparison */}
                {visibleWidgets.includes('year-comparison') && (
                    <div key="year-comparison" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('year-comparison')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><TrendingUp size={18} /> {t('dashboard.yearComparison')}</>}
                            className="chart-section-card"
                        >
                            <div className="chart-wrapper">
                                <Bar data={yearComparisonData} options={chartOptions} />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Expense Forecast */}
                {visibleWidgets.includes('expense-forecast') && (
                    <div key="expense-forecast" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('expense-forecast')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><TrendingUp size={18} /> {t('dashboard.expenseForecast')}</>}
                            className="chart-section-card prediction-card"
                        >
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                {expenseForecast.predicted > 0 ? (
                                    <>
                                        <div className="prediction-value" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                                            {formatCurrency(expenseForecast.predicted, privacyMode, currentLocale, currency)}
                                        </div>
                                        <div className="prediction-range" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                            {formatCurrency(expenseForecast.min, privacyMode, currentLocale, currency)} - {formatCurrency(expenseForecast.max, privacyMode, currentLocale, currency)}
                                        </div>
                                        <div className="prediction-label" style={{
                                            fontSize: '0.75rem',
                                            marginTop: '1rem',
                                            padding: '4px 10px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '12px',
                                            display: 'inline-block',
                                            color: 'var(--primary)'
                                        }}>
                                            📊 {t('dashboard.forecastConfidence', { percent: Math.round(expenseForecast.confidence * 100) })}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem' }}>
                                        {t('dashboard.moreDataNeeded')}
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Budget Depletion */}
                {visibleWidgets.includes('budget-depletion') && (
                    <div key="budget-depletion" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('budget-depletion')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><Clock size={18} /> {t('dashboard.budgetDepletion')}</>}
                            className={`chart-section-card prediction-card ${budgetDepletion.isOnTrack ? '' : 'warning'}`}
                        >
                            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                                {userProfile?.monthlyBudget > 0 ? (
                                    <>
                                        <div className="prediction-value" style={{
                                            fontSize: '1.75rem',
                                            fontWeight: 800,
                                            color: budgetDepletion.daysLeft < 7 ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            {budgetDepletion.daysLeft} {t('dashboard.daysRemaining')}
                                        </div>
                                        <div className="budget-progress" style={{ marginTop: '1.5rem' }}>
                                            <div className="progress-bar-container" style={{ position: 'relative', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min(budgetDepletion.percentUsed, 100)}%`,
                                                    height: '100%',
                                                    background: budgetDepletion.percentUsed > 90 ? 'var(--danger)' : budgetDepletion.percentUsed > 70 ? 'var(--warning)' : 'var(--success)',
                                                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                                                }}></div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                                <span>{Math.round(budgetDepletion.percentUsed)}% {t('dashboard.used')}</span>
                                                <span>{formatCurrency(budgetDepletion.safeSpendingRate, privacyMode, currentLocale, currency)} / {t('common.day')}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem' }}>
                                        {t('dashboard.budgetNotSet')}
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Goal Prediction */}
                {visibleWidgets.includes('goal-prediction') && goalPrediction && (
                    <div key="goal-prediction" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('goal-prediction')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><Target size={18} /> {t('dashboard.goalPrediction')}</>}
                            className="chart-section-card prediction-card"
                        >
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div className="prediction-value" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                                    {goalPrediction.monthsRemaining} {t('dashboard.monthsRemaining')}
                                </div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}>
                                    <Calendar size={14} />
                                    {new Date(goalPrediction.completionDate).toLocaleDateString(currentLocale, { year: 'numeric', month: 'long' })}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Hedef: {formatCurrency(goalPrediction.requiredMonthlySaving, privacyMode, currentLocale, currency)} / ay tasarruf
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Income Projection */}
                {visibleWidgets.includes('income-projection') && (
                    <div key="income-projection" className={`grid-item-container ${isEditMode ? 'edit-active no-select' : ''}`}>
                        {isEditMode && (
                            <>
                                <div className="drag-handle"><Layout size={16} /></div>
                                <button className="card-delete-btn" onClick={() => removeWidget('income-projection')}><X size={14} /></button>
                            </>
                        )}
                        <SectionCard
                            title={<><TrendingUp size={18} /> {t('dashboard.incomeProjection')}</>}
                            className="chart-section-card"
                        >
                            <div className="chart-wrapper">
                                <Line data={{
                                    labels: incomeProjection.map(p => new Date(p.month).toLocaleDateString(currentLocale, { month: 'short' })),
                                    datasets: [{
                                        label: t('dashboard.projectedNet'),
                                        data: incomeProjection.map(p => p.net),
                                        borderColor: palette[0],
                                        backgroundColor: `${palette[0]}33`,
                                        fill: true,
                                        borderDash: [5, 5],
                                        tension: 0.4
                                    }]
                                }} options={chartOptions} />
                            </div>
                        </SectionCard>
                    </div>
                )}
            </ResponsiveGridLayout>

            {/* Advanced Analytics Modal */}
            <AnalyticsModal
                isOpen={showAnalyticsModal}
                onClose={() => setShowAnalyticsModal(false)}
                weeklyData={weeklyData}
                categoryBudgetData={categoryBudgetData}
                privacyMode={privacyMode}
                visibleWidgets={visibleWidgets}
                onToggleWidget={toggleWidget}
                minWidgets={MIN_WIDGETS}
            />
        </div>
    );
};

export default Dashboard;
