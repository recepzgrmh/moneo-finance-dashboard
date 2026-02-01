import React, { useState } from 'react';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Sparkles, History, Send, Key, Upload, MessageSquare, Trash2 } from 'lucide-react';
import * as AIService from '../../services/aiService';
import PageHeader from '../../components/common/PageHeader';
import './AIView.css';

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

const AIView = ({ financialData, userProfile, currency = 'TRY' }) => {
    const { t, i18n } = useTranslation();
    const [provider, setProvider] = useState(() => localStorage.getItem('ai_provider') || 'gemini');
    const [model, setModel] = useState(() => localStorage.getItem('ai_model') || 'gemini-3-flash-preview');
    const [apiKey, setApiKey] = useState(() => AIService.getStoredKey(provider));
    const [tab, setTab] = useState('new');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [history, setHistory] = useState([]);

    // Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        setProvider(newProvider);
        localStorage.setItem('ai_provider', newProvider);

        const savedKey = AIService.getStoredKey(newProvider);
        setApiKey(savedKey);

        if (!MODELS[newProvider].some(m => m.id === model)) {
            const firstModel = MODELS[newProvider][0].id;
            setModel(firstModel);
            localStorage.setItem('ai_model', firstModel);
        }
    };

    const handleModelChange = (e) => {
        const newModel = e.target.value;
        setModel(newModel);
        localStorage.setItem('ai_model', newModel);
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
        if (newTab === 'history') {
            setHistory(AIService.loadHistory());
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setResult(e.target.result);
                setTab('result');
            };
            reader.readAsText(file);
        }
    };

    const handleAskAI = () => {
        if (!apiKey) return alert(t('ai.apiKeyRequired'));

        const apiData = {
            financialData
        };

        const fullSystemPrompt = t('ai.promptSystem', {
            user: userProfile?.userName || 'User',
            currency: currency
        });

        const uiCallbacks = {
            onLoading: () => setLoading(true),
            onSuccess: (text) => {
                setLoading(false);
                setResult(text);
                setTab('result');
            },
            onError: (msg) => {
                setLoading(false);
                alert(msg);
            }
        };

        AIService.askAI(apiData, { provider, model, key: apiKey }, uiCallbacks, fullSystemPrompt);
    };

    const handleHistoryClick = (item) => {
        setResult(item.text);
        setTab('result');
    };

    // Chat handlers
    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = { role: 'user', content: chatInput.trim(), timestamp: Date.now() };
        const newMessages = [...chatMessages, userMessage];
        setChatMessages(newMessages);
        setChatInput('');
        setIsChatLoading(true);

        // If no API key, show demo/placeholder response
        if (!apiKey) {
            setTimeout(() => {
                const placeholderMessage = {
                    role: 'assistant',
                    content: t('ai.noApiKeyPlaceholder'),
                    timestamp: Date.now()
                };
                setChatMessages([...newMessages, placeholderMessage]);
                setIsChatLoading(false);
            }, 1500); // Simulate thinking time
            return;
        }

        try {
            const systemPrompt = t('ai.chatSystemPrompt', {
                user: userProfile?.userName || 'User',
                currency: currency
            });

            const response = await AIService.sendChatMessage(
                newMessages,
                { provider, model, key: apiKey },
                newMessages.length === 1 ? systemPrompt : '' // Only first message gets system prompt
            );

            const assistantMessage = { role: 'assistant', content: response, timestamp: Date.now() };
            const updatedMessages = [...newMessages, assistantMessage];
            setChatMessages(updatedMessages);

            // Save session
            const session = {
                id: currentSessionId || Date.now().toString(),
                title: newMessages[0].content.substring(0, 50) + (newMessages[0].content.length > 50 ? '...' : ''),
                messages: updatedMessages,
                provider,
                model,
                timestamp: Date.now()
            };
            AIService.saveChatSession(session);
            if (!currentSessionId) setCurrentSessionId(session.id);

        } catch (error) {
            alert(t('ai.chatError') + ': ' + error.message);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleClearChat = () => {
        if (chatMessages.length > 0 && window.confirm(t('ai.clearChatConfirm'))) {
            setChatMessages([]);
            setCurrentSessionId(null);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="view-section active animate-fadeIn">
            <PageHeader
                title={t('ai.title')}
                subtitle={t('ai.subtitle')}
                icon={Sparkles}
            />

            <div className="ai-chat-container">
                {/* Left Config Sidebar */}
                <div className="ai-config">
                    <div className="nav-links">
                        <button
                            className={`nav-item ${tab === 'new' ? 'active' : ''}`}
                            onClick={() => handleTabChange('new')}
                            aria-label={t('ai.newAnalysis')}
                        >
                            <Sparkles size={18} /> {t('ai.newAnalysis')}
                        </button>
                        <button
                            className={`nav-item ${tab === 'history' ? 'active' : ''}`}
                            onClick={() => handleTabChange('history')}
                            aria-label={t('ai.history')}
                        >
                            <History size={18} /> {t('ai.history')}
                        </button>

                        <button
                            className={`nav-item ${tab === 'chat' ? 'active' : ''}`}
                            onClick={() => handleTabChange('chat')}
                            aria-label={t('ai.chat')}
                        >
                            <MessageSquare size={18} /> {t('ai.chat')}
                        </button>

                        <label className="nav-item ai-upload-label">
                            <Upload size={18} aria-hidden="true" /> {t('ai.uploadReport')}
                            <input type="file" accept=".md" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {(tab === 'new' || tab === 'chat') && (
                        <div className="ai-config-footer">
                            <label className="ai-config-label">{t('ai.provider')}</label>
                            <select
                                className="api-input ai-config-select"
                                value={provider}
                                onChange={handleProviderChange}
                            >
                                <option value="gemini">Google Gemini</option>
                                <option value="openai">OpenAI ChatGPT</option>
                                <option value="anthropic">Anthropic Claude</option>
                                <option value="deepseek">DeepSeek AI</option>
                            </select>

                            <label className="ai-config-label">{t('ai.model')}</label>
                            <select
                                className="api-input ai-config-select"
                                value={model}
                                onChange={handleModelChange}
                            >
                                {MODELS[provider].map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>

                            <label className="ai-config-label">
                                <Key size={14} style={{ display: 'inline', marginRight: 5 }} /> {t('ai.apiKey', { provider: provider.toUpperCase() })}
                            </label>
                            <input
                                type="password"
                                className="api-input"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="ai-conversation">
                    {loading ? (
                        <div className="ai-welcome">
                            <div className="ai-spinner-container" aria-hidden="true"></div>
                            <p style={{ marginTop: '1rem' }}>{t('ai.loading')}</p>
                        </div>
                    ) : (
                        <>
                            {tab === 'new' && (
                                <div className="ai-welcome">
                                    <Sparkles size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h2>{t('ai.welcomeTitle')}</h2>
                                    <p className="ai-welcome-text">
                                        {t('ai.welcomeDesc')}
                                        <br /><br />
                                        <span className="ai-welcome-subtext">{t('ai.noExtraFile')}</span>
                                    </p>
                                    <button className="btn-glass btn-primary-glow ai-submit-btn" onClick={handleAskAI}>
                                        <Send size={18} /> {t('ai.analyzeSystem')}
                                    </button>
                                </div>
                            )}

                            {tab === 'chat' && (
                                <div className="ai-chat-view">
                                    {chatMessages.length === 0 ? (
                                        <div className="ai-welcome">
                                            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <h2>{t('ai.chatWelcomeTitle')}</h2>
                                            <p className="ai-welcome-text">
                                                {t('ai.chatWelcomeDesc')}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="chat-messages">
                                            {chatMessages.map((msg, idx) => (
                                                <div key={idx} className={`chat-message ${msg.role}`}>
                                                    <div className="message-bubble">
                                                        {msg.role === 'assistant' ? (
                                                            <div
                                                                className="markdown-body"
                                                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                                                            />
                                                        ) : (
                                                            <div className="message-text">{msg.content}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {isChatLoading && (
                                                <div className="chat-message assistant">
                                                    <div className="message-bubble typing-indicator">
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Chat Input */}
                                    <div className="chat-input-container">
                                        {chatMessages.length > 0 && (
                                            <button
                                                className="btn-glass chat-clear-btn"
                                                onClick={handleClearChat}
                                                title={t('ai.clearChat')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <textarea
                                            className="chat-input"
                                            placeholder={t('ai.chatPlaceholder')}
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            rows="2"
                                            disabled={isChatLoading}
                                        />
                                        <button
                                            className="btn-glass btn-primary-glow chat-send-btn"
                                            onClick={handleSendMessage}
                                            disabled={!chatInput.trim() || isChatLoading}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}


                            {tab === 'history' && (
                                <div className="ai-body">
                                    <h3 className="ai-history-header">{t('ai.history')}</h3>
                                    {history.length === 0 && <p style={{ color: 'var(--text-muted)' }}>{t('ai.noHistory')}</p>}
                                    {history.map(item => (
                                        <button
                                            key={item.id}
                                            className="day-group ai-history-item"
                                            onClick={() => handleHistoryClick(item)}
                                            aria-label={`${item.date} ${t('common.view')}`}
                                        >
                                            <div className="ai-history-date-row">
                                                <span>{new Date(item.date).toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                                                <span className="ai-history-model-badge">{item.model}</span>
                                            </div>
                                            <div className="ai-history-view-text">{t('ai.viewReport')}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {tab === 'result' && (
                                <div className="ai-body">
                                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(result) }}></div>

                                    <div className="ai-result-actions">
                                        <button className="btn-glass" onClick={() => AIService.saveReportToFile(result)}>
                                            {t('ai.download')}
                                        </button>
                                        <button className="btn-glass" onClick={() => handleTabChange('new')}>
                                            {t('ai.newAnalysis')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

AIView.propTypes = {
    financialData: PropTypes.object,
    userProfile: PropTypes.object
};

export default AIView;
