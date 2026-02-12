
import { BaseAgent } from './BaseAgent.js';
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
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const searchEngine = await this.resourceManager.getEngine<any>("web_search_tool");
        
        if (name === "reviewer_generate_search_query") {
            const booleanBuilder = searchEngine.web_search_tool["2_boolean_search_builder"];
            const strategy = args.strategy || "broad";
            const vars = args.variables;

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

        throw new Error(`Unknown tool: ${name}`);
    }
}
