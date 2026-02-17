import { createOpenAI } from "@ai-sdk/openai";

// Define the router structure
export const llmRouter = (provider: string = "groq", modelName: string) => {
  const providerConfig = {
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    },
  }[provider] || {
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  };

  const openai = createOpenAI({
    baseURL: providerConfig.baseURL,
    apiKey: providerConfig.apiKey,
  });

  return openai(modelName);
};
