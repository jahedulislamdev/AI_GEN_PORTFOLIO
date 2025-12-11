import { GoogleGenerativeAI } from "@google/generative-ai";

const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found in environment variables.");
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
};

export const enhanceContent = async (
    text: string,
    type: "bio" | "project" | "skill",
): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return text;

    let prompt = "";
    switch (type) {
        case "bio":
            prompt = `Rewrite the following portfolio bio to be more professional yet warm and inviting. Keep it under 100 words. Input: "${text}"`;
            break;
        case "project":
            prompt = `Improve this project description to sound impactful and technical but accessible. Keep it under 50 words. Input: "${text}"`;
            break;
        case "skill":
            prompt = `Suggest a short, one-sentence description for the skill: "${text}".`;
            break;
    }

    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return text;
    }
};

export const generateSkillList = async (
    jobTitle: string,
): Promise<string[]> => {
    const ai = getAiClient();
    if (!ai) return [];

    const prompt = `List 5 key technical skills for a "${jobTitle}". Return ONLY a JSON array of strings. Example: ["React", "TypeScript"].`;

    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return [];
    }
};
