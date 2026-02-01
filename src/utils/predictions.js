/**
 * Prediction and Forecasting Utilities
 * Mathematical algorithms for financial predictions
 */

/**
 * Linear Regression for trend prediction
 * @param {Array<number>} values - Historical values
 * @returns {Object} - { slope, intercept, predict }
 */
export function linearRegression(values) {
    const n = values.length;
    if (n < 2) return { slope: 0, intercept: values[0] || 0, predict: (x) => values[0] || 0 };

    const x = values.map((_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope,
        intercept,
        predict: (x) => slope * x + intercept
    };
}

/**
 * Calculate moving average
 * @param {Array<number>} values - Data points
 * @param {number} window - Window size
 * @returns {number} - Moving average
 */
export function movingAverage(values, window = 3) {
    if (values.length < window) return values.reduce((a, b) => a + b, 0) / values.length;

    const recent = values.slice(-window);
    return recent.reduce((a, b) => a + b, 0) / window;
}

/**
 * Calculate trend from recent data
 * @param {Array<number>} values - Recent values
 * @returns {number} - Trend direction and magnitude
 */
export function calculateTrend(values) {
    if (values.length < 2) return 0;

    const regression = linearRegression(values);
    return regression.slope;
}

/**
 * Predict future expense based on historical data
 * @param {Array<{month: string, total: number}>} monthlyData - Historical monthly totals
 * @returns {Object} - { predicted, min, max, confidence }
 */
export function predictNextMonthExpense(monthlyData) {
    if (!monthlyData || monthlyData.length < 2) {
        return { predicted: 0, min: 0, max: 0, confidence: 0 };
    }

    const values = monthlyData.map(m => m.total);
    const regression = linearRegression(values);

    const predicted = regression.predict(values.length);
    const confidence = predicted * 0.15; // ±15% confidence interval

    return {
        predicted: Math.max(0, predicted),
        min: Math.max(0, predicted - confidence),
        max: predicted + confidence,
        confidence: 0.85 // 85% confidence
    };
}

/**
 * Calculate budget depletion timeline
 * @param {number} currentSpent - Amount spent so far this month
 * @param {number} budget - Total monthly budget
 * @param {number} currentDay - Current day of month
 * @param {number} daysInMonth - Total days in month
 * @returns {Object} - Depletion info
 */
export function calculateBudgetDepletion(currentSpent, budget, currentDay, daysInMonth) {
    const remaining = budget - currentSpent;
    const daysRemaining = daysInMonth - currentDay;

    if (currentDay === 0) {
        return {
            daysLeft: daysInMonth,
            depletionDate: null,
            safeSpendingRate: budget / daysInMonth,
            currentSpendingRate: 0,
            isOnTrack: true,
            percentUsed: 0
        };
    }

    const dailyAverage = currentDay > 0 ? currentSpent / currentDay : 0;
    const daysUntilDepletion = (remaining > 0 && dailyAverage > 0) ? Math.floor(remaining / dailyAverage) : 0;
    const safeSpendingRate = remaining / Math.max(daysRemaining, 1);

    return {
        daysLeft: daysUntilDepletion,
        depletionDate: daysUntilDepletion > 0 ? addDays(new Date(), daysUntilDepletion) : new Date(),
        safeSpendingRate: Math.max(0, safeSpendingRate),
        currentSpendingRate: dailyAverage,
        isOnTrack: budget > 0 ? dailyAverage <= (budget / daysInMonth) : true,
        percentUsed: budget > 0 ? (currentSpent / budget) * 100 : 0
    };
}

/**
 * Predict goal completion date
 * @param {Object} goal - Goal object
 * @param {number} monthlySavings - Monthly net savings
 * @returns {Object} - Prediction info
 */
export function predictGoalCompletion(goal, monthlySavings) {
    if (!goal || monthlySavings <= 0) {
        return {
            completionDate: null,
            monthsRemaining: Infinity,
            requiredMonthlySaving: 0,
            isPossible: false
        };
    }

    const remaining = goal.target - goal.current;
    if (remaining <= 0) {
        return {
            completionDate: new Date(),
            monthsRemaining: 0,
            requiredMonthlySaving: 0,
            isPossible: true,
            isCompleted: true
        };
    }

    const monthsNeeded = Math.ceil(remaining / monthlySavings);

    return {
        completionDate: addMonths(new Date(), monthsNeeded),
        monthsRemaining: monthsNeeded,
        requiredMonthlySaving: remaining / monthsNeeded,
        isPossible: true,
        isCompleted: false
    };
}

/**
 * Project net income for future months
 * @param {Array<{income: number, expense: number}>} historicalData - Last N months
 * @param {number} months - How many months to project
 * @returns {Array} - Projected data
 */
export function projectNetIncome(historicalData, months = 6) {
    if (!historicalData || historicalData.length < 2) {
        return Array(months).fill(0).map((_, i) => ({
            month: addMonths(new Date(), i + 1),
            net: 0,
            income: 0,
            expense: 0
        }));
    }

    const netValues = historicalData.map(d => d.income - d.expense);
    const incomeValues = historicalData.map(d => d.income);
    const expenseValues = historicalData.map(d => d.expense);

    const netRegression = linearRegression(netValues);
    const incomeRegression = linearRegression(incomeValues);
    const expenseRegression = linearRegression(expenseValues);

    const projections = [];
    const baseIndex = historicalData.length;

    for (let i = 0; i < months; i++) {
        const futureIndex = baseIndex + i;
        const projectedIncome = Math.max(0, incomeRegression.predict(futureIndex));
        const projectedExpense = Math.max(0, expenseRegression.predict(futureIndex));

        projections.push({
            month: addMonths(new Date(), i + 1),
            income: projectedIncome,
            expense: projectedExpense,
            net: projectedIncome - projectedExpense
        });
    }

    return projections;
}

/**
 * Helper: Add days to date
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Helper: Add months to date
 */
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Calculate daily spending heatmap data
 * @param {Array} expenses - All expenses
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {Array} - Heatmap data points
 */
export function calculateDailyHeatmap(expenses, month, year, parseDateFn = (d) => new Date(d)) {
    const dailyTotals = {};

    expenses
        .filter(exp => {
            const expDate = parseDateFn(exp.date);
            return expDate.getMonth() === month && expDate.getFullYear() === year;
        })
        .forEach(exp => {
            const date = parseDateFn(exp.date);
            const dayKey = date.toISOString().split('T')[0];
            dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + exp.amount;
        });

    return Object.entries(dailyTotals).map(([date, value]) => {
        const d = new Date(date);
        return {
            x: date,
            y: d.getDay(), // 0 = Sunday, 6 = Saturday
            d: value // Amount spent
        };
    });
}
