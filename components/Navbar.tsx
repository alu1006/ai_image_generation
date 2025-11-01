import React from 'react';

const Navbar: React.FC = () => {
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
            </div>
        </nav>
    );
};

export default Navbar;