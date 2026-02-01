import { useState, useMemo } from 'react';
import { parseDate } from '../utils/formatters';

export const useIncomes = (incomes) => {
    // Current month filter
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return { month: now.getMonth(), year: now.getFullYear() };
    });

    // Filter incomes by selected month
    const filteredIncomes = useMemo(() => {
        return incomes.filter(income => {
            const date = parseDate(income.date);
            return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
        });
    }, [incomes, selectedMonth]);

    // Group filtered incomes by date
    const groupedIncomes = useMemo(() => {
        return filteredIncomes.reduce((acc, income) => {
            if (!acc[income.date]) acc[income.date] = [];
            acc[income.date].push(income);
            return acc;
        }, {});
    }, [filteredIncomes]);

    const sortedDates = useMemo(() => {
        return Object.keys(groupedIncomes).sort((a, b) => {
            return parseDate(b) - parseDate(a);
        });
    }, [groupedIncomes]);

    const totalIncome = useMemo(() => {
        return filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    }, [filteredIncomes]);

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
        filteredIncomes,
        groupedIncomes,
        sortedDates,
        totalIncome,
        goToPrevMonth,
        goToNextMonth
    };
};
