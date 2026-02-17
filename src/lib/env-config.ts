export const EnvConfig = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    
    validate: () => {
        const missing: string[] = [];
        if (!process.env.GROQ_API_KEY) missing.push("GROQ_API_KEY");
        if (!process.env.TAVILY_API_KEY) missing.push("TAVILY_API_KEY");

        if (missing.length > 0) {
            console.warn(`[EnvConfig] WARNING: Missing environment variables: ${missing.join(", ")}. Using Free Tier/Fallback defaults or agent tools may fail.`);
            // We don't throw, we just warn, to allow partial functionality (e.g. just writing)
        } else {
            console.log("[EnvConfig] Environment variables validated.");
        }
    }
};

// Auto-validate on import? better to call explicitly in server start.
