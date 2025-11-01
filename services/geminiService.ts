const apiEndpoint = '/api/gemini';

async function callApi<T>(action: string, payload: object): Promise<T> {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the backend, or a default one
            throw new Error(data.error || 'An unknown error occurred with the API request.');
        }

        return data;
    } catch (error) {
        console.error(`API call failed for action "${action}":`, error);
        // Re-throw the error to be caught by the component
        if (error instanceof Error) {
            throw new Error(`[Network/API Error] ${error.message}`);
        }
        throw new Error('A network error occurred.');
    }
}

export const generateStickerImage = async (prompt: string): Promise<{ imageUrl: string; fullPrompt: string; }> => {
    return callApi<{ imageUrl: string; fullPrompt: string; }>('generateSticker', { prompt });
};

export const editImageWithPrompt = async (base64ImageDataUrl: string, prompt: string): Promise<{ imageUrl: string; }> => {
    return callApi<{ imageUrl: string; }>('editImage', { base64ImageDataUrl, prompt });
};

export interface PromptFields {
    who: string;
    what: string;
    when: string;
    where: string;
    style: string;
}

export const generatePromptIdea = async (): Promise<PromptFields> => {
    return callApi<PromptFields>('generateIdea', {});
};