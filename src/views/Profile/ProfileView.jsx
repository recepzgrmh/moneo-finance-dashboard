import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { User, Save, Check } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import './ProfileView.css';

const ProfileView = ({ userProfile, onUpdateProfile }) => {
    const { t } = useTranslation();
    const {
        profile,
        saved,
        setProfile,
        handleSave
    } = useProfile(userProfile, onUpdateProfile);

    const saveAction = (
        <button className="btn-glass btn-primary-glow" onClick={handleSave}>
            {saved ? <><Check size={18} /> {t('common.saved')}</> : <><Save size={18} /> {t('common.save')}</>}
        </button>
    );

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('profile.title')}
                subtitle={t('profile.subtitle')}
                icon={User}
                actions={saveAction}
            />

            <div className="lower-grid">
                {/* Salary Info */}
                <SectionCard title={t('profile.salarySection')}>
                    <div className="profile-section-mb">
                        <label className="profile-label">{t('profile.username')}</label>
                        <input
                            type="text"
                            className="api-input"
                            value={profile.userName}
                            onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                        />
                    </div>

                    <div className="profile-input-grid">
                        <div>
                            <label className="profile-label">{t('profile.salary1Label')}</label>
                            <input
                                type="text"
                                className="api-input"
                                value={profile.salary1.label}
                                onChange={(e) => setProfile({ ...profile, salary1: { ...profile.salary1, label: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="profile-label">{t('profile.salary1Day')}</label>
                            <input
                                type="number"
                                className="api-input"
                                min="1" max="31"
                                value={profile.salary1.day}
                                onChange={(e) => setProfile({ ...profile, salary1: { ...profile.salary1, day: Number(e.target.value) } })}
                            />
                        </div>
                    </div>
                    <div className="profile-section-mb">
                        <label className="profile-label">{t('profile.salary1Amount')}</label>
                        <input
                            type="number"
                            className="api-input"
                            value={profile.salary1.amount}
                            onChange={(e) => setProfile({ ...profile, salary1: { ...profile.salary1, amount: Number(e.target.value) } })}
                        />
                    </div>

                    <div className="profile-input-grid">
                        <div>
                            <label className="profile-label">{t('profile.salary2Label')}</label>
                            <input
                                type="text"
                                className="api-input"
                                value={profile.salary2.label}
                                onChange={(e) => setProfile({ ...profile, salary2: { ...profile.salary2, label: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="profile-label">{t('profile.salary2Day')}</label>
                            <input
                                type="number"
                                className="api-input"
                                min="1" max="31"
                                value={profile.salary2.day}
                                onChange={(e) => setProfile({ ...profile, salary2: { ...profile.salary2, day: Number(e.target.value) } })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="profile-label">{t('profile.salary2Amount')}</label>
                        <input
                            type="number"
                            className="api-input"
                            value={profile.salary2.amount}
                            onChange={(e) => setProfile({ ...profile, salary2: { ...profile.salary2, amount: Number(e.target.value) } })}
                        />
                    </div>
                </SectionCard>

                {/* Recurring Payments */}

            </div>
        </div>
    );
};

ProfileView.propTypes = {
    userProfile: PropTypes.object.isRequired,
    onUpdateProfile: PropTypes.func.isRequired
};

export default ProfileView;
