import { parse } from 'date-fns';

/**
 * Formats a numeric amount as Turkish Lira currency.
 * @param {number} amount - The amount to format.
 * @param {boolean} privacyMode - Whether to mask the value.
 * @returns {string} Formatted currency string or masked value.
 */
export const formatCurrency = (amount, privacyMode = false, locale = 'en-US', currency = 'USD') => {
    if (privacyMode) return '******';
    // Map locale to currency if not provided, or just use defaults. 
    // For this app, let's Stick to TRY but allow formatting changes, OR allow currency switching later.
    // For now, let's keep TRY as the base currency but format it according to locale if needed, 
    // or better: let's stick to Turkish Lira as the *value* but allow the formatter to be flexible if we ever change it.
    // Actually, if the user switches to English, they might still want to see TL if their bank is Turkish.
    // So we will keep 'TRY' as currency but use the passed locale for number formatting.

    // However, if we want to change the DISPLAY, we should probably pass the locale from the component.
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
};

/**
 * Parses a date string in DD.MM.YYYY format using date-fns.
 * @param {string} dateStr - The date string to parse.
 * @returns {Date} Parsed Date object.
 */
export const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    // Assuming the format is always DD.MM.YYYY as per current codebase
    return parse(dateStr, 'dd.MM.yyyy', new Date());
};
