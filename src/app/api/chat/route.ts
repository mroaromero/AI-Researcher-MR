import { streamText } from "ai";
import { llmRouter } from "@/lib/llm-router";

import { getResearchTools } from "@/lib/mcp/tools-loader";

// Allow streaming responses up to 60 seconds for expensive tool calls
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, provider, model } = await req.json();

    const modelInstance = llmRouter(provider || "groq", model || "llama-3.3-70b-versatile");
    const tools = await getResearchTools();

    const result = await streamText({
      model: modelInstance,
      messages,
      system: `You are an advanced AI research assistant designed to help with academic writing, thesis structure, and scientific methodologies. You have access to specialized agents (Writer, Reviewer, Orchestrator, etc.) via tools. 

      CORE GUIDELINES:
      1. **Search First**: When asked about specific topics or recent papers, use the 'reviewer_execute_search' tool.
      2. **Manage Knowledge & Files**: 
         - ASK to save valuable findings using 'orchestrator_add_knowledge'.
         - Analyze uploaded files using 'reviewer_query_knowledge'.
      3. **Deep Writing & Citations**:
         - **Mandatory**: Use 'writer_format_apa' to generate EVERY citation. Do not manually format citations to avoid errors.
         - **Structure**: Use 'writer_get_drafting_template' before writing a section to ensure academic rigor.
         - **Refinement**: Use 'writer_get_connectors' to improve flow when asked to polish text.
      
      TONE: Be precise, academic, clear, and helpful. ALWAYS rely on tool outputs for factual claims.`,
      tools: tools,
      maxSteps: 5,
    } as any);

    return (result as any).toDataStreamResponse();
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
