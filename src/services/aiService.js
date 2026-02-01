// Unified AI Service for Multi-Model Support

const PROVIDERS = {
    GEMINI: 'gemini',
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    DEEPSEEK: 'deepseek'
};

// Key storage helpers
export const getStoredKey = (provider) => localStorage.getItem(`${provider}_api_key`) || '';
export const setStoredKey = (provider, key) => localStorage.setItem(`${provider}_api_key`, key);

/**
 * Routes the prompt to the correct provider and returns the AI response text.
 */
/**
 * Routes the prompt to the correct provider and returns the AI response text.
 * @param {Object} apiData - Contains detailed financial data
 * @param {Object} modelSelection - { provider, model, key }
 * @param {Object} uiCallbacks - { onLoading, onSuccess, onError }
 * @param {string} fullSystemPrompt - The localized prompt instructions constructed by the View
 */
export async function askAI(apiData, modelSelection, uiCallbacks, fullSystemPrompt) {
    const { provider, model, key } = modelSelection;
    const { onLoading, onSuccess, onError } = uiCallbacks;
    const { financialData } = apiData;

    if (!key) {
        // Retrieve localized error or fallback
        // Since we are in a JS file, we might return an error code or expect the caller to validate.
        // But for now let's alerting English as fallback or assume key was checked by View.
        // View checks key existence before calling. But if it's missing here:
        alert(`${provider.toUpperCase()} API Key required.`);
        return;
    }
    setStoredKey(provider, key);
    onLoading();

    // Use the passed localized prompt, appending the data
    const prompt = `
        ${fullSystemPrompt}

        DATA:
        ${JSON.stringify(financialData)}
    `;

    try {
        let responseText = '';
        switch (provider) {
            case PROVIDERS.GEMINI:
                responseText = await callGemini(model, key, prompt);
                break;
            case PROVIDERS.OPENAI:
                responseText = await callOpenAI(model, key, prompt);
                break;
            case PROVIDERS.ANTHROPIC:
                responseText = await callAnthropic(model, key, prompt);
                break;
            case PROVIDERS.DEEPSEEK:
                responseText = await callDeepSeek(model, key, prompt);
                break;
            default:
                throw new Error('Invalid Provider');
        }

        saveReportToFile(responseText);
        saveToHistory(responseText, model, provider);
        onSuccess(responseText);

    } catch (error) {
        console.error(`${provider} Error:`, error);
        onError(error.message);
    }
}

/**
 * Provider-specific fetch implementations
 */

async function callGemini(model, key, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await handleResponse(res, 'Google');
    return data.candidates[0].content.parts[0].text;
}

async function callOpenAI(model, key, prompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await handleResponse(res, 'OpenAI');
    return data.choices[0].message.content;
}

async function callAnthropic(model, key, prompt) {
    // Anthropic requires a special header for CORS in browser environments usually, 
    // but we use the standard API endpoint here.
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true' // If using their SDK, but fetch is raw
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await handleResponse(res, 'Anthropic');
    return data.content[0].text;
}

async function callDeepSeek(model, key, prompt) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await handleResponse(res, 'DeepSeek');
    return data.choices[0].message.content;
}

