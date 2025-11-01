
import { GoogleGenAI, Modality, Type } from "@google/genai";

export const generateStickerImage = async (apiKey: string, prompt: string): Promise<{ imageUrl: string; fullPrompt: string; }> => {
  if (!apiKey) {
    return Promise.reject("API Key is not configured. Please set the API key.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Enhance prompt for better sticker results
    const fullPrompt = `A cute sticker of ${prompt}, vector illustration, vibrant colors, with a distinct white border, on a simple light gray background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
        throw new Error("Invalid API response: No candidates or content parts found. The prompt may have been blocked.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return {
            imageUrl: `data:image/png;base64,${base64ImageBytes}`,
            fullPrompt: fullPrompt
        };
      }
    }
    
    throw new Error("No image data was found in the API response.");

  } catch (error) {
    console.error("Error generating sticker image:", error);
    if (error instanceof Error) {
        return Promise.reject(`Failed to generate image: ${error.message}`);
    }
    return Promise.reject("An unknown error occurred while generating the image.");
  }
};

export const editImageWithPrompt = async (apiKey: string, base64ImageDataUrl: string, prompt: string): Promise<{ imageUrl: string; }> => {
    if (!apiKey) {
        return Promise.reject("API Key is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const base64Data = base64ImageDataUrl.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid image data URL provided.");
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Data } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
            throw new Error("Invalid API response: No candidates or content parts found. The prompt may have been blocked.");
        }

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return {
                    imageUrl: `data:image/png;base64,${base64ImageBytes}`,
                };
            }
        }

        throw new Error("No image data was found in the API response.");

    } catch (error) {
        console.error("Error editing image:", error);
        if (error instanceof Error) {
            return Promise.reject(`Failed to edit image: ${error.message}`);
        }
        return Promise.reject("An unknown error occurred while editing the image.");
    }
};

export interface PromptFields {
    who: string;
    what: string;
    when: string;
    where: string;
    style: string;
}

export const generatePromptIdea = async (apiKey: string): Promise<PromptFields> => {
    if (!apiKey) {
        return Promise.reject("API Key is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
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
        const idea = JSON.parse(jsonText);
        return idea;
    } catch (error) {
        console.error("Error generating prompt idea:", error);
        if (error instanceof Error) {
            return Promise.reject(`Failed to generate idea: ${error.message}`);
        }
        return Promise.reject("An unknown error occurred while generating an idea.");
    }
};
