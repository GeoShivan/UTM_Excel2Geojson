
import { GoogleGenAI } from "@google/genai";

export async function getExplanation(prompt: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful GIS (Geographic Information System) expert. Explain the following concept clearly and concisely for a beginner. Keep the response in markdown format. Concept: "${prompt}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `An error occurred while communicating with the AI: ${error.message}`;
        }
        return "An unknown error occurred while communicating with the AI.";
    }
}
