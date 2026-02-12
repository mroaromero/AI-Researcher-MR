
import { BaseAgent } from './BaseAgent.js';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class HypothesisAgent extends BaseAgent {
    public name = "hypothesis_expert";
    public description = "Advanced hypothesis engine following a 7-module cognitive architecture.";

    getTools(): Tool[] {
        return [
            {
                name: "hypothesis_semantic_exploration",
                description: "Deconstructs a research problem into 5 Ws (Journalistic) and Key Terms (Module 1).",
                inputSchema: {
                    type: "object",
                    properties: {
                        problem_statement: { type: "string", description: "The full research problem or question." }
                    },
                    required: ["problem_statement"]
                }
            },
            {
                name: "hypothesis_map_variables",
                description: "Provides definitions and categories for variables involved (Module 2/3).",
                inputSchema: {
                    type: "object",
                    properties: {
                        independent: { type: "string" },
                        dependent: { type: "string" },
                        extras: { type: "string", description: "Control, mediating, or moderating variables." }
                    },
                    required: ["independent", "dependent"]
                }
            },
            {
                name: "hypothesis_generate_candidates",
                description: "Generates hypothesis templates based on the variables and logic type (Module 3/4).",
                inputSchema: {
                    type: "object",
                    properties: {
                        iv: { type: "string", description: "Independent Variable (or Central Phenomenon for Qualitative)" },
                        dv: { type: "string", description: "Dependent Variable (or Context/Experience for Qualitative)" },
                        type: { type: "string", enum: ["Descriptive", "Correlational", "Causal", "Null", "Directional", "Qualitative"] }
                    },
                    required: ["iv", "dv", "type"]
                }
            },
            {
                name: "hypothesis_validate_checklist",
                description: "Returns the quality checklist criteria to evaluate the hypothesis (Module 5).",
                inputSchema: {
                    type: "object",
                    properties: {},
                }
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const engine = await this.resourceManager.getEngine<any>("hypothesis_engine");
        
        switch (name) {
            case "hypothesis_semantic_exploration":
                return {
                    instructions: engine.hypothesis_engine.module_1_semantic_exploration,
                    guidance: "Analyze the input problem using these steps."
                };

            case "hypothesis_map_variables":
                return {
                    definitions: engine.hypothesis_engine.module_2_variable_mapping,
                    mapping_result: {
                        independent: args.independent,
                        dependent: args.dependent,
                        note: "Ensure these are operationalized (measurable)."
                    }
                };

            case "hypothesis_generate_candidates":
                const templates = engine.hypothesis_engine.module_3_creative_generation.types;
                const selected = templates.find((t: any) => t.type === args.type);
                
                if (!selected) return { error: `Type ${args.type} not found.` };

                let draft = selected.template;
                // Standard quantitative replacements
                draft = draft.replace("[Variable Independiente]", args.iv).replace("[Variable X]", args.iv).replace("[Variable 1]", args.iv);
                draft = draft.replace("[Variable Dependiente]", args.dv).replace("[Variable Y]", args.dv).replace("[Variable 2]", args.dv);
                
                // Qualitative replacements (handling the mapping)
                // IV -> Phenomenon
                // DV -> Context/Experience
                draft = draft.replace("[Fenómeno Central]", args.iv);
                draft = draft.replace("[Contexto/Experiencia]", args.dv);

                return {
                    type: args.type,
                    template: draft,
                    logic: selected.logic
                };

            case "hypothesis_validate_checklist":
                return {
                    checklist: engine.hypothesis_engine.module_4_validation_checklist,
                    simulation_projections: engine.hypothesis_engine.module_5_simulation_projection
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
