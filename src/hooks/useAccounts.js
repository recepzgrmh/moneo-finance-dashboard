import { useState, useMemo } from 'react';

export const useAccounts = ({ accounts, cash, expenses = [], incomes = [], onUpdateCash, onUpdateAccounts }) => {
    const [editingCash, setEditingCash] = useState(false);
    const [tempCash, setTempCash] = useState(cash);
    const [editingAccountIdx, setEditingAccountIdx] = useState(null);
    const [tempAccountBalance, setTempAccountBalance] = useState(0);

    // Calculate totals from transactions
    const totalIncome = useMemo(() => incomes.reduce((sum, i) => sum + i.amount, 0), [incomes]);
    const totalExpense = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    const netBalance = totalIncome - totalExpense;

    // Group expenses by bank (if available)
    const expensesByBank = useMemo(() => {
        return expenses.reduce((acc, exp) => {
            const bank = exp.bank || 'Bilinmeyen';
            acc[bank] = (acc[bank] || 0) + exp.amount;
            return acc;
        }, {});
    }, [expenses]);

    // Handle cash edit
    const handleCashSave = () => {
        if (onUpdateCash) {
            onUpdateCash(parseFloat(tempCash) || 0);
        }
        setEditingCash(false);
    };

    // Handle account balance edit
    const handleAccountSave = (idx) => {
        if (onUpdateAccounts) {
            const updatedAccounts = [...accounts];
            updatedAccounts[idx] = { ...updatedAccounts[idx], balance: parseFloat(tempAccountBalance) || 0 };
            onUpdateAccounts(updatedAccounts);
        }
        setEditingAccountIdx(null);
    };

    return {
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
    };
};
