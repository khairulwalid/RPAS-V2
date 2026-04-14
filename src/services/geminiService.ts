import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TrendAnalysis {
  category: string;
  trends: string[];
  rareGaps: {
    theme: string;
    demand: "High" | "Medium";
    competition: "Low" | "Medium";
    potential: string;
  }[];
  marketInsights: string;
  searchUrl: string;
}

export async function analyzeStockTrends(category: "video" | "vector" | "photo"): Promise<TrendAnalysis> {
  const prompt = `Analyze current market trends for Adobe Stock in the category: ${category}.
  1. Identify 5 high-demand search trends.
  2. Find 3 "rare theme gaps" (themes with high demand but low supply).
  3. Provide market insights from creator forums and reports.
  4. Generate a valid Adobe Stock search URL for one of the top rare themes. 
     The URL format should be: https://stock.adobe.com/search/${category}?k=[keyword]
  
  Format the response as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          trends: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          rareGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                demand: { type: Type.STRING, enum: ["High", "Medium"] },
                competition: { type: Type.STRING, enum: ["Low", "Medium"] },
                potential: { type: Type.STRING }
              },
              required: ["theme", "demand", "competition", "potential"]
            }
          },
          marketInsights: { type: Type.STRING },
          searchUrl: { type: Type.STRING }
        },
        required: ["category", "trends", "rareGaps", "marketInsights", "searchUrl"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text);
}
