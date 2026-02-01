import { useState } from 'react';

export const useProfile = (userProfile, onUpdateProfile) => {
    const [profile, setProfile] = useState(JSON.parse(JSON.stringify(userProfile)));
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        onUpdateProfile(profile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addRecurring = () => {
        const newRec = {
            id: 'rec_' + Date.now(),
            day: 1,
            amount: 0,
            name: 'Yeni Ödeme',
            category: 'Diğer'
        };
        setProfile({
            ...profile,
            recurringPayments: [...(profile.recurringPayments || []), newRec]
        });
    };

    const removeRecurring = (id) => {
        setProfile({
            ...profile,
            recurringPayments: profile.recurringPayments.filter(r => r.id !== id)
        });
    };

    const updateRecurring = (id, field, value) => {
        setProfile({
            ...profile,
            recurringPayments: profile.recurringPayments.map(r =>
                r.id === id ? { ...r, [field]: field === 'day' ? Number(value) : value } : r
            )
        });
    };

    // Helper to update top-level profile fields deeply if needed, or specific salary fields
    // But since the UI updates simple nested fields manually, we can expose a general setter or specific handlers.
    // To match original code structure, we expose setProfile directly or create specific handlers.
    // The original code used setProfile directly for inputs.
    // Let's create a safer updating mechanism if possible, but for now copying strict logic.

    return {
        profile,
        saved,
        setProfile, // Exposure needed for direct input mutations in UI
        handleSave,
        addRecurring,
        removeRecurring,
        updateRecurring
    };
};
