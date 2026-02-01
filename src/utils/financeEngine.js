import { parseDate } from './formatters';

export function calculateTotals(incomes, expenses) {
    let totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    let totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    let netBalance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, netBalance };
}

export function groupExpensesByDate(expenses) {
    const groups = {};
    expenses.forEach(item => {
        if (!groups[item.date]) groups[item.date] = [];
        groups[item.date].push(item);
    });
    // Sort Newest First
    const sortedDates = Object.keys(groups).sort((a, b) => {
        const da = a.split('.').reverse().join('-');
        const db = b.split('.').reverse().join('-');
        return new Date(db) - new Date(da);
    });
    return { groups, sortedDates };
}

export function calculateGoalProgress(userProfile) {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const { salary1, salary2 } = userProfile;
    let startDate, targetDate, titleText, isSalaryTarget;

    // Logic: Cycle between salary days
    // If today is between salary1.day and salary2.day -> target is salary2
    // Otherwise -> target is salary1 (next month if after salary2.day)

    const s1Day = salary1.day;
    const s2Day = salary2.day;

    if (currentDay >= s1Day && currentDay < s2Day) {
        // Between s1 and s2 (e.g., 5 and 29)
        startDate = new Date(currentYear, currentMonth, s1Day);
        targetDate = new Date(currentYear, currentMonth, s2Day);
        titleText = `${salary2.label.toUpperCase()} GÜNÜNE KALAN`;
        isSalaryTarget = true;
    } else {
        // Waiting for s1 (e.g., waiting for 5th)
        titleText = `${salary1.label.toUpperCase()} GÜNÜNE KALAN`;
        isSalaryTarget = true; // In this app context, both are "salary" targets
        if (currentDay >= s2Day) {
            startDate = new Date(currentYear, currentMonth, s2Day);
            targetDate = new Date(currentYear, currentMonth + 1, s1Day);
        } else {
            startDate = new Date(currentYear, currentMonth - 1, s2Day);
            targetDate = new Date(currentYear, currentMonth, s1Day);
        }
    }

    const totalDuration = targetDate - startDate;
    const elapsed = now - startDate;
    let progress = (elapsed / totalDuration) * 100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((targetDate - now) / msPerDay);

    return {
        titleText,
        daysLeft,
        progress,
        startDate, // Return Date object
        targetDate, // Return Date object
        startDateStr: startDate.toISOString(), // Keep ISO for safety
        targetDateStr: targetDate.toISOString(),
        isSalaryTarget
    };
}

export function calculateNextSalaryInfo(userProfile) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const { salary1, salary2 } = userProfile;

    // Salary Candidates
    let nextIncomeCandidate1 = new Date(currentYear, currentMonth, salary1.day);
    let nextIncomeCandidate2 = new Date(currentYear, currentMonth, salary2.day);

    // Adjust if dates passed
    if (currentDay >= salary1.day) nextIncomeCandidate1 = new Date(currentYear, currentMonth + 1, salary1.day);
    if (currentDay >= salary2.day) nextIncomeCandidate2 = new Date(currentYear, currentMonth + 1, salary2.day);

    // Find earliest
    let nextIncome = {};
    let targetDate;
    if (nextIncomeCandidate1 < nextIncomeCandidate2) {
        targetDate = nextIncomeCandidate1;
        nextIncome = { date: targetDate, amount: salary1.amount, source: salary1.label };
    } else {
        targetDate = nextIncomeCandidate2;
        nextIncome = { date: targetDate, amount: salary2.amount, source: salary2.label };
    }

    return {
        targetDate,
        targetDateStr: targetDate.toISOString(),
        nextIncome
    };
}

export function calculateDailyLimit(netBalance, nextSalaryDateObj) {
    const now = new Date();
    const diffTime = Math.max(0, nextSalaryDateObj - now);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRemaining = Math.ceil(diffTime / msPerDay);

    let dailyLimit = 0;
    if (daysRemaining > 0 && netBalance > 0) {
        dailyLimit = netBalance / daysRemaining;
    }
    return dailyLimit;
}

export function getChartData(expenses) {
    const categoryMap = {};
    expenses.forEach(item => {
        if (!categoryMap[item.category]) categoryMap[item.category] = 0;
        categoryMap[item.category] += Number(item.amount);
    });

    const dateMap = {};
    expenses.forEach(item => {
        if (!dateMap[item.date]) dateMap[item.date] = 0;
        dateMap[item.date] += Number(item.amount);
    });

    return { categoryMap, dateMap };
}

export function getTrendData(incomes, expenses, monthsCount = 6) {
    const result = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();

        const monthlyIncomes = incomes.filter(inc => {
            const id = inc.date.split('.');
            return parseInt(id[1]) - 1 === m && parseInt(id[2]) === y;
        });

        const monthlyExpenses = expenses.filter(exp => {
            const ed = exp.date.split('.');
            return parseInt(ed[1]) - 1 === m && parseInt(ed[2]) === y;
        });

        result.push({
            month: m,
            year: y,
            rawDate: d, // Pass raw date
            income: monthlyIncomes.reduce((acc, curr) => acc + curr.amount, 0),
            expense: monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0)
        });
    }
    return result;
}

