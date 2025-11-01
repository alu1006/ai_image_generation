
import React, { useState } from 'react';
import { generateStickerImage, generatePromptIdea, PromptFields } from '../services/geminiService';
import { useApiKey } from '../contexts/ApiKeyContext';

interface PromptBuilderProps {
    onImageGenerated: (imageUrl: string | null) => void;
}

const PromptBuilder: React.FC<PromptBuilderProps> = ({ onImageGenerated }) => {
    const { apiKey, openApiKeyModal } = useApiKey();
    const [fields, setFields] = useState<PromptFields>({
        who: '',
        what: '',
        when: '',
        where: '',
        style: ''
    });
    const [combinedPrompt, setCombinedPrompt] = useState('點擊「組合提示詞」按鈕來查看結果...');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMagicLoading, setIsMagicLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [hasUsedMagicFill, setHasUsedMagicFill] = useState<boolean>(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFields(prev => ({ ...prev, [id.replace('prompt-', '')]: value }));
    };

    const handleCombineClick = async () => {
        if (!apiKey) {
            openApiKeyModal();
            return;
        }

        const { who, what, when, where, style } = fields;
        const parts = [who, what, when, where, style];
        const result = parts.filter(part => part && part.trim().length > 0).join(', ');

        if (result) {
            setCombinedPrompt(result);
            setIsLoading(true);
            setError(null);
            setGeneratedImage(null);
            onImageGenerated(null);

            try {
                const { imageUrl } = await generateStickerImage(apiKey, result);
                setGeneratedImage(imageUrl);
                onImageGenerated(imageUrl);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }

        } else {
            setCombinedPrompt('請至少在上方填寫一個欄位...');
            setGeneratedImage(null);
            onImageGenerated(null);
            setError(null);
        }
    };

    const handleMagicFill = async () => {
        setError(null);
        setGeneratedImage(null);
        onImageGenerated(null);
        
        if (!hasUsedMagicFill) {
            const placeholderIdea: PromptFields = {
                who: '一隻可愛的狐狸',
                what: '戴著生日帽，手拿蛋糕',
                when: '明亮開心的氛圍',
                where: '簡潔的白色背景',
                style: '卡通貼紙風格, 白邊, 向量圖'
            };
            setFields(placeholderIdea);
            const combined = Object.values(placeholderIdea).filter(p => p).join(', ');
            setCombinedPrompt(combined);
            setHasUsedMagicFill(true);
            return;
        }

        if (!apiKey) {
            openApiKeyModal();
            return;
        }

        setIsMagicLoading(true);
        try {
            const idea = await generatePromptIdea(apiKey);
            setFields(idea);
            const combined = Object.values(idea).filter(p => p).join(', ');
            setCombinedPrompt(combined);
        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : '無法獲取靈感';
             setError(errorMessage);
             setCombinedPrompt(`獲取 AI 靈感失敗：${errorMessage}`);
        } finally {
            setIsMagicLoading(false);
        }
    };

    return (
        <section id="prompt" className="py-16">
            <h2 className="text-3xl font-bold text-center text-white sm:text-4xl mb-12">AI 如何「理解」你的貼紙設計？</h2>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto mb-10">
                AI 設計的貼紙好不好，取決於你的「提示詞」(Prompt) 有多具體。
                試著用「人事時地物」的框架來組合你的完美貼紙提示詞！
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white text-center">打造你的專屬貼紙提示詞</h3>
                        <button 
                            onClick={handleMagicFill} 
                            disabled={isMagicLoading}
                            className="text-sm bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-500 transition-colors duration-200 disabled:bg-purple-400 disabled:cursor-wait"
                        >
                           {isMagicLoading ? 'AI 思考中...' : '✨ AI 填入範例'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt-who" className="block text-sm font-medium text-indigo-300 mb-1">人 (Who)：</label>
                            <input type="text" id="prompt-who" onChange={handleInputChange} value={fields.who} className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="一隻可愛的狐狸" />
                        </div>
                        <div>
                            <label htmlFor="prompt-what" className="block text-sm font-medium text-indigo-300 mb-1">事 (What)：</label>
                            <input type="text" id="prompt-what" onChange={handleInputChange} value={fields.what} className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="戴著生日帽，手拿蛋糕" />
                        </div>
                        <div>
                            <label htmlFor="prompt-when" className="block text-sm font-medium text-indigo-300 mb-1">時 (When)：</label>
                            <input type="text" id="prompt-when" onChange={handleInputChange} value={fields.when} className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="明亮開心的氛圍" />
                        </div>
                        <div>
                            <label htmlFor="prompt-where" className="block text-sm font-medium text-indigo-300 mb-1">地 (Where)：</label>
                            <input type="text" id="prompt-where" onChange={handleInputChange} value={fields.where} className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="簡潔的白色背景" />
                        </div>
                        <div>
                            <label htmlFor="prompt-style" className="block text-sm font-medium text-indigo-300 mb-1">物 (Style)：</label>
                            <input type="text" id="prompt-style" onChange={handleInputChange} value={fields.style} className="w-full px-4 py-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="卡通貼紙風格, 白邊, 向量圖" />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleCombineClick} 
                            disabled={isLoading || isMagicLoading}
                            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                             {isLoading ? '生成中...' : '組合提示詞並生成圖片'}
                        </button>
                    </div>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">組合結果</h3>
                    <div className="w-full p-4 rounded-md bg-slate-700 text-gray-300 border border-slate-600 h-24 overflow-y-auto">
                        {combinedPrompt}
                    </div>
                    <div className="mt-4 flex-grow flex items-center justify-center">
                        <div className="w-full aspect-square rounded-lg shadow-inner bg-slate-700 flex items-center justify-center p-2">
                             {isLoading && (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-lg">生成中...</span>
                                </>
                             )}
                             {error && <p className="text-red-400 p-4 text-center">{`生成失敗：${error}`}</p>}
                             {generatedImage && !isLoading && <img src={generatedImage} alt="Generated sticker based on prompt" className="w-full h-full object-contain rounded-lg" />}
                             {!isLoading && !error && !generatedImage && <p className="text-gray-500 text-center">點擊「組合提示詞並生成圖片」後<br/>將在此處顯示圖片</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromptBuilder;
