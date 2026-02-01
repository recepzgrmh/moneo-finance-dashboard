import { useState, useMemo } from 'react';
import { parseDate } from '../utils/formatters';

export const useExpenses = (expenses) => {
    // Current month filter
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return { month: now.getMonth(), year: now.getFullYear() };
    });

    // Filter expenses by selected month
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const date = parseDate(expense.date);
            return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
        });
    }, [expenses, selectedMonth]);

    // Group filtered expenses by date
    const groupedExpenses = useMemo(() => {
        return filteredExpenses.reduce((acc, expense) => {
            if (!acc[expense.date]) acc[expense.date] = [];
            acc[expense.date].push(expense);
            return acc;
        }, {});
    }, [filteredExpenses]);

    const sortedDates = useMemo(() => {
        return Object.keys(groupedExpenses).sort((a, b) => {
            return parseDate(b) - parseDate(a);
        });
    }, [groupedExpenses]);

    const totalExpense = useMemo(() => {
        return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, [filteredExpenses]);

    // Category breakdown
    const categoryMap = useMemo(() => {
        return filteredExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
    }, [filteredExpenses]);

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

    return {
        selectedMonth,
        filteredExpenses,
        groupedExpenses,
        sortedDates,
        totalExpense,
        categoryMap,
        goToPrevMonth,
        goToNextMonth
    };
};
