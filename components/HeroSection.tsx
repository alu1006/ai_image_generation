import React, { useState } from 'react';
import { generateStickerImage } from '../services/geminiService';
import { useApiKey } from '../contexts/ApiKeyContext';

interface HeroSectionProps {
    generatedImage: string | null;
    onImageGenerated: (imageUrl: string | null) => void;
    onPromptUsed: (prompt: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ generatedImage, onImageGenerated, onPromptUsed }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [statusText, setStatusText] = useState<string>('');
    const [actualPrompt, setActualPrompt] = useState<string>('');
    const { apiKey, openApiKeyModal } = useApiKey();

    const handleGenerateClick = async () => {
        if (!apiKey) {
            openApiKeyModal();
            return;
        }

        const currentPrompt = prompt.trim() === '' ? '一隻戴著墨鏡的柴犬貼紙在衝浪' : prompt;
        onPromptUsed(currentPrompt);
        
        setIsLoading(true);
        onImageGenerated(null);
        setError(null);
        setActualPrompt('');
        setStatusText('AI 正在努力生成中...');

        try {
            const { imageUrl, fullPrompt } = await generateStickerImage(apiKey, currentPrompt);
            onImageGenerated(imageUrl);
            setActualPrompt(fullPrompt);
            setStatusText('生成完畢！請按「下一關」繼續。');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
            setError(errorMessage);
            setStatusText(`生成失敗：${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="py-24 sm:py-32 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
                    繪出獨一無二
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        你的專屬貼紙！
                    </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                    用 AI 創造你從未見過的貼紙圖案。從概念到實作，一步步教你如何設計專屬貼紙。
                </p>
                <div className="relative max-w-lg mx-auto">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="例如：一隻戴著墨鏡的柴犬貼紙在衝浪"
                        className="w-full py-4 px-6 rounded-full bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                生成中...
                            </>
                        ) : (
                            '✨ 開始生成'
                        )}
                    </button>
                </div>

                {(isLoading || generatedImage || error) && (
                    <div className="max-w-lg mx-auto mt-8">
                        <div 
                            className="w-full rounded-lg shadow-xl bg-slate-700 aspect-video flex items-center justify-center transition-opacity duration-500 ease-in-out"
                            style={{ opacity: isLoading ? 0.5 : 1 }}
                        >
                            {generatedImage && !error && (
                                <img src={generatedImage} alt="AI 生成貼紙預覽" className="w-full h-full object-contain rounded-lg"/>
                            )}
                             {!generatedImage && isLoading && (
                                <p className="text-gray-300">AI 正在努力繪製中...</p>
                            )}
                            {error && (
                                <div className="text-red-400 p-4">{`生成失敗，請稍後再試。`}</div>
                            )}
                        </div>
                         {generatedImage && !error && actualPrompt && (
                            <div className="mt-4 text-left text-xs text-gray-400 bg-slate-800 p-3 rounded-md">
                                <p className="font-semibold text-gray-300 mb-1">🔍 實際傳送給 AI 的完整提示詞：</p>
                                <p>{actualPrompt}</p>
                            </div>
                        )}
                        <p className={`text-center mt-4 ${error ? 'text-red-400' : 'text-gray-300'}`}>
                            {statusText}
                        </p>
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeroSection;