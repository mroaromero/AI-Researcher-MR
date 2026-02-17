import { BaseAgent } from './BaseAgent';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class ReviewerAgent extends BaseAgent {
    public name = "reviewer";
    public description = "Expert in literature review, web search strategies, and PRISMA protocol.";

    getTools(): Tool[] {
        return [
            {
                name: "reviewer_generate_search_query",
                description: "Generates an optimized search query string based on variables and strategy.",
                inputSchema: {
                    type: "object",
                    properties: {
                        variables: { type: "array", items: { type: "string" } },
                        strategy: { type: "string", enum: ["broad", "specific", "methodological"] }
                    },
                    required: ["variables", "strategy"]
                }
            },
            {
                name: "reviewer_prisma_guide",
                description: "Get instructions for a specific phase of the PRISMA systematic review.",
                inputSchema: {
                    type: "object",
                    properties: {
                        phase: { type: "string", enum: ["identification", "screening", "eligibility", "inclusion"] }
                    },
                    required: ["phase"]
                }
            },
            {
                name: "reviewer_execute_search",
                description: "Execute a web search query to find academic papers or information using Tavily.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" },
                        max_results: { type: "number", description: "Default 5" }
                    },
                    required: ["query"]
                }
            },
            {
                name: "reviewer_query_knowledge",
                description: "Retrieve knowledge entries (papers, notes) from the project context.",
                inputSchema: {
                    type: "object",
                    properties: {
                         search_term: { type: "string", description: "Keyword to filter content or source." }
                    }
                }
            },
            {
                name: "reviewer_consult_notebooklm",
                description: "Get guidance on how to use Google NotebookLM for specific research phases.",
                inputSchema: {
                    type: "object",
                    properties: {
                        current_step: { type: "string", description: "The current research step (e.g., 'literature_review', 'prisma', 'qualitative')." }
                    },
                    required: ["current_step"]
                }
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const state = await this.stateManager.loadState(); // Load state for Organic logic
        const searchEngine = await this.resourceManager.getEngine<any>("web_search_tool");
        
        if (name === "reviewer_generate_search_query") {
            const booleanBuilder = searchEngine.web_search_tool["2_boolean_search_builder"];
            const strategy = args.strategy || "broad";
            
            // Organic Data Flow: Use state variables if args are missing
            let vars = args.variables;
            if (!vars || vars.length === 0) {
                 const storedVars = state.project_info?.variables;
                 if (storedVars && storedVars.independent && storedVars.dependent) {
                     vars = [storedVars.independent, storedVars.dependent];
                 } else {
                     return { error: "No variables provided and none found in project state." };
                 }
            }

            // Construct search query using the template: (Var1 OR Syn1) AND (Var2 OR Syn2)
            // For now, we simulate synonyms with a placeholder or simple logic
            let finalQuery = "";
            const groups = vars.map((v: string) => {
                if (strategy === "broad") {
                     return `("${v}" OR "${v} synonyms")`; // Placeholder for synonym expansion
                }
                return `"${v}"`;
            });
            
            finalQuery = groups.join(" AND ");

            // Add modifiers based on strategy from 1_search_strategies
            let modifiers = "";
            const strategyData = searchEngine.web_search_tool["1_search_strategies"];
            
            if (strategy === "methodological") {
                modifiers = " (methodology OR design OR instrument)";
            } else if (strategy === "specific") {
                modifiers = " filetype:pdf site:edu"; // Example specific filter
            }
            
            return {
                query_template: booleanBuilder.template,
                generated_query: `${finalQuery}${modifiers}`,
                strategy_used: strategy,
                tips: booleanBuilder.operators
            };
        }

        if (name === "reviewer_prisma_guide") {
            const prismaEngine = await this.resourceManager.getEngine<any>("prisma_engine");
            const map: Record<string, string> = {
                 identification: "1_identification_phase",
                 screening: "2_screening_phase",
                 eligibility: "3_eligibility_phase",
                 inclusion: "4_inclusion_phase"
            };
            
            const key = map[args.phase];
            return prismaEngine.prisma_engine[key];
        }

        if (name === "reviewer_consult_notebooklm") {
            const notebookEngine = await this.resourceManager.getEngine<any>("notebooklm_tool");
            const nbTool = notebookEngine.notebooklm_tool;
            const integration = nbTool["2_research_workflow_integration"].integration_points;
            
            // Map simple step names to JSON keys
            const map: Record<string, string> = {
                "literature_review": "step_3_literature_and_theory",
                "prisma": "prisma_support",
                "qualitative": "step_5_qualitative_questions",
                "reporting": "step_10_reporting"
            };

            const key = map[args.current_step] || args.current_step;
            const guidance = integration[key];

            if (!guidance) {
                return {
                    error: `No specific NotebookLM guidance for step '${args.current_step}'.`,
                    available_steps: Object.keys(map),
                    general_tips: nbTool["0_when_to_use"]
                };
            }

            return {
                step: args.current_step,
                role: guidance.role,
                workflow: guidance.workflow,
                suggested_queries: guidance.example_queries,
                tip: "Use these queries in your NotebookLM notebook (via browser or MCP)."
            };
        }

        if (name === "reviewer_execute_search") {
            const apiKey = process.env.TAVILY_API_KEY;
            if (!apiKey) {
                return { error: "TAVILY_API_KEY is not set. Please use a free key from tavily.com." };
            }

            try {
                // Free Tier Strategy: Lower max_results, handle 429
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for free tier stability

                const response = await fetch("https://api.tavily.com/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        api_key: apiKey,
                        query: args.query,
                        max_results: args.max_results || 3, // Default to 3 for "Free Align"
                        search_depth: "basic",
                        include_answer: true
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    if (response.status === 429) {
                        return { error: "Rate limit exceeded (Free Tier). Please wait a moment before searching again." };
                    }
                    throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
                }

                const data: any = await response.json();
                
                // Log this action
                await this.stateManager.logAction(this.name, "web_search", `Searched for: ${args.query}`);
                
                return {
                    query: args.query,
                    ai_answer: data.answer,
                    result_count: data.results?.length || 0,
                    // Limit output size for free tier LLM context window
                    results: data.results?.slice(0, 5).map((r: any) => ({
                        title: r.title,
                        url: r.url,
                        content: r.content.substring(0, 300), // Truncate content
                        score: r.score
                    })) || []
                };
            } catch (error: any) {
                return { error: `Search failed: ${error.message}` };
            }
        }

        if (name === "reviewer_query_knowledge") {
            const allKnowledge = state.knowledge_base || [];
            const query = (args.search_term || "").toLowerCase();
            
            const filtered = allKnowledge.filter((k: any) => 
                !query || 
                k.content.toLowerCase().includes(query) || 
                k.source.toLowerCase().includes(query) ||
                (k.tags && k.tags.some((t: any) => t.toLowerCase().includes(query)))
            );

            return {
                total_entries: allKnowledge.length,
                results: filtered,
                count: filtered.length
            };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
}
