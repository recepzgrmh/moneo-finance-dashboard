import { useState } from 'react';
import { extractTextFromPDF, readJSONFile, validateImportedData } from '../utils/fileHelpers';
import * as AIService from '../services/aiService';

// Bank list with colors
export const BANKS = [
    { name: 'Akbank', color: '#e30a17' },
    { name: 'Ziraat Bankası', color: '#1a7f37' },
    { name: 'Garanti BBVA', color: '#009640' },
    { name: 'Yapı Kredi', color: '#004c99' },
    { name: 'İş Bankası', color: '#0055a4' },
    { name: 'Halkbank', color: '#00529b' },
    { name: 'VakıfBank', color: '#ffc72c' },
    { name: 'DenizBank', color: '#0066b3' },
    { name: 'QNB Finansbank', color: '#772583' },
    { name: 'Enpara', color: '#ff6b00' },
    { name: 'Papara', color: '#6c5ce7' },
    { name: 'Tosla', color: '#00c9a7' },
    { name: 'Diğer', color: '#6b7280' },
];

export const useImport = ({ onImportSuccess }) => {
    const [mode, setMode] = useState('select'); // select, pdf, json, processing, review, bankSelect, confirm, success, error
    const [provider, setProvider] = useState(() => localStorage.getItem('import_provider') || 'gemini');
    const [model, setModel] = useState(() => localStorage.getItem('import_model') || 'gemini-1.5-flash');
    const [apiKey, setApiKey] = useState(() => AIService.getStoredKey('gemini'));
    const [pdfFile, setPdfFile] = useState(null);
    const [rawText, setRawText] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle PDF file selection
    const handlePdfSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setError('');
        } else {
            setError('Lütfen geçerli bir PDF dosyası seçin.');
        }
    };

    // Handle Provider Change
    const setProviderAndKey = (newProvider) => {
        setProvider(newProvider);
        localStorage.setItem('import_provider', newProvider);
        setApiKey(AIService.getStoredKey(newProvider));
    };

    const setModelAndSave = (newModel) => {
        setModel(newModel);
        localStorage.setItem('import_model', newModel);
    };

    // Handle JSON file selection (backup restore)
    const handleJsonSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const data = await readJSONFile(file);

            if (validateImportedData(data)) {
                setParsedData(data);
                setMode('confirm'); // Go to confirm mode to ask merge or replace
            } else {
                setError('Dosya formatı geçersiz. Lütfen doğru yedek dosyasını yükleyin.');
                setMode('error');
            }
        } catch (err) {
            setError(err.message);
            setMode('error');
        } finally {
            setLoading(false);
        }
    };

    // Detect bank name from filename
    const detectBankFromFilename = (filename) => {
        const lowerName = filename.toLowerCase();
        const banks = [
            { keywords: ['akbank', 'ak bank'], name: 'Akbank', colorClass: 'bank-akbank' },
            { keywords: ['ziraat', 'tc ziraat'], name: 'Ziraat Bankası', colorClass: 'bank-ziraat' },
            { keywords: ['garanti', 'bbva'], name: 'Garanti BBVA', colorClass: 'bank-garanti' },
            { keywords: ['yapı kredi', 'yapikredi', 'ykb'], name: 'Yapı Kredi', colorClass: 'bank-yapikredi' },
            { keywords: ['isbank', 'iş bankası', 'is bankasi'], name: 'İş Bankası', colorClass: 'bank-isbank' },
            { keywords: ['halkbank', 'halk bank'], name: 'Halkbank', colorClass: 'bank-halkbank' },
            { keywords: ['vakifbank', 'vakıfbank'], name: 'VakıfBank', colorClass: 'bank-vakifbank' },
            { keywords: ['denizbank', 'deniz bank'], name: 'DenizBank', colorClass: 'bank-denizbank' },
            { keywords: ['qnb', 'finansbank', 'finans bank'], name: 'QNB Finansbank', colorClass: 'bank-qnb' },
            { keywords: ['enpara', 'en para'], name: 'Enpara', colorClass: 'bank-enpara' },
            { keywords: ['papara'], name: 'Papara', colorClass: 'bank-papara' },
            { keywords: ['tosla'], name: 'Tosla', colorClass: 'bank-tosla' },
        ];

        for (const bank of banks) {
            if (bank.keywords.some(kw => lowerName.includes(kw))) {
                return bank;
            }
        }
        return { name: 'Bilinmeyen Banka', colorClass: 'bank-default' };
    };

    // Process PDF with AI
    const handlePdfProcess = async () => {
        if (!pdfFile) return setError('Lütfen önce bir PDF yükleyin.');
        if (!apiKey) return setError(`${provider.toUpperCase()} API Key gerekli.`);

        setLoading(true);
        setError('');
        setMode('processing');

        try {
            // Step 0: Detect bank from filename
            const detectedBank = detectBankFromFilename(pdfFile.name);

            // Step 1: Extract text from PDF
            const text = await extractTextFromPDF(pdfFile);
            setRawText(text);

            // Step 2: Send to Gemini for parsing
            const parsed = await AIService.parseBankStatement(provider, model, apiKey, text);

            if (parsed && parsed.expenses) {
                // Step 3: Attach detected bank to accounts
                const enrichedData = {
                    ...parsed,
                    detectedBank: detectedBank,
                    accounts: parsed.accounts?.length > 0
                        ? parsed.accounts.map(acc => ({ ...acc, bank: detectedBank.name, colorClass: detectedBank.colorClass }))
                        : [{ bank: detectedBank.name, type: 'Kredi Kartı', debt: 0, totalLimit: 0, colorClass: detectedBank.colorClass }]
                };
                setParsedData(enrichedData);
                setMode('review');
            } else {
                throw new Error('AI veriden anlamlı bir çıktı üretemedi.');
            }
        } catch (err) {
            setError(err.message || 'İşlem sırasında bir hata oluştu.');
            setMode('error');
        } finally {
            setLoading(false);
        }
    };

    // Go to bank selection mode
    const handleGoToBankSelect = () => {
        if (parsedData) {
            // Pre-select detected bank if exists
            if (parsedData.detectedBank) {
                setSelectedBank(parsedData.detectedBank.name);
            }
            setMode('bankSelect');
        }
    };

    // Handle bank selection and go to confirm
    const handleBankSelected = (bankName) => {
        setSelectedBank(bankName);
        // Update parsedData with selected bank
        const bank = BANKS.find(b => b.name === bankName) || { name: bankName, color: '#6b7280' };
        setParsedData(prev => ({
            ...prev,
            detectedBank: { name: bank.name, color: bank.color },
            accounts: prev.accounts?.map(acc => ({ ...acc, bank: bank.name })) || [{ bank: bank.name, type: 'Kredi Kartı', debt: 0, totalLimit: 0 }]
        }));
        setMode('confirm');
    };

    // Final import with mode
    const handleFinalImport = (importMode) => {
        if (parsedData) {
            onImportSuccess(parsedData, importMode); // 'replace' or 'merge'
            setMode('success');
        }
    };

    return {
        // State
        mode,
        provider,
        model,
        apiKey,
        pdfFile,
        rawText,
        parsedData,
        selectedBank,
        error,
        loading,

        // Actions
        setMode,
        setProvider: setProviderAndKey,
        setModel: setModelAndSave,
        setApiKey,
        handlePdfSelect,
        handleJsonSelect,
        handlePdfProcess,
        handleGoToBankSelect,
        handleBankSelected,
        handleFinalImport,

        // Constants
        BANKS
    };
};
