
import React from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

const Navbar: React.FC = () => {
    const { openApiKeyModal } = useApiKey();

    const handleReload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.reload();
    };

    return (
        <nav className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" onClick={handleReload} className="text-2xl font-bold text-white">
                    <span className="text-indigo-400">AI</span> 貼紙生成
                </a>
                <button
                    onClick={openApiKeyModal}
                    className="bg-slate-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-slate-600 transition"
                >
                    設定金鑰
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
