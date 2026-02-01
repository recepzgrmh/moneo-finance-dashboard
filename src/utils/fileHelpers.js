import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker using local import (Vite compatible)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts all text content from a PDF file.
 * @param {File} file - The PDF file object.
 * @returns {Promise<string>} - The extracted text.
 */
export async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n--- Page Break ---\n\n';
    }

    return fullText;
}

/**
 * Downloads an object as a JSON file.
 * @param {object} data - The data object to export.
 * @param {string} filename - The name of the downloaded file.
 */
export function downloadAsJSON(data, filename = 'mali_yedek.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file and returns its parsed content.
 * @param {File} file - The JSON file object.
 * @returns {Promise<object>} - The parsed JSON data.
 */
export async function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (err) {
                reject(new Error('Geçersiz JSON dosyası.'));
            }
        };
        reader.onerror = () => reject(new Error('Dosya okunamadı.'));
        reader.readAsText(file);
    });
}

/**
 * Validates that imported data has the expected structure.
 * @param {object} data - The data to validate.
 * @returns {boolean}
 */
export function validateImportedData(data) {
    const requiredKeys = ['expenses', 'incomes'];
    return requiredKeys.every(key => Array.isArray(data[key]));
}

// LocalStorage Keys
const STORAGE_KEY = 'mali_rapor_data';

/**
 * Saves financial data to localStorage.
 * @param {object} data - The complete app data.
 */
export function saveToLocalStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('LocalStorage kayıt hatası:', e);
        return false;
    }
}

/**
 * Loads financial data from localStorage.
 * @returns {object|null} - The saved data or null if none exists.
 */
export function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    } catch (e) {
        console.error('LocalStorage okuma hatası:', e);
        return null;
    }
}

/**
 * Clears financial data from localStorage.
 */
export function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
}
