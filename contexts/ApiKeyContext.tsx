
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
    isApiKeyModalOpen: boolean;
    openApiKeyModal: () => void;
    closeApiKeyModal: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyValue] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini-api-key');
        if (storedApiKey) {
            setApiKeyValue(storedApiKey);
        } else {
            setIsApiKeyModalOpen(true);
        }
    }, []);

    const setApiKey = (key: string | null) => {
        setApiKeyValue(key);
        if (key) {
            localStorage.setItem('gemini-api-key', key);
            setIsApiKeyModalOpen(false);
        } else {
            localStorage.removeItem('gemini-api-key');
        }
    };

    const openApiKeyModal = () => setIsApiKeyModalOpen(true);
    const closeApiKeyModal = () => setIsApiKeyModalOpen(false);


    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, isApiKeyModalOpen, openApiKeyModal, closeApiKeyModal }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = (): ApiKeyContextType => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
