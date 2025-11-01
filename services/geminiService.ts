export interface PromptFields {
    who: string;
    what: string;
    when: string;
    where: string;
    style: string;
}

/**
 * A helper function to communicate with our Netlify serverless function.
 * @param action - The specific API action to perform (e.g., 'generateSticker').
 * @param payload - The data to send to the API.
 * @returns The JSON response from the serverless function.
 */
async function callApi(action: string, payload: any) {
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `HTTP error! status: ${response.status}`,
            }));
            throw new Error(errorData.error || 'An unknown API error occurred.');
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling API for action "${action}":`, error);
        if (error instanceof Error) {
            throw new Error(`[API Error] ${error.message}`);
        }
        throw new Error('An unknown error occurred while contacting the API.');
    }
}

export const generateStickerImage = async (prompt: string): Promise<{ imageUrl: string; fullPrompt: string; }> => {
    return callApi('generateSticker', { prompt });
};

export const editImageWithPrompt = async (base64ImageDataUrl: string, prompt: string): Promise<{ imageUrl: string; }> => {
    return callApi('editImage', { base64ImageDataUrl, prompt });
};

export const generatePromptIdea = async (): Promise<PromptFields> => {
    return callApi('generateIdea', {});
};