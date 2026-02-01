import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Target, X, Check } from 'lucide-react';
import PropTypes from 'prop-types';
import { useGoals } from '../../hooks/useGoals';
import { formatCurrency } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import './GoalsView.css';

const GoalsView = ({ userProfile, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const {
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
    } = useGoals(userProfile);

    const toggleFormButton = (
        <button className="btn-glass btn-primary-glow" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? t('goals.cancel') : t('goals.addNew')}
        </button>
    );

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('goals.title')}
                subtitle={t('goals.subtitle')}
                actions={toggleFormButton}
            />

            {/* Deposit Modal Overlay */}
            {selectedGoal && (
                <div className="deposit-overlay">
                    <SectionCard title={t('goals.depositTitle', { title: selectedGoal.title })} className="deposit-card">
                        <input
                            className="api-input deposit-input"
                            type="number"
                            placeholder={t('goals.amountPlaceholder')}
                            value={depositAmount}
                            autoFocus
                            onChange={(e) => setDepositAmount(e.target.value)}
                        />
                        <div className="deposit-actions">
                            <button className="btn-glass" onClick={() => setSelectedGoal(null)}>{t('common.cancel')}</button>
                            <button className="btn-glass btn-primary-glow" onClick={handleDeposit}>{t('common.confirm')}</button>
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* Add Goal Form */}
            {showForm && (
                <SectionCard title={t('goals.defineNew')} className="goals-form-card">
                    <div className="goals-form-grid">
                        <div>
                            <label className="goals-form-label">{t('goals.goalName')}</label>
                            <input className="api-input" type="text" placeholder={t('goals.namePlaceholder')} value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="goals-form-label">{t('goals.goalAmount')}</label>
                            <input className="api-input" type="number" placeholder={t('goals.targetPlaceholder')} value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} />
                        </div>
                        <div>
                            <label className="goals-form-label">{t('goals.startAmount')}</label>
                            <input className="api-input" type="number" placeholder={t('goals.startPlaceholder')} value={newGoal.current} onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })} />
                        </div>
                    </div>
                    <div className="goals-form-actions">
                        <button className="btn-glass btn-primary-glow" onClick={handleAddGoal}><Check size={18} /> {t('common.save')}</button>
                    </div>
                </SectionCard>
            )}

            {/* Main Salary Goal (Hero) */}
            <div className="goal-hero">
                <h2>{t('goals.mainGoal')}: {goalProgress.titleText}</h2>
                <div className="goal-hero-days">{goalProgress.daysLeft} {t('goals.daysLeft')}</div>
                <div className="progress-container goal-progress-hero">
                    <div className="progress-bar goal-progress-bar-hero" style={{ width: `${goalProgress.progress}%`, backgroundColor: goalProgress.isSalaryTarget && goalProgress.daysLeft <= 3 ? 'var(--danger)' : 'var(--success)' }}></div>
                </div>
            </div>

            {/* Custom Goals Grid */}
            <div className="custom-goals-grid">
                {goals.map((goal) => {
                    const percent = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
                    const isCompleted = percent >= 100;

                    return (
                        <div key={goal.id} className="stat-card" style={{ border: isCompleted ? '1px solid var(--success)' : '' }}>
                            <div className="goal-item-header">
                                <div className="goal-title-wrapper">
                                    <Target size={16} color={isCompleted ? "var(--success)" : "var(--secondary)"} />
                                    {goal.title}
                                </div>
                                <button onClick={() => handleDelete(goal.id)} className="goal-delete-btn"><Trash2 size={16} /></button>
                            </div>

                            <div className="goal-amount-display">
                                {formatCurrency(goal.current, false, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}
                                <span className="goal-amount-target"> / {formatCurrency(goal.target, false, i18n.language === 'tr' ? 'tr-TR' : 'en-US', currency)}</span>
                            </div>

                            <div className="w-progress-bg">
                                <div className="w-progress-fill goal-progress-transition" style={{ width: `${percent}%`, backgroundColor: isCompleted ? 'var(--success)' : goal.color }}></div>
                            </div>

                            <div className="goal-footer">
                                <div className="goal-status-text" style={{ color: isCompleted ? 'var(--success)' : 'var(--text-muted)' }}>
                                    {isCompleted ? t('goals.completed') : t('goals.percentCompleted', { percent: percent.toFixed(0) })}
                                </div>
                                {!isCompleted && (
                                    <button
                                        className="btn-glass goal-add-btn"
                                        onClick={() => setSelectedGoal(goal)}
                                    >
                                        <Plus size={14} /> {t('goals.addMoney')}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {goals.length === 0 && !showForm && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    <p>{t('goals.emptyState')}</p>
                </div>
            )}
        </div>
    );
};

GoalsView.propTypes = {
    userProfile: PropTypes.object.isRequired
};

export default GoalsView;
