
import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

const ApiKeyModal: React.FC = () => {
    const { apiKey, setApiKey, isApiKeyModalOpen, closeApiKeyModal } = useApiKey();
    const [localApiKey, setLocalApiKey] = useState(apiKey || '');

    if (!isApiKeyModalOpen) {
        return null;
    }

    const handleSave = () => {
        if (localApiKey.trim()) {
            setApiKey(localApiKey.trim());
            closeApiKeyModal();
        }
    };

    const handleClose = () => {
        // Only allow closing if an API key is already set
        if (apiKey) {
            closeApiKeyModal();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-white mb-4">輸入您的 Gemini API 金鑰</h2>
                <p className="text-gray-300 mb-6">
                    為了使用 AI 功能，您需要提供自己的 Google AI Studio API 金鑰。您可以在{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                        Google AI Studio
                    </a>
                    {' '}取得。
                </p>
                <input
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="請在此貼上您的 API 金鑰"
                    className="w-full py-3 px-4 rounded-md bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end gap-4 mt-6">
                     {apiKey && (
                        <button
                            onClick={handleClose}
                            className="bg-slate-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-slate-500 transition"
                        >
                            關閉
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!localApiKey.trim()}
                        className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        儲存金鑰
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
