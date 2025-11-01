import React, { useState } from 'react';
import { editImageWithPrompt } from '../services/geminiService';

type Tab = 'edit' | 'style';

interface EditTabsProps {
    imageUrl: string | null;
}

const ImageResult: React.FC<{
    isLoading: boolean;
    error: string | null;
    imageUrl: string | null;
    defaultText: string;
}> = ({ isLoading, error, imageUrl, defaultText }) => (
    <div className="w-full h-full aspect-square rounded-lg shadow-inner bg-slate-700 flex items-center justify-center p-2">
        {isLoading && (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">AI 處理中...</span>
            </>
        )}
        {error && <p className="text-red-400 p-4 text-center">{`處理失敗：${error}`}</p>}
        {imageUrl && !isLoading && <img src={imageUrl} alt="AI processed image" className="w-full h-full object-contain rounded-lg" />}
        {!isLoading && !error && !imageUrl && <p className="text-gray-500 text-center">{defaultText}</p>}
    </div>
);

const EditTabs: React.FC<EditTabsProps> = ({ imageUrl }) => {
    const [activeTab, setActiveTab] = useState<Tab>('edit');
    
    // State for Edit Tab
    const [editPrompt, setEditPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);

    // State for Style Tab
    const [stylePrompt, setStylePrompt] = useState('');
    const [isStyling, setIsStyling] = useState(false);
    const [styleError, setStyleError] = useState<string | null>(null);
    const [styledImage, setStyledImage] = useState<string | null>(null);

    const effectiveImageUrl = imageUrl || "https://i.ibb.co/kQ0D4j3/fox-sticker-placeholder.png";

    const getButtonClasses = (tabName: Tab) => {
        const baseClasses = "px-6 py-3 font-semibold rounded-t-lg transition-colors duration-300 w-1/2 text-center";
        if (activeTab === tabName) {
            return `${baseClasses} bg-indigo-600 text-white`;
        }
        return `${baseClasses} bg-slate-700 text-gray-300 hover:bg-slate-600`;
    };

    const handleEdit = async () => {
        if (!editPrompt.trim()) return;
        setIsEditing(true);
        setEditError(null);
        setEditedImage(null);
        try {
            const { imageUrl } = await editImageWithPrompt(effectiveImageUrl, editPrompt);
            setEditedImage(imageUrl);
        } catch (err) {
            setEditError(err instanceof Error ? err.message : '發生未知錯誤');
        } finally {
            setIsEditing(false);
        }
    };
    
    const handleStyle = async () => {
        if (!stylePrompt.trim()) return;
        setIsStyling(true);
        setStyleError(null);
        setStyledImage(null);
        try {
            const fullStylePrompt = `將這張圖轉換成 ${stylePrompt} 風格`;
            const { imageUrl } = await editImageWithPrompt(effectiveImageUrl, fullStylePrompt);
            setStyledImage(imageUrl);
        } catch (err)
        {
            setStyleError(err instanceof Error ? err.message : '發生未知錯誤');
        } finally {
            setIsStyling(false);
        }
    };

    return (
        <section id="edit" className="py-16">
            <h2 className="text-3xl font-bold text-center text-white sm:text-4xl mb-6">最終關：用 AI 讓貼紙更完美！</h2>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto mb-10">
                恭喜你來到最後一關！現在，試著對你在上一關生成的貼紙下達「編輯」或「風格轉換」的指令，體驗 AI強大的圖生圖 (Image-to-Image) 能力。
            </p>
            <div className="max-w-4xl mx-auto">
                <div className="flex border-b-2 border-slate-700">
                    <button onClick={() => setActiveTab('edit')} className={getButtonClasses('edit')}>
                        圖片增改 (Inpainting)
                    </button>
                    <button onClick={() => setActiveTab('style')} className={getButtonClasses('style')}>
                        風格轉換 (Style Transfer)
                    </button>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-b-lg rounded-tr-lg">
                    {activeTab === 'edit' && (
                        <div>
                            <p className="text-gray-300 mb-6">AI 能理解圖片內容並進行修改。試著對下方的原始圖案下達一個增加或修改內容的指令！</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                                <div className="space-y-2">
                                    <p className="font-semibold mb-2">原始圖案</p>
                                    <img src={effectiveImageUrl} alt="原始圖案" className="rounded-lg shadow-md w-full h-auto object-contain" />
                                </div>
                                <div className="space-y-4">
                                     <input
                                        type="text"
                                        value={editPrompt}
                                        onChange={(e) => setEditPrompt(e.target.value)}
                                        placeholder="例如：幫牠戴上一頂派對帽"
                                        className="w-full py-2 px-3 rounded-md bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={isEditing}
                                    />
                                    <button onClick={handleEdit} disabled={isEditing} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400">
                                        {isEditing ? '編輯中...' : '開始編輯'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold mb-2">AI 編輯後</p>
                                    <ImageResult isLoading={isEditing} error={editError} imageUrl={editedImage} defaultText="編輯後的圖片將顯示於此" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                         <div>
                            <p className="text-gray-300 mb-6">AI 也能將你的圖片轉換成完全不同的藝術風格。試著描述一種風格！</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                               <div className="space-y-2">
                                    <p className="font-semibold mb-2">原始圖案</p>
                                    <img src={effectiveImageUrl} alt="原始圖案" className="rounded-lg shadow-md w-full h-auto object-contain" />
                                </div>
                                <div className="space-y-4">
                                     <input
                                        type="text"
                                        value={stylePrompt}
                                        onChange={(e) => setStylePrompt(e.target.value)}
                                        placeholder="例如：水彩畫風格"
                                        className="w-full py-2 px-3 rounded-md bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={isStyling}
                                    />
                                    <button onClick={handleStyle} disabled={isStyling} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400">
                                        {isStyling ? '轉換中...' : '轉換風格'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold mb-2">AI 轉換後</p>
                                    <ImageResult isLoading={isStyling} error={styleError} imageUrl={styledImage} defaultText="風格轉換後的圖片將顯示於此" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EditTabs;
