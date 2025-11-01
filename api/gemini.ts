import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, payload } = req.body;

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: 'API Key is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        switch (action) {
            case 'generateSticker': {
                const { prompt } = payload;
                if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
                
                const fullPrompt = `A cute sticker of ${prompt}, vector illustration, vibrant colors, with a distinct white border, on a simple light gray background.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-image',
                    contents: { parts: [{ text: fullPrompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                if (!response.candidates?.[0]?.content?.parts) {
                    throw new Error("Invalid API response: No candidates or content parts found. The prompt may have been blocked.");
                }

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        return res.status(200).json({
                            imageUrl: `data:image/png;base64,${part.inlineData.data}`,
                            fullPrompt: fullPrompt
                        });
                    }
                }
                throw new Error("No image data was found in the API response.");
            }

            case 'editImage': {
                const { base64ImageDataUrl, prompt } = payload;
                if (!base64ImageDataUrl || !prompt) return res.status(400).json({ error: 'Image data and prompt are required.' });

                const base64Data = base64ImageDataUrl.split(',')[1];
                if (!base64Data) throw new Error("Invalid image data URL provided.");

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-image',
                    contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                if (!response.candidates?.[0]?.content?.parts) {
                    throw new Error("Invalid API response: No candidates or content parts found. The prompt may have been blocked.");
                }

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        return res.status(200).json({
                            imageUrl: `data:image/png;base64,${part.inlineData.data}`,
                        });
                    }
                }
                throw new Error("No image data was found in the API response.");
            }

            case 'generateIdea': {
                 const prompt = "請用繁體中文生成一個單一、有創意且有趣的貼紙點子。將其分解為 5W1H 格式：人 (Who)、事 (What)、時 (When)、地 (Where) 和 風格 (Style)。這個點子應該是異想天開的，適合做成可愛的貼紙。為每個欄位提供簡潔且富有想像力的描述。";
        
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                who: { type: Type.STRING, description: "The main character or subject of the sticker." },
                                what: { type: Type.STRING, description: "What the character is doing." },
                                when: { type: Type.STRING, description: "The atmosphere, time of day, or mood." },
                                where: { type: Type.STRING, description: "The setting or background." },
                                style: { type: Type.STRING, description: "The artistic style of the sticker." },
                            },
                            required: ["who", "what", "when", "where", "style"],
                        },
                    },
                });

                const jsonText = response.text.trim();
                return res.status(200).json(JSON.parse(jsonText));
            }

            default:
                return res.status(400).json({ error: 'Invalid action specified.' });
        }
    } catch (error) {
        console.error(`Error in action '${action}':`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return res.status(500).json({ error: errorMessage });
    }
}