export function getCategoryTrendData(expenses, monthsCount = 4) {
    const labels = [];
    const rawDates = [];
    const now = new Date();
    const categories = Array.from(new Set(expenses.map(e => e.category)));

    // Initialize structure
    const dataByCat = {};
    categories.forEach(cat => dataByCat[cat] = []);

    for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        // labels.push(d.toLocaleDateString('tr-TR', { month: 'short' })); // REMOVED
        rawDates.push(d); // Store raw date

        const monthlyExpenses = expenses.filter(exp => {
            const ed = exp.date.split('.');
            return parseInt(ed[1]) - 1 === m && parseInt(ed[2]) === y;
        });

        categories.forEach(cat => {
            const total = monthlyExpenses
                .filter(e => e.category === cat)
                .reduce((acc, curr) => acc + curr.amount, 0);
            dataByCat[cat].push(total);
        });
    }

    return { rawDates, datasets: Object.entries(dataByCat).map(([label, data]) => ({ label, data })) };
}

export function generateAnalyticInsights(expenses, totalExpense, netBalance, categoryMap, dailyLimit, userProfile) {
    const insights = [];
    const now = new Date();
    const dayOfMonth = now.getDate();

    // 1. Avg Spend
    const uniqueDates = {};
    expenses.forEach(e => uniqueDates[e.date] = true);
    const daysWithSpending = Object.keys(uniqueDates).length;
    const avgDailySpend = totalExpense / (daysWithSpending || 1);

    // 2. Top Category
    let maxCatName = '';
    let maxCatTotal = 0;
    for (const [cat, amount] of Object.entries(categoryMap)) {
        if (amount > maxCatTotal) {
            maxCatTotal = amount;
            maxCatName = cat;
        }
    }
    const topCatPerc = totalExpense > 0 ? ((maxCatTotal / totalExpense) * 100).toFixed(0) : 0;

    // 3. Salary Countdown context
    const nextSal = calculateNextSalaryInfo(userProfile);
    const msLeft = nextSal.targetDate - now;
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

    // Insights
    if (netBalance > 0) {
        if (avgDailySpend > dailyLimit * 1.1) {
            insights.push({
                titleKey: "dashboard.insights.highSpendingTitle",
                textKey: "dashboard.insights.highSpendingText",
                params: { avg: avgDailySpend.toFixed(2), target: dailyLimit.toFixed(2) },
                severity: "severity-high",
                icon: "🔥"
            });
        } else if (avgDailySpend < dailyLimit * 0.85) {
            insights.push({
                titleKey: "dashboard.insights.budgetControlTitle",
                textKey: "dashboard.insights.budgetControlText",
                params: { avg: avgDailySpend.toFixed(2) },
                severity: "severity-positive",
                icon: "🛡️"
            });
        }
    } else {
        insights.push({
            titleKey: "dashboard.insights.criticalBalanceTitle",
            textKey: "dashboard.insights.criticalBalanceText",
            params: { balance: netBalance.toFixed(2) },
            severity: "severity-high",
            icon: "⚠️"
        });
    }

    if (maxCatName && topCatPerc > 35) {
        insights.push({
            titleKey: "dashboard.insights.categoryWarningTitle",
            textKey: "dashboard.insights.categoryWarningText",
            params: { category: maxCatName, percent: topCatPerc, amount: maxCatTotal.toFixed(2) },
            severity: "severity-medium",
            icon: "📊"
        });
    }

    if (daysLeft <= 7 && daysLeft > 0) {
        insights.push({
            titleKey: "dashboard.insights.paymentApproachingTitle",
            textKey: "dashboard.insights.paymentApproachingText",
            params: { source: nextSal.nextIncome.source || 'Gelir', days: daysLeft },
            severity: "severity-positive",
            icon: "⏳"
        });
    }

    // Dynamic Recurring Payments from Profile
    if (userProfile.recurringPayments) {
        userProfile.recurringPayments.forEach(payment => {
            let targetDate = new Date(now.getFullYear(), now.getMonth(), payment.day);
            if (dayOfMonth > payment.day) {
                targetDate = new Date(now.getFullYear(), now.getMonth() + 1, payment.day);
            }
            const diffTime = targetDate - now;
            const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysUntil >= 0 && daysUntil <= 5) {
                insights.push({
                    titleKey: "dashboard.insights.upcomingPaymentTitle",
                    textKey: "dashboard.insights.upcomingPaymentText",
                    params: { name: payment.name, days: daysUntil },
                    severity: "severity-high",
                    icon: "🔔"
                });
            }
        });
    }

    return insights;
}

export function getWeeklyBreakdown(expenses, weeksCount = 4) {
    const result = [];
    const now = new Date();

    for (let i = 0; i < weeksCount; i++) {
        const start = new Date(now);
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date(now);
        end.setDate(now.getDate() - i * 7);

        const weekExpenses = expenses.filter(exp => {
            const d = parseDate(exp.date);
            return d >= start && d < end;
        });

        const total = weekExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        result.unshift({
            label: `${weeksCount - i}. Hafta`,
            amount: total
        });
    }
    return result;
}

export function getCategoryVsBudget(expenses, userProfile) {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
        const d = parseDate(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const categories = Array.from(new Set(currentMonthExpenses.map(e => e.category)));

    return categories.map(cat => {
        const total = currentMonthExpenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
        return {
            category: cat,
            spent: total,
            budget: 5000 // Placeholder budget
        };
    }).sort((a, b) => b.spent - a.spent);
}
