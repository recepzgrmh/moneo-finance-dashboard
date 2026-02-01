import { useState, useEffect, useMemo } from 'react';
import * as Finance from '../utils/financeEngine';

export const useGoals = (userProfile) => {
    // Derived State
    const goalProgress = useMemo(() => Finance.calculateGoalProgress(userProfile), [userProfile]);

    // Local State
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('user_goals');
        return saved ? JSON.parse(saved) : [];
    });

    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '' });

    // For Deposit Modal
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');

    // Persistence
    useEffect(() => {
        localStorage.setItem('user_goals', JSON.stringify(goals));
    }, [goals]);

    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.target) {
            alert("Lütfen hedef adı ve hedef tutarını girin.");
            return;
        }
        const goal = {
            id: Date.now(),
            title: newGoal.title,
            target: parseFloat(newGoal.target),
            current: parseFloat(newGoal.current) || 0,
            color: 'var(--primary)'
        };
        setGoals([...goals, goal]);
        setNewGoal({ title: '', target: '', current: '' });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bu hedefi silmek istediğinize emin misiniz?')) {
            setGoals(goals.filter(g => g.id !== id));
        }
    };

    const handleDeposit = () => {
        if (!depositAmount || !selectedGoal) return;

        const amount = parseFloat(depositAmount);
        const updatedGoals = goals.map(g => {
            if (g.id === selectedGoal.id) {
                const newCurrent = g.current + amount;
                // Celebration Logic could go here
                if (newCurrent >= g.target && g.current < g.target) {
                    alert("Tebrikler! Hedefine ulaştın! 🎉");
                }
                return { ...g, current: newCurrent };
            }
            return g;
        });

        setGoals(updatedGoals);
        setSelectedGoal(null);
        setDepositAmount('');
    };

    return {
        goalProgress,
        goals,
        showForm,
        newGoal,
        selectedGoal,
        depositAmount,

        setShowForm,
        setNewGoal,
        setSelectedGoal,
        setDepositAmount,

        handleAddGoal,
        handleDelete,
        handleDeposit
    };
};
