import { useState, useMemo, useEffect } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout/legacy';
import * as Finance from '../utils/financeEngine';
import { parseDate } from '../utils/formatters';
import * as Predictions from '../utils/predictions';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
    lg: [
        { i: 'stat-income', x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'stat-expense', x: 4, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'stat-balance', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'spending-flow', x: 0, y: 4, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'trend-6m', x: 6, y: 4, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'category-trends', x: 0, y: 16, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'category-dist', x: 6, y: 16, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'weekly-budget', x: 0, y: 28, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'cumulative-balance', x: 6, y: 28, w: 6, h: 12, minW: 4, minH: 8 },
        { i: 'insights', x: 0, y: 40, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'salary-limit', x: 4, y: 40, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'goal-reward', x: 8, y: 40, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'expenses-list', x: 0, y: 50, w: 6, h: 15, minW: 4, minH: 10 },
        { i: 'incomes-list', x: 6, y: 50, w: 6, h: 15, minW: 4, minH: 10 },
        // Advanced Analytics
        { i: 'daily-heatmap', x: 0, y: 65, w: 12, h: 10, minW: 6, minH: 8 },
        { i: 'year-comparison', x: 0, y: 75, w: 7, h: 10, minW: 4, minH: 8 },
        { i: 'income-projection', x: 7, y: 75, w: 5, h: 10, minW: 3, minH: 8 },
        { i: 'expense-forecast', x: 0, y: 85, w: 4, h: 8, minW: 2, minH: 6 },
        { i: 'budget-depletion', x: 4, y: 85, w: 4, h: 8, minW: 2, minH: 6 },
        { i: 'goal-prediction', x: 8, y: 85, w: 4, h: 8, minW: 2, minH: 6 }
    ],
    md: [
        { i: 'stat-income', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'stat-expense', x: 3, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'stat-balance', x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'spending-flow', x: 0, y: 4, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'trend-6m', x: 5, y: 4, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'category-trends', x: 0, y: 16, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'category-dist', x: 5, y: 16, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'weekly-budget', x: 0, y: 28, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'cumulative-balance', x: 5, y: 28, w: 5, h: 12, minW: 3, minH: 8 },
        { i: 'insights', x: 0, y: 40, w: 3, h: 10, minW: 2, minH: 6 },
        { i: 'salary-limit', x: 3, y: 40, w: 4, h: 10, minW: 2, minH: 6 },
        { i: 'goal-reward', x: 7, y: 40, w: 3, h: 10, minW: 2, minH: 6 },
        { i: 'expenses-list', x: 0, y: 50, w: 5, h: 15, minW: 3, minH: 10 },
        { i: 'incomes-list', x: 5, y: 50, w: 5, h: 15, minW: 3, minH: 10 },
        // Advanced Analytics
        { i: 'daily-heatmap', x: 0, y: 65, w: 10, h: 10, minW: 5, minH: 8 },
        { i: 'year-comparison', x: 0, y: 75, w: 6, h: 10, minW: 4, minH: 8 },
        { i: 'income-projection', x: 6, y: 75, w: 4, h: 10, minW: 3, minH: 8 },
        { i: 'expense-forecast', x: 0, y: 85, w: 3, h: 8, minW: 2, minH: 6 },
        { i: 'budget-depletion', x: 3, y: 85, w: 4, h: 8, minW: 2, minH: 6 },
        { i: 'goal-prediction', x: 7, y: 85, w: 3, h: 8, minW: 2, minH: 6 }
    ],
    sm: [
        { i: 'stat-income', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
        { i: 'stat-expense', x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
        { i: 'stat-balance', x: 4, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
        { i: 'spending-flow', x: 0, y: 4, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'trend-6m', x: 0, y: 16, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'category-trends', x: 0, y: 28, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'category-dist', x: 0, y: 40, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'weekly-budget', x: 0, y: 52, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'cumulative-balance', x: 0, y: 64, w: 6, h: 12, minW: 3, minH: 8 },
        { i: 'insights', x: 0, y: 76, w: 2, h: 10, minW: 2, minH: 6 },
        { i: 'salary-limit', x: 2, y: 76, w: 2, h: 10, minW: 2, minH: 6 },
        { i: 'goal-reward', x: 4, y: 76, w: 2, h: 10, minW: 2, minH: 6 },
        { i: 'expenses-list', x: 0, y: 86, w: 6, h: 15, minW: 4, minH: 10 },
        { i: 'incomes-list', x: 0, y: 101, w: 6, h: 15, minW: 4, minH: 10 },
        // Advanced Analytics
        { i: 'daily-heatmap', x: 0, y: 116, w: 6, h: 10, minW: 3, minH: 8 },
        { i: 'year-comparison', x: 0, y: 126, w: 6, h: 10, minW: 3, minH: 8 },
        { i: 'income-projection', x: 0, y: 136, w: 6, h: 10, minW: 4, minH: 8 },
        { i: 'expense-forecast', x: 0, y: 146, w: 3, h: 8, minW: 2, minH: 6 },
        { i: 'budget-depletion', x: 3, y: 146, w: 3, h: 8, minW: 2, minH: 6 },
        { i: 'goal-prediction', x: 0, y: 154, w: 3, h: 8, minW: 2, minH: 6 }
    ],
    xs: [
        { i: 'stat-income', x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'stat-expense', x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'stat-balance', x: 0, y: 8, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'spending-flow', x: 0, y: 12, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'trend-6m', x: 0, y: 22, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'category-trends', x: 0, y: 32, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'category-dist', x: 0, y: 42, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'weekly-budget', x: 0, y: 52, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'cumulative-balance', x: 0, y: 62, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'insights', x: 0, y: 72, w: 4, h: 10, minW: 2, minH: 6 },
        { i: 'salary-limit', x: 0, y: 82, w: 4, h: 10, minW: 2, minH: 6 },
        { i: 'goal-reward', x: 0, y: 92, w: 4, h: 10, minW: 2, minH: 6 },
        { i: 'expenses-list', x: 0, y: 102, w: 4, h: 12, minW: 3, minH: 8 },
        { i: 'incomes-list', x: 0, y: 114, w: 4, h: 12, minW: 3, minH: 8 },
        // Advanced Analytics  
        { i: 'daily-heatmap', x: 0, y: 126, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'year-comparison', x: 0, y: 136, w: 4, h: 10, minW: 3, minH: 6 },
        { i: 'income-projection', x: 0, y: 146, w: 4, h: 10, minW: 3, minH: 8 },
        { i: 'expense-forecast', x: 0, y: 156, w: 4, h: 8, minW: 2, minH: 6 },
        { i: 'budget-depletion', x: 0, y: 164, w: 4, h: 8, minW: 2, minH: 6 },
        { i: 'goal-prediction', x: 0, y: 172, w: 4, h: 8, minW: 2, minH: 6 }
    ],
};

// Color Palettes
const palettes = {
    default: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(236, 72, 153, 0.7)',
    ],
    neon: [
        '#00ff9d', '#d600ff', '#00ff9d', '#d600ff', '#00ff9d', '#d600ff'
    ],
    light: [
        '#1e40af', '#3b82f6', '#0284c7', '#0d9488', '#059669', '#d97706'
    ]
};

import { useTranslation } from 'react-i18next';

export const useDashboard = ({ expenses, incomes, theme, userProfile }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    // Month filter state
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return { month: now.getMonth(), year: now.getFullYear() };
    });
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const MIN_WIDGETS = 3;
    // Layout version key to force re-render on reset
    const [layoutVersion, setLayoutVersion] = useState(0);

    // Widget visibility logic
    const [visibleWidgets, setVisibleWidgets] = useState(() => {
        const saved = localStorage.getItem('dashboard-visible-widgets');
        if (saved) return JSON.parse(saved);
        return DEFAULT_LAYOUTS.lg.map(w => w.i);
    });

    // Layout logic
    const [layouts, setLayouts] = useState(() => {
        const saved = localStorage.getItem('dashboard-layouts');
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUTS;
    });

    const toggleWidget = (id) => {
        setVisibleWidgets(prev => {
            const isRemoving = prev.includes(id);
            if (isRemoving && prev.length <= MIN_WIDGETS) {
                alert(`En az ${MIN_WIDGETS} kart görünür olmalıdır.`);
                return prev;
            }
            const next = isRemoving ? prev.filter(w => w !== id) : [...prev, id];
            localStorage.setItem('dashboard-visible-widgets', JSON.stringify(next));

            // Auto-reset layout when adding a new widget to ensure clean arrangement
            if (!isRemoving) {
                const resetLayouts = JSON.parse(JSON.stringify(DEFAULT_LAYOUTS));
                setLayouts(resetLayouts);
                localStorage.setItem('dashboard-layouts', JSON.stringify(resetLayouts));
                setLayoutVersion(v => v + 1); // Force grid re-mount
            }

            return next;
        });
    };

    const removeWidget = (id) => {
        if (visibleWidgets.length <= MIN_WIDGETS) {
            alert(`En az ${MIN_WIDGETS} kart görünür olmalıdır.`);
            return;
        }
        if (window.confirm('Bu kartı kaldırmak istediğinize emin misiniz? (Kartı "Görünüm Seçenekleri" menüsünden tekrar ekleyebilirsiniz)')) {
            toggleWidget(id);
        }
    };

    const onLayoutChange = (currentLayout, allLayouts) => {
        if (!isEditMode) return;

        setLayouts(prev => {
            const next = { ...prev };
            Object.keys(allLayouts).forEach(breakpoint => {
                const currentBreakpointLayout = allLayouts[breakpoint];
                // Instead of just values, we merge to keep track of hidden items too
                const prevBreakpointLayout = prev[breakpoint] || DEFAULT_LAYOUTS[breakpoint] || [];

                const layoutMap = {};
                prevBreakpointLayout.forEach(item => {
                    layoutMap[item.i] = item;
                });

                currentBreakpointLayout.forEach(item => {
                    // Force minimums from default layouts even when saving
                    // Lookup default for this specific breakpoint, fallback to lg
                    const defaultBreakpointLayout = DEFAULT_LAYOUTS[breakpoint] || DEFAULT_LAYOUTS.lg;
                    const defItem = defaultBreakpointLayout.find(d => d.i === item.i);

                    layoutMap[item.i] = {
                        ...item,
                        minW: defItem?.minW || item.minW,
                        minH: defItem?.minH || item.minH
                    };
                });

                next[breakpoint] = Object.values(layoutMap);
            });
            localStorage.setItem('dashboard-layouts', JSON.stringify(next));
            return next;
        });
    };

    const resetLayout = () => {
        if (window.confirm('Düzeni varsayılan ayarlara döndürmek istediğinize emin misiniz?')) {
            const resetLayouts = JSON.parse(JSON.stringify(DEFAULT_LAYOUTS));
            setLayouts(resetLayouts);
            localStorage.setItem('dashboard-layouts', JSON.stringify(resetLayouts));
            setLayoutVersion(v => v + 1); // Force grid re-mount
            setIsEditMode(false);
        }
    };

    // Calculated layout for the grid that strictly enforces min dimensions
    const calculatedLayouts = useMemo(() => {
        const result = {};
        Object.keys(layouts).forEach(bp => {
            const defaultBreakpointLayout = DEFAULT_LAYOUTS[bp] || DEFAULT_LAYOUTS.lg;
            result[bp] = (layouts[bp] || []).map(item => {
                const def = defaultBreakpointLayout.find(d => d.i === item.i);
                return {
                    ...item,
                    minW: def?.minW || item.minW,
                    minH: def?.minH || item.minH,
                    w: Math.max(item.w, def?.minW || 0),
                    h: Math.max(item.h, def?.minH || 0)
                };
            });
        });
        return result;
    }, [layouts]);

    useEffect(() => {
        // Force refresh layout on mount
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Filter expenses by selected month
    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const date = parseDate(exp.date);
            return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
        });
    }, [expenses, selectedMonth]);

    // Filter incomes by selected month
    const filteredIncomes = useMemo(() => {
        return incomes.filter(inc => {
            const date = parseDate(inc.date);
            return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
        });
    }, [incomes, selectedMonth]);

    // Monthly totals
    const monthlyExpenseTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyIncomeTotal = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
    const monthlyBalance = monthlyIncomeTotal - monthlyExpenseTotal;

    // Group filtered expenses by date
    const monthlyExpensesGroups = filteredExpenses.reduce((acc, exp) => {
        if (!acc[exp.date]) acc[exp.date] = [];
        acc[exp.date].push(exp);
        return acc;
    }, {});

    const monthlySortedDates = Object.keys(monthlyExpensesGroups).sort((a, b) => {
        return parseDate(b) - parseDate(a);
    });

    // Monthly category breakdown
    const monthlyCategoryMap = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    // Group filtered incomes by date
    const monthlyIncomesGroups = filteredIncomes.reduce((acc, inc) => {
        if (!acc[inc.date]) acc[inc.date] = [];
        acc[inc.date].push(inc);
        return acc;
    }, {});

    const monthlySortedIncomeDates = Object.keys(monthlyIncomesGroups).sort((a, b) => {
        return parseDate(b) - parseDate(a);
    });

    // Navigation
    const goToPrevMonth = () => {
        setSelectedMonth(prev => {
            if (prev.month === 0) return { month: 11, year: prev.year - 1 };
            return { month: prev.month - 1, year: prev.year };
        });
    };

    const goToNextMonth = () => {
        setSelectedMonth(prev => {
            if (prev.month === 11) return { month: 0, year: prev.year + 1 };
            return { month: prev.month + 1, year: prev.year };
        });
    };

    // Select Palette
    const currentPalette = palettes[theme] || palettes.default;
    const barColor = theme === 'neon' ? '#00ff9d' : theme === 'light' ? '#4f46e5' : 'rgba(99, 102, 241, 0.5)';
    const textColor = theme === 'light' ? '#334155' : '#ffffff';

    // Charts Configuration
    const categoryLabels = Object.keys(monthlyCategoryMap);
    const categoryValues = Object.values(monthlyCategoryMap);

    const doughnutData = {
        labels: categoryLabels.length > 0 ? categoryLabels : ['Veri yok'],
        datasets: [{
            data: categoryValues.length > 0 ? categoryValues : [1],
            backgroundColor: categoryLabels.length > 0 ? currentPalette : ['rgba(100,100,100,0.3)'],
            borderColor: theme === 'neon' ? '#000' : 'rgba(255, 255, 255, 0.1)',
            borderWidth: theme === 'neon' ? 2 : 1,
        }],
    };

    // Monthly date-based spending for bar chart
    const monthlyDateMap = filteredExpenses.reduce((acc, exp) => {
        const day = exp.date.split('.')[0]; // Just day number
        acc[day] = (acc[day] || 0) + exp.amount;
        return acc;
    }, {});

    const sortedDayKeys = Object.keys(monthlyDateMap).sort((a, b) => parseInt(a) - parseInt(b));

    const barData = {
        labels: sortedDayKeys.length > 0 ? sortedDayKeys.map(d => `${d} ${t('common.day')}`) : [t('dashboard.noExpensesForMonth')],
        datasets: [{
            label: t('dashboard.monthlyExpense'),
            data: sortedDayKeys.length > 0 ? sortedDayKeys.map(k => monthlyDateMap[k]) : [0],
            backgroundColor: barColor,
            borderRadius: theme === 'neon' ? 0 : 8,
            borderWidth: theme === 'neon' ? 1 : 0,
            borderColor: theme === 'neon' ? '#00ff9d' : undefined
        }]
    };

    // Trend Data
    const trendDataRaw = Finance.getTrendData(incomes, expenses);
    const trendData = {
        labels: trendDataRaw.map(t => new Date(t.rawDate).toLocaleDateString(currentLocale, { month: 'short' })),
        datasets: [
            {
                label: t('accounts.totalIncome'),
                data: trendDataRaw.map(t => t.income),
                borderColor: 'rgba(16, 185, 129, 0.8)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: t('accounts.totalExpense'),
                data: trendDataRaw.map(t => t.expense),
                borderColor: 'rgba(239, 68, 68, 0.8)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const categoryTrendRaw = Finance.getCategoryTrendData(expenses);
    const categoryTrendData = {
        labels: categoryTrendRaw.rawDates.map(d => new Date(d).toLocaleDateString(currentLocale, { month: 'short' })),
        datasets: categoryTrendRaw.datasets.map((ds, idx) => ({
            ...ds,
            borderColor: currentPalette[idx % currentPalette.length],
            backgroundColor: currentPalette[idx % currentPalette.length],
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3
        }))
    };

    // Weekly Budget Performance Chart
    const weeklyBudgetData = useMemo(() => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const weeklyExpenses = [0, 0, 0, 0];

        filteredExpenses.forEach(exp => {
            const day = parseInt(exp.date.split('.')[0]);
            const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
            weeklyExpenses[weekIndex] += exp.amount;
        });

        const weeklyBudget = (userProfile?.monthlyBudget || 0) / 4;

        return {
            labels: weeks.map((w, i) => t('dashboard.week', { number: i + 1 })),
            datasets: [
                {
                    label: t('dashboard.spending'),
                    data: weeklyExpenses,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderRadius: 8,
                },
                {
                    label: t('dashboard.budget'),
                    data: [weeklyBudget, weeklyBudget, weeklyBudget, weeklyBudget],
                    backgroundColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: 8,
                }
            ]
        };
    }, [filteredExpenses, userProfile, t]);

    // Cumulative Balance Trend (Area Chart)
    const cumulativeBalanceData = useMemo(() => {
        const sortedTransactions = [];

        filteredExpenses.forEach(exp => {
            sortedTransactions.push({
                date: parseDate(exp.date),
                amount: -exp.amount,
                type: 'expense'
            });
        });

        filteredIncomes.forEach(inc => {
            sortedTransactions.push({
                date: parseDate(inc.date),
                amount: inc.amount,
                type: 'income'
            });
        });

        sortedTransactions.sort((a, b) => a.date - b.date);

        let cumulativeBalance = 0;
        const balances = [];
        const labels = [];

        sortedTransactions.forEach(transaction => {
            cumulativeBalance += transaction.amount;
            balances.push(cumulativeBalance);
            labels.push(transaction.date.getDate());
        });

        if (balances.length === 0) {
            return {
                labels: [t('dashboard.noData')],
                datasets: [{
                    label: t('dashboard.cumulativeBalance'),
                    data: [0],
                    borderColor: 'rgba(99, 102, 241, 0.8)',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            };
        }

        return {
            labels: labels.map(d => `${d} ${t('common.day')}`),
            datasets: [{
                label: t('dashboard.cumulativeBalance'),
                data: balances,
                borderColor: cumulativeBalance >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                backgroundColor: cumulativeBalance >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 4
            }]
        };
    }, [filteredExpenses, filteredIncomes, t]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                grid: { color: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.05)' },
                ticks: { color: textColor }
            },
            x: {
                grid: { display: false },
                ticks: { color: textColor }
            }
        }
    };

    // Analytics Data
    const weeklyData = useMemo(() => Finance.getWeeklyBreakdown(expenses), [expenses]);
    const categoryBudgetData = useMemo(() => Finance.getCategoryVsBudget(expenses, userProfile), [expenses, userProfile]);

    // Advanced Analytics - Heatmap
    const dailyHeatmapData = useMemo(() => {
        return Predictions.calculateDailyHeatmap(expenses, selectedMonth.month, selectedMonth.year, parseDate);
    }, [expenses, selectedMonth]);

    // Advanced Analytics - Year Comparison
    const yearComparisonData = useMemo(() => {
        const currentYear = selectedMonth.year;
        const lastYear = currentYear - 1;
        const month = selectedMonth.month;

        const currentYearExpenses = expenses.filter(exp => {
            const d = parseDate(exp.date);
            return d.getFullYear() === currentYear && d.getMonth() === month;
        }).reduce((sum, exp) => sum + exp.amount, 0);

        const lastYearExpenses = expenses.filter(exp => {
            const d = parseDate(exp.date);
            return d.getFullYear() === lastYear && d.getMonth() === month;
        }).reduce((sum, exp) => sum + exp.amount, 0);

        const currentYearIncomes = incomes.filter(inc => {
            const d = parseDate(inc.date);
            return d.getFullYear() === currentYear && d.getMonth() === month;
        }).reduce((sum, inc) => sum + inc.amount, 0);

        const lastYearIncomes = incomes.filter(inc => {
            const d = parseDate(inc.date);
            return d.getFullYear() === lastYear && d.getMonth() === month;
        }).reduce((sum, inc) => sum + inc.amount, 0);

        return {
            labels: [t('dashboard.expenses'), t('dashboard.income'), t('dashboard.net')],
            datasets: [
                {
                    label: lastYear,
                    data: [lastYearExpenses, lastYearIncomes, lastYearIncomes - lastYearExpenses],
                    backgroundColor: 'rgba(156, 163, 175, 0.6)',
                    borderColor: 'rgba(156, 163, 175, 1)',
                    borderWidth: 1
                },
                {
                    label: currentYear,
                    data: [currentYearExpenses, currentYearIncomes, currentYearIncomes - currentYearExpenses],
                    backgroundColor: currentPalette[0],
                    borderColor: currentPalette[0].replace('0.7', '1'),
                    borderWidth: 1
                }
            ]
        };
    }, [expenses, incomes, selectedMonth, currentPalette, t]);

    // Predictive Analytics - Expense Forecast
    const expenseForecast = useMemo(() => {
        // Get last 6 months of data
        const monthlyTotals = [];
        for (let i = 5; i >= 0; i--) {
            const targetDate = new Date(selectedMonth.year, selectedMonth.month - i, 1);
            const monthTotal = expenses.filter(exp => {
                const d = parseDate(exp.date);
                return d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth();
            }).reduce((sum, exp) => sum + exp.amount, 0);
            monthlyTotals.push({ month: targetDate, total: monthTotal });
        }

        return Predictions.predictNextMonthExpense(monthlyTotals);
    }, [expenses, selectedMonth]);

    // Predictive Analytics - Budget Depletion
    const budgetDepletion = useMemo(() => {
        const now = new Date();
        const currentDay = now.getDate();
        const daysInMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
        const budget = userProfile?.monthlyBudget || 0;

        return Predictions.calculateBudgetDepletion(
            monthlyExpenseTotal,
            budget,
            currentDay,
            daysInMonth
        );
    }, [monthlyExpenseTotal, userProfile, selectedMonth]);

    // Predictive Analytics - Goal Completion
    const goalPrediction = useMemo(() => {
        const goals = JSON.parse(localStorage.getItem('user_goals') || '[]');
        if (goals.length === 0) return null;

        // Find main goal or just take the first one
        const mainGoal = goals.find(g => g.isMain) || goals[0];
        const monthlySavings = monthlyIncomeTotal - monthlyExpenseTotal;

        return Predictions.predictGoalCompletion(mainGoal, monthlySavings);
    }, [monthlyIncomeTotal, monthlyExpenseTotal, selectedMonth]);

    // Predictive Analytics - Net Income Projection
    const incomeProjection = useMemo(() => {
        // Get last 6 months of historical data
        const historicalData = [];
        for (let i = 5; i >= 0; i--) {
            const targetDate = new Date(selectedMonth.year, selectedMonth.month - i, 1);
            const monthExpenses = expenses.filter(exp => {
                const d = parseDate(exp.date);
                return d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth();
            }).reduce((sum, exp) => sum + exp.amount, 0);

            const monthIncomes = incomes.filter(inc => {
                const d = parseDate(inc.date);
                return d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth();
            }).reduce((sum, inc) => sum + inc.amount, 0);

            historicalData.push({ income: monthIncomes, expense: monthExpenses });
        }

        return Predictions.projectNetIncome(historicalData, 6);
    }, [expenses, incomes, selectedMonth]);

    return {
        // State
        selectedMonth,
        showAnalyticsModal,
        isEditMode,
        layoutVersion,
        visibleWidgets,

        // Actions
        setSelectedMonth,
        setShowAnalyticsModal,
        setIsEditMode,
        removeWidget,
        resetLayout,
        onLayoutChange,
        goToPrevMonth,
        goToNextMonth,
        toggleWidget,

        // Data
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

        // Charts
        doughnutData,
        barData,
        trendData,
        categoryTrendData,
        weeklyBudgetData,
        cumulativeBalanceData,
        chartOptions,

        // Advanced Analytics
        dailyHeatmapData,
        yearComparisonData,
        expenseForecast,
        budgetDepletion,
        goalPrediction,
        incomeProjection,

        // Theme
        textColor,
        palette: currentPalette,
    };
};