async function handleResponse(res, providerName) {
    if (!res.ok) {
        let msg = `${providerName} Hatası: ${res.status}`;
        try {
            const err = await res.json();
            msg = err.error?.message || err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return res.json();
}

/**
 * Utility: Parse Bank Statement
 */
export async function parseBankStatement(provider, model, key, rawText) {
    const prompt = `
Sen bir banka ekstresi ayrıştırma uzmanısın. Aşağıdaki ham metinden TÜM finansal işlemleri çıkar ve JSON formatında döndür.
SADECE JSON döndür, açıklama yapma.

## Format:
{
  "expenses": [{ "date": "DD.MM.YYYY", "category": "Kategori", "amount": 0, "desc": "" }],
  "incomes": [{ "date": "DD.MM.YYYY", "sender": "", "amount": 0, "desc": "" }],
  "accounts": [{ "bank": "", "type": "Kredi Kartı", "debt": 0, "totalLimit": 0 }],
  "cash": 0
}

## Ham Metin:
${rawText.substring(0, 10000)}
`;

    let responseText = '';
    if (provider === 'gemini') responseText = await callGemini(model, key, prompt);
    else if (provider === 'openai') responseText = await callOpenAI(model, key, prompt);
    else if (provider === 'deepseek') responseText = await callDeepSeek(model, key, prompt);
    else if (provider === 'anthropic') responseText = await callAnthropic(model, key, prompt);
    else throw new Error('Bu işlem için seçili sağlayıcı henüz desteklenmiyor.');

    let jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr);
}

/**
 * Utility: Helpers
 */
export function saveReportToFile(markdownContent) {
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mali_rapor_${dateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function saveToHistory(text, model, provider) {
    const history = JSON.parse(localStorage.getItem('ai_history') || '[]');
    const newItem = {
        id: Date.now(),
        date: new Date().toISOString(), // Store ISO
        provider: provider,
        model: model,
        text: text
    };
    history.unshift(newItem);
    if (history.length > 20) history.pop();
    localStorage.setItem('ai_history', JSON.stringify(history));
}

export function loadHistory() {
    const aiHistory = localStorage.getItem('ai_history');
    if (aiHistory) return JSON.parse(aiHistory);

    // Migration from old gemini_history
    const oldHistory = localStorage.getItem('gemini_history');
    if (oldHistory) {
        const migrated = JSON.parse(oldHistory).map(item => ({
            ...item,
            provider: 'gemini'
        }));
        localStorage.setItem('ai_history', JSON.stringify(migrated));
        localStorage.removeItem('gemini_history');
        return migrated;
    }

    return [];
}

/**
 * Chat Mode Functions
 */

/**
 * Send a chat message with conversation context
 * @param {Array} messages - Array of {role: 'user'|'assistant', content: string}
 * @param {Object} modelSelection - { provider, model, key }
 * @param {string} systemPrompt - Optional system prompt for context
 * @returns {Promise<string>} - AI response text
 */
export async function sendChatMessage(messages, modelSelection, systemPrompt = '') {
    const { provider, model, key } = modelSelection;

    if (!key) {
        throw new Error(`${provider.toUpperCase()} API Key required.`);
    }
    setStoredKey(provider, key);

    try {
        let responseText = '';
        switch (provider) {
            case PROVIDERS.GEMINI:
                responseText = await callGeminiChat(model, key, messages, systemPrompt);
                break;
            case PROVIDERS.OPENAI:
                responseText = await callOpenAIChat(model, key, messages, systemPrompt);
                break;
            case PROVIDERS.ANTHROPIC:
                responseText = await callAnthropicChat(model, key, messages, systemPrompt);
                break;
            case PROVIDERS.DEEPSEEK:
                responseText = await callDeepSeekChat(model, key, messages, systemPrompt);
                break;
            default:
                throw new Error('Invalid Provider');
        }
        return responseText;
    } catch (error) {
        console.error(`${provider} Chat Error:`, error);
        throw error;
    }
}

/**
 * Provider-specific chat implementations
 */

async function callGeminiChat(model, key, messages, systemPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const body = {
        contents: contents,
        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await handleResponse(res, 'Google');
    return data.candidates[0].content.parts[0].text;
}

async function callOpenAIChat(model, key, messages, systemPrompt) {
    const apiMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: model,
            messages: apiMessages
        })
    });
    const data = await handleResponse(res, 'OpenAI');
    return data.choices[0].message.content;
}

async function callAnthropicChat(model, key, messages, systemPrompt) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4096,
            messages: messages,
            system: systemPrompt || undefined
        })
    });
    const data = await handleResponse(res, 'Anthropic');
    return data.content[0].text;
}

async function callDeepSeekChat(model, key, messages, systemPrompt) {
    const apiMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: model,
            messages: apiMessages
        })
    });
    const data = await handleResponse(res, 'DeepSeek');
    return data.choices[0].message.content;
}

/**
 * Chat Session Management
 */

export function saveChatSession(session) {
    const sessions = loadChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.unshift(session);
    }

    // Keep only last 10 sessions
    if (sessions.length > 10) sessions.splice(10);

    localStorage.setItem('ai_chat_sessions', JSON.stringify(sessions));
}

export function loadChatSessions() {
    const sessionsData = localStorage.getItem('ai_chat_sessions');
    return sessionsData ? JSON.parse(sessionsData) : [];
}

export function deleteChatSession(sessionId) {
    const sessions = loadChatSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('ai_chat_sessions', JSON.stringify(filtered));
}

export function createNewChatSession(provider, model) {
    return {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        provider: provider,
        model: model,
        timestamp: Date.now()
    };
}
