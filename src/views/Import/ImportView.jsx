import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Upload, FileJson, FileText, Check, AlertCircle, Loader, Key, Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useImport } from '../../hooks/useImport';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';

import './ImportView.css';

const MODELS = {
    gemini: [
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (En Güçlü)' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Hızlı & Dengeli)' },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Geniş Kullanım)' },
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (En Ucuz)' }
    ],
    openai: [
        { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro (En Güçlü)' },
        { id: 'gpt-5.2', name: 'GPT-5.2 (Dengeli)' },
        { id: 'gpt-5-mini', name: 'GPT-5 Mini (Ucuz)' },
        { id: 'gpt-5-nano', name: 'GPT-5 Nano (En Ucuz)' }
    ],
    anthropic: [
        { id: 'claude-opus-4-5', name: 'Claude Opus 4.5 (Premium)' },
        { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (Dengeli)' },
        { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (Hızlı)' }
    ],
    deepseek: [
        { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (Thinking Mode)' },
        { id: 'deepseek-chat', name: 'DeepSeek Chat (Genel Kullanım)' }
    ]
};

const ImportView = ({ onImportSuccess }) => {
    const { t } = useTranslation();
    const {
        mode,
        provider,
        model,
        apiKey,
        pdfFile,
        parsedData,
        selectedBank,
        error,

        setMode,
        setProvider,
        setModel,
        setApiKey,
        handlePdfSelect,
        handleJsonSelect,
        handlePdfProcess,
        handleGoToBankSelect,
        handleBankSelected,
        handleFinalImport,

        BANKS
    } = useImport({ onImportSuccess });

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('import.title')}
                subtitle={t('import.subtitle')}
                icon={Upload}
            />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Mode Selection */}
                {mode === 'select' && (
                    <div className="import-options-grid">
                        {/* PDF Option */}
                        <div
                            className="import-card pdf"
                            onClick={() => setMode('pdf')}
                        >
                            <div className="icon-wrapper pdf">
                                <FileText size={32} color="var(--primary)" />
                            </div>
                            <h3 className="card-title">{t('import.optionPdf')}</h3>
                            <p className="card-desc">
                                {t('import.optionPdfDesc')}
                            </p>
                            <div className="card-badge pdf">
                                <Key size={12} className="badge-icon" />
                                {t('import.optionPdfBadge')}
                            </div>
                        </div>

                        {/* JSON Backup Option */}
                        <div
                            className="import-card json"
                            onClick={() => setMode('json')}
                        >
                            <div className="icon-wrapper json">
                                <FileJson size={32} color="var(--success)" />
                            </div>
                            <h3 className="card-title">{t('import.optionJson')}</h3>
                            <p className="card-desc">
                                {t('import.optionJsonDesc')}
                            </p>
                            <div className="card-badge json">
                                <Check size={12} className="badge-icon" />
                                {t('import.optionJsonBadge')}
                            </div>
                        </div>
                    </div>
                )}

                {/* PDF Upload Mode */}
                {mode === 'pdf' && (
                    <SectionCard className="match-height section-content">
                        <h2 className="section-header">
                            <Sparkles size={20} className="header-icon" />
                            {t('import.pdfModeTitle')}
                        </h2>

                        {/* API Key Input */}
                        {/* Provider & Model Selection */}
                        <div className="form-group">
                            <label className="form-label">{t('ai.provider') || 'Sağlayıcı'}</label>
                            <select
                                className="api-input"
                                value={provider}
                                onChange={(e) => {
                                    const newProvider = e.target.value;
                                    setProvider(newProvider);
                                    // Reset model if not in the new provider's list
                                    if (!MODELS[newProvider].some(m => m.id === model)) {
                                        setModel(MODELS[newProvider][0].id);
                                    }
                                }}
                                style={{ marginBottom: '1rem' }}
                            >
                                <option value="gemini">Google Gemini</option>
                                <option value="openai">OpenAI ChatGPT</option>
                                <option value="anthropic">Anthropic Claude</option>
                                <option value="deepseek">DeepSeek AI</option>
                            </select>

                            <label className="form-label">{t('ai.model') || 'Model'}</label>
                            <select
                                className="api-input"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                style={{ marginBottom: '1rem' }}
                            >
                                {MODELS[provider]?.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>

                            <label className="form-label">
                                {t('ai.apiKey', { provider: provider.toUpperCase() }) || `${provider.toUpperCase()} API Key`}
                            </label>
                            <input
                                type="password"
                                className="api-input"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder={provider === 'gemini' ? "AIzaSy..." : "sk-..."}
                            />
                        </div>

                        {/* File Upload */}
                        <div className="form-group">
                            <label className="form-label">
                                {t('import.pdfFileLabel')}
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handlePdfSelect}
                                style={{ display: 'none' }}
                                id="pdf-upload"
                            />
                            <label
                                htmlFor="pdf-upload"
                                className="btn-glass"
                                style={{ display: 'inline-flex', cursor: 'pointer', padding: '1rem 2rem' }}
                            >
                                <Upload size={18} style={{ marginRight: '0.5rem' }} />
                                {pdfFile ? pdfFile.name : t('import.pdfSelect')}
                            </label>
                        </div>

                        {error && (
                            <div className="error-message">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div className="action-buttons">
                            <button className="btn-glass" onClick={() => setMode('select')}>
                                {t('import.back')}
                            </button>
                            <button
                                className="btn-glass btn-primary-glow"
                                onClick={handlePdfProcess}
                                disabled={!pdfFile || !apiKey}
                                style={{ opacity: (!pdfFile || !apiKey) ? 0.5 : 1 }}
                            >
                                <Sparkles size={18} /> {t('import.analyze')}
                            </button>
                        </div>
                    </SectionCard>
                )}

                {/* JSON Upload Mode */}
                {mode === 'json' && (
                    <SectionCard className="match-height section-content" style={{ textAlign: 'center' }}>
                        <FileJson size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        <h2>{t('import.jsonModeTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {t('import.jsonModeDesc')}
                        </p>

                        <input
                            type="file"
                            accept=".json"
                            onChange={handleJsonSelect}
                            style={{ display: 'none' }}
                            id="json-upload"
                        />
                        <label
                            htmlFor="json-upload"
                            className="btn-glass btn-primary-glow"
                            style={{ display: 'inline-flex', cursor: 'pointer', padding: '1rem 2rem' }}
                        >
                            <Upload size={18} style={{ marginRight: '0.5rem' }} />
                            {t('import.jsonSelect')}
                        </label>

                        {error && (
                            <div className="error-message" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div style={{ marginTop: '2rem' }}>
                            <button className="btn-glass" onClick={() => setMode('select')}>
                                {t('import.back')}
                            </button>
                        </div>
                    </SectionCard>
                )}

                {/* Processing State */}
                {mode === 'processing' && (
                    <SectionCard className="processing-container">
                        <Loader size={48} className="spinner" />
                        <h2>{t('import.processingTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {t('import.processingDesc')}
                        </p>
                    </SectionCard>
                )}

                {/* Review Parsed Data */}
                {mode === 'review' && parsedData && (
                    <SectionCard className="section-content">
                        <h2 className="section-header">
                            <Check size={20} className="header-icon" style={{ color: 'var(--success)' }} />
                            {t('import.previewTitle')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {t('import.previewDesc')}
                        </p>

                        <div className="preview-box">
                            <strong>{t('import.expensesCount', { count: parsedData.expenses?.length || 0 })}</strong>
                            <pre className="preview-code">
                                {JSON.stringify(parsedData.expenses?.slice(0, 5), null, 2)}
                                {parsedData.expenses?.length > 5 && '\n... ve daha fazlası'}
                            </pre>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-glass" onClick={() => setMode('pdf')}>
                                {t('import.retry')}
                            </button>
                            <button className="btn-glass btn-primary-glow" onClick={handleGoToBankSelect}>
                                <Check size={18} /> {t('import.continue')}
                            </button>
                        </div>
                    </SectionCard>
                )}

                {/* Bank Selection Mode */}
                {mode === 'bankSelect' && parsedData && (
                    <SectionCard className="section-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>{t('import.bankSelectTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {parsedData.detectedBank?.name !== 'Bilinmeyen Banka'
                                ? t('import.bankDetected', { bank: parsedData.detectedBank?.name })
                                : t('import.bankUnknown')}
                        </p>

                        <div className="bank-grid">
                            {BANKS.map(bank => (
                                <div
                                    key={bank.name}
                                    onClick={() => handleBankSelected(bank.name)}
                                    className="bank-item"
                                    style={{
                                        background: selectedBank === bank.name ? bank.color : 'var(--bg-card-hover)',
                                        color: selectedBank === bank.name ? '#fff' : 'var(--text-primary)',
                                        border: `2px solid ${bank.color}`
                                    }}
                                    onMouseOver={(e) => {
                                        if (selectedBank !== bank.name) {
                                            e.currentTarget.style.background = bank.color + '30';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (selectedBank !== bank.name) {
                                            e.currentTarget.style.background = 'var(--bg-card-hover)';
                                        }
                                    }}
                                >
                                    {bank.name}
                                </div>
                            ))}
                        </div>

                        <button className="btn-glass" onClick={() => setMode('review')}>
                            {t('import.back')}
                        </button>
                    </SectionCard>
                )}

                {/* Confirm Mode - Ask Merge or Replace */}
                {mode === 'confirm' && parsedData && (
                    <SectionCard className="section-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('import.confirmTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {t('import.confirmDesc')}
                        </p>

                        <div className="confirmation-grid">
                            {/* Replace Option */}
                            <div
                                className="stat-card confirm-card"
                                onClick={() => handleFinalImport('replace')}
                            >
                                <RefreshCw size={40} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                                <h3>{t('import.replace')}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    {t('import.replaceDesc')}
                                </p>
                                <div className="warning-badge">
                                    {t('import.replaceWarning')}
                                </div>
                            </div>

                            {/* Merge Option */}
                            <div
                                className="stat-card confirm-card"
                                onClick={() => handleFinalImport('merge')}
                            >
                                <Plus size={40} color="var(--success)" style={{ marginBottom: '1rem' }} />
                                <h3>{t('import.merge')}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    {t('import.mergeDesc')}
                                </p>
                                <div className="success-badge">
                                    {t('import.mergeSuccess')}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <button className="btn-glass" onClick={() => setMode('review')}>
                                {t('import.back')}
                            </button>
                        </div>
                    </SectionCard>
                )}

                {/* Success State */}
                {mode === 'success' && (
                    <SectionCard className="success-container">
                        <div className="success-icon-wrapper">
                            <Check size={40} color="var(--success)" />
                        </div>
                        <h2>{t('import.successTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {t('import.successDesc')}
                        </p>
                        <button className="btn-glass btn-primary-glow" onClick={() => window.location.reload()}>
                            {t('import.goToDashboard')}
                        </button>
                    </SectionCard>
                )}

                {/* Error State */}
                {mode === 'error' && (
                    <SectionCard className="error-container">
                        <div className="error-icon-wrapper">
                            <AlertCircle size={40} color="var(--danger)" />
                        </div>
                        <h2>{t('import.errorTitle')}</h2>
                        <p style={{ color: 'var(--danger)', marginBottom: '2rem' }}>
                            {error}
                        </p>
                        <button className="btn-glass" onClick={() => setMode('select')}>
                            {t('import.retry')}
                        </button>
                    </SectionCard>
                )}
            </div>
        </div>
    );
};

ImportView.propTypes = {
    onImportSuccess: PropTypes.func.isRequired
};

export default ImportView;
