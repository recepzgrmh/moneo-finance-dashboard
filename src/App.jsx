import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard/Dashboard';
import AIView from './views/AI/AIView';
import AccountsView from './views/Accounts/AccountsView';
import GoalsView from './views/Goals/GoalsView';
import IncomesView from './views/Incomes/IncomesView';
import ExpensesView from './views/Expenses/ExpensesView';
import SubscriptionsView from './views/Subscriptions/SubscriptionsView';
import ImportView from './views/Import/ImportView';
import WelcomeScreen from './views/Welcome/WelcomeScreen';
import ProfileView from './views/Profile/ProfileView';
import ThemeSelector from './components/ThemeSelector';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"
import { expenses as defaultExpenses, incomes as defaultIncomes, accounts as defaultAccounts, cash as defaultCash } from './data';
import * as Finance from './utils/financeEngine';
import { loadFromLocalStorage, saveToLocalStorage, downloadAsJSON } from './utils/fileHelpers';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper for lightening/darkening color (to generate background from primary)
const adjustColor = (color, amount) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

// Calculate contrast text color (black or white)
const getContrastColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  // YIQ equation
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

function App() {
  // ... (previous state declarations)
  const storedData = loadFromLocalStorage();
  const hasStoredData = storedData && (storedData.expenses?.length > 0 || storedData.incomes?.length > 0);

  const [isFirstVisit, setIsFirstVisit] = useState(!hasStoredData);
  const [languageSet, setLanguageSet] = useState(() => localStorage.getItem('app_lang_set') === 'true');
  const [currentView, setCurrentView] = useState('overview');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'default');
  const [privacyMode, setPrivacyMode] = useState(() => localStorage.getItem('privacy_mode') === 'true');
  const [customColor, setCustomColor] = useState(() => localStorage.getItem('custom_color') || '#6366f1');
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'TRY');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle privacy mode
  const togglePrivacy = useCallback(() => {
    setPrivacyMode(prev => {
      const newVal = !prev;
      localStorage.setItem('privacy_mode', newVal.toString());
      return newVal;
    });
  }, []);

  // Default Profile
  const defaultProfile = {
    userName: 'Kullanıcı',
    salary1: { day: 1, amount: 0, label: 'Income 1' },
    salary2: { day: 15, amount: 0, label: 'Income 2' },
    recurringPayments: []
  };

  const [userProfile, setUserProfile] = useState(() => {
    return storedData?.userProfile || defaultProfile;
  });

  // Load data from localStorage, fallback to empty arrays, ensure IDs exist
  const [expenses, setExpenses] = useState(() => {
    const raw = storedData?.expenses || defaultExpenses;
    return raw.map(e => e.id ? e : { ...e, id: generateId() });
  });

  const [incomes, setIncomes] = useState(() => {
    const raw = storedData?.incomes || defaultIncomes;
    return raw.map(i => i.id ? i : { ...i, id: generateId() });
  });

  const [accounts, setAccounts] = useState(() => {
    return storedData?.accounts || defaultAccounts;
  });

  const [cash, setCash] = useState(() => {
    return storedData?.cash ?? defaultCash;
  });

  // Derived State (Calculations)
  const totals = useMemo(() => Finance.calculateTotals(incomes, expenses), [incomes, expenses]);
  const goalProgress = useMemo(() => Finance.calculateGoalProgress(userProfile), [userProfile]);
  const nextSalary = useMemo(() => Finance.calculateNextSalaryInfo(userProfile), [userProfile]);
  const dailyLimit = useMemo(() => Finance.calculateDailyLimit(totals.netBalance, nextSalary.targetDate), [totals.netBalance, nextSalary.targetDate]);

  const chartData = useMemo(() => Finance.getChartData(expenses), [expenses]);

  const insights = useMemo(() => Finance.generateAnalyticInsights(
    expenses, totals.totalExpense, totals.netBalance, chartData.categoryMap, dailyLimit, userProfile
  ), [expenses, totals, chartData, dailyLimit, userProfile]);

  const { groups, sortedDates } = useMemo(() => Finance.groupExpensesByDate(expenses), [expenses]);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);

    if (theme === 'custom') {
      document.body.style.setProperty('--user-color', customColor);
      const rgb = hexToRgb(customColor);

      if (rgb) {
        document.body.style.setProperty('--user-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

        const contrast = getContrastColor(customColor);
        const isLight = contrast === '#000000'; // If contrast is black, bg is light
        const isUserColorDark = !isLight;

        if (isUserColorDark) {
          // Dark background - Text is light
          document.body.style.setProperty('--bg-body', customColor);

          // Cards slightly lighter or semi-transparent user color
          document.body.style.setProperty('--bg-sidebar', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)`);
          document.body.style.setProperty('--bg-card', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
          document.body.style.setProperty('--bg-card-hover', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);

          document.body.style.setProperty('--text-main', '#ffffff');
          document.body.style.setProperty('--text-muted', 'rgba(255,255,255,0.7)');
          document.body.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');

          // Primary color needs to stand out. If BG is colored, White is good, or a lighter/brighter shift.
          // Let's use White for primary elements to ensure readability on colored background.
          document.body.style.setProperty('--primary', '#ffffff');

        } else {
          // Light background - Text is dark
          document.body.style.setProperty('--bg-body', customColor);

          document.body.style.setProperty('--bg-sidebar', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)`);
          document.body.style.setProperty('--bg-card', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
          document.body.style.setProperty('--bg-card-hover', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);

          document.body.style.setProperty('--text-main', '#121212');
          document.body.style.setProperty('--text-muted', 'rgba(0,0,0,0.6)');
          document.body.style.setProperty('--border-color', 'rgba(0,0,0,0.1)');

          // On light colored background, Black primary is solid.
          document.body.style.setProperty('--primary', '#000000');
        }
      }
    } else {
      document.body.style.removeProperty('--user-color');
      document.body.style.removeProperty('--user-rgb');

      // Remove overrides
      document.body.style.removeProperty('--bg-body');
      document.body.style.removeProperty('--bg-sidebar');
      document.body.style.removeProperty('--bg-card');
      document.body.style.removeProperty('--bg-card-hover');
      document.body.style.removeProperty('--text-main');
      document.body.style.removeProperty('--text-muted');
      document.body.style.removeProperty('--primary');
      document.body.style.removeProperty('--border-color');
    }
  }, [theme, customColor]);

  // Save custom color to local storage
  useEffect(() => {
    localStorage.setItem('custom_color', customColor);
  }, [customColor]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage({ expenses, incomes, accounts, cash, userProfile });
  }, [expenses, incomes, accounts, cash, userProfile]);

  // Handle data import from ImportView
  const handleImportSuccess = useCallback((newData, mode = 'replace') => {
    const processedExpenses = (newData.expenses || []).map(e => ({
      ...e,
      id: e.id || generateId(),
      amount: Number(e.amount)
    }));
    const processedIncomes = (newData.incomes || []).map(i => ({
      ...i,
      id: i.id || generateId(),
      amount: Number(i.amount)
    }));

    if (mode === 'merge') {
      setExpenses(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const existingKeys = new Set(prev.map(e => `${e.date}-${e.amount}-${e.desc}`));
        const uniqueNew = processedExpenses.filter(e =>
          !existingIds.has(e.id) && !existingKeys.has(`${e.date}-${e.amount}-${e.desc}`)
        );
        return [...prev, ...uniqueNew];
      });

      setIncomes(prev => {
        const existingIds = new Set(prev.map(i => i.id));
        const existingKeys = new Set(prev.map(i => `${i.date}-${i.amount}-${i.desc}`));
        const uniqueNew = processedIncomes.filter(i =>
          !existingIds.has(i.id) && !existingKeys.has(`${i.date}-${i.amount}-${i.desc}`)
        );
        return [...prev, ...uniqueNew];
      });

      // Synchronize balances if new expenses/accounts are added
      if (newData.accounts) {
        setAccounts(prev => {
          // Merge logic for accounts: update if same bank/type exists, else add
          const updated = [...prev];
          newData.accounts.forEach(newAcc => {
            const idx = updated.findIndex(a => a.bank === newAcc.bank && a.type === newAcc.type);
            if (idx > -1) updated[idx] = newAcc;
            else updated.push(newAcc);
          });
          return updated;
        });
      }
      if (newData.cash !== undefined) setCash(prev => prev + Number(newData.cash));
    } else {
      setExpenses(processedExpenses);
      setIncomes(processedIncomes);
      if (newData.accounts) setAccounts(newData.accounts);
      if (newData.cash !== undefined) setCash(Number(newData.cash));
      if (newData.userProfile) setUserProfile(newData.userProfile);
    }
    setCurrentView('overview');
  }, []);

  // Handle data export (backup download)
  const handleExportData = useCallback(() => {
    const dataToExport = { expenses, incomes, accounts, cash, userProfile };
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAsJSON(dataToExport, `mali_yedek_${dateStr}.json`);
  }, [expenses, incomes, accounts, cash, userProfile]);

  // Handle clearing all data
  const handleClearData = useCallback(() => {
    setExpenses([]);
    setIncomes([]);
    setAccounts([]);
    setCash(0);
    setUserProfile(defaultProfile);
    localStorage.clear();
    setIsFirstVisit(true);
    setCurrentView('overview');
  }, []);

  // Show welcome screen for first-time users
  if (isFirstVisit) {
    return (
      <div className="app-container" style={{ display: 'flex', width: '100%', height: '100%' }} data-theme={theme}>
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
        <main className="main-content" style={{ width: '100%' }}>
          <WelcomeScreen
            onUpdateTheme={setTheme}
            onGetStarted={(data) => {
              setIsFirstVisit(false);
              // Handle legacy string pass or new object pass
              if (typeof data === 'string') {
                setCurrency(data);
              } else {
                if (data.currency) setCurrency(data.currency);
                if (data.theme) setTheme(data.theme);
                if (data.userProfile) setUserProfile(prev => ({ ...prev, ...data.userProfile }));
              }
              // Go to overview instead of import for smoother entry
              setCurrentView('overview');
            }}
            onSkip={() => setIsFirstVisit(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', height: '100%' }} data-theme={theme}>
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <SpeedInsights />
      <Analytics />

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-backdrop active"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false); // Close mobile menu when navigating
        }}
        onOpenTheme={() => setShowThemeModal(true)}
        onExportData={handleExportData}
        privacyMode={privacyMode}
        onTogglePrivacy={togglePrivacy}
        onClearData={handleClearData}
        userName={userProfile.userName}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {showThemeModal && (
        <ThemeSelector
          currentTheme={theme}
          customColor={customColor}
          onSelect={(t) => {
            setTheme(t);
            localStorage.setItem('app_theme', t);
          }}
          onUpdateCustomColor={setCustomColor}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      <main className="main-content">
        {currentView === 'overview' && (
          <Dashboard
            totals={totals}
            dailyLimit={dailyLimit}
            nextSalary={nextSalary}
            goalProgress={goalProgress}
            insights={insights}
            expensesGroups={groups}
            sortedDates={sortedDates}
            chartData={chartData}
            onOpenAI={() => setCurrentView('ai')}
            theme={theme}
            incomes={incomes}
            expenses={expenses}
            privacyMode={privacyMode}
            userProfile={userProfile}
            currency={currency}
          />
        )}

        {currentView === 'ai' && (
          <AIView
            financialData={{
              totals,
              expenses,
              incomes,
              nextSalary,
              accounts,
              cash
            }}
            userProfile={userProfile}
            currency={currency}
          />
        )}

        {currentView === 'subscriptions' && (
          <SubscriptionsView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            currency={currency}
          />
        )}

        {currentView === 'accounts' && (
          <AccountsView
            accounts={accounts}
            cash={cash}
            expenses={expenses}
            incomes={incomes}
            onUpdateCash={setCash}
            onUpdateAccounts={setAccounts}
            privacyMode={privacyMode}
            currency={currency}
          />
        )}
        {currentView === 'expenses' && <ExpensesView expenses={expenses} privacyMode={privacyMode} currency={currency} />}
        {currentView === 'incomes' && <IncomesView incomes={incomes} privacyMode={privacyMode} currency={currency} />}
        {currentView === 'goals' && <GoalsView userProfile={userProfile} currency={currency} />}
        {currentView === 'import' && <ImportView onImportSuccess={handleImportSuccess} />}
        {currentView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}
      </main>
    </div>
  );
}

export default App;
