export interface PromptFields {
    who: string;
    what: string;
    when: string;
    where: string;
    style: string;
}

const apiRequest = async (action: string, payload: unknown) => {
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || `Request failed with status ${response.status}`;
            throw new Error(`[API Error] ${errorMessage}`);
        }

        return data;
    } catch (error) {
        console.error("API request error:", error);
        if (error instanceof Error) {
            // Attempt to re-throw the already formatted error from the backend
            // or a more generic network error.
            if (error.message.startsWith('[API Error]')) {
                 throw error;
            }
            throw new Error(`[API Error] ${error.message}`);
        }
        throw new Error('[API Error] An unknown error occurred while contacting the server.');
    }
};

export const generateStickerImage = async (prompt: string): Promise<{ imageUrl: string; fullPrompt: string; }> => {
    return apiRequest('generateSticker', { prompt });
};

export const editImageWithPrompt = async (base64ImageDataUrl: string, prompt: string): Promise<{ imageUrl: string; }> => {
    return apiRequest('editImage', { base64ImageDataUrl, prompt });
};

export const generatePromptIdea = async (): Promise<PromptFields> => {
    return apiRequest('generateIdea', {});
};