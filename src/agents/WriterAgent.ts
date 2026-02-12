
import { BaseAgent } from './BaseAgent.js';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class WriterAgent extends BaseAgent {
    public name = "writer";
    public description = "Expert in academic writing, drafting, and APA 7 referencing.";

    getTools(): Tool[] {
        return [
            {
                name: "writer_get_drafting_template",
                description: "Get the blueprint for writing a specific section of the document based on the project type (Thesis, Paper, Essay).",
                inputSchema: {
                    type: "object",
                    properties: {
                        section: { 
                            type: "string", 
                            enum: [
                                "introduction", 
                                "objectives", 
                                "methodology", 
                                "results", 
                                "discussion", 
                                "conclusions", 
                                "abstract_resumen",
                                "theoretical_framework",
                                "development", // For essays
                                "essay_argument_1",
                                "essay_argument_2",
                                "essay_conclusion"
                            ] 
                        },
                        project_type: { 
                            type: "string", 
                            enum: ["thesis", "paper", "essay"],
                            description: "Override the project type stored in state." 
                        }
                    },
                    required: ["section"]
                }
            },
            {
                name: "writer_format_apa",
                description: "Format a reference according to APA 7 standards.",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: { type: "string", enum: ["journal_article", "book", "website"] },
                        data: { type: "object", description: "Fields: author, year, title, source, doi/url" }
                    },
                    required: ["type", "data"]
                }
            },
            {
                name: "writer_get_connectors",
                description: "Get a list of academic connectors for specific writing purposes.",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: { 
                            type: "string", 
                            enum: ["contrast", "addition", "cause_effect", "conclusion", "example", "emphasis", "sequence"] 
                        }
                    },
                    required: ["type"]
                }
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const state = await this.stateManager.loadState();
        const draftingEngine = await this.resourceManager.getEngine<any>("drafting_engine");
        const productEngine = await this.resourceManager.getEngine<any>("product_definition_engine");
        
        if (name === "writer_get_drafting_template") {
            // 1. Determine Project Type
            const projectType = args.project_type || state.project_info?.project_type || "thesis";
            const section = args.section;

            // 2. Logic Switch based on Type
            if (projectType === "essay") {
                const essayModule = productEngine.product_definition_engine["3_essay_module"];
                
                // Map common sections to Essay specific parts if needed
                let template = null;
                let strategy = essayModule.drafting_strategy;

                if (section === "introduction") {
                    template = essayModule.structure_flow.find((p: any) => p.part.includes("Introducción"));
                } else if (section === "development" || section === "essay_argument_1") {
                    template = essayModule.structure_flow.find((p: any) => p.part.includes("Desarrollo"));
                } else if (section === "conclusions" || section === "essay_conclusion") {
                    template = essayModule.structure_flow.find((p: any) => p.part.includes("Conclusión"));
                } else {
                    // Fallback to searching in structure_flow by simpler match
                     template = essayModule.structure_flow.find((p: any) => p.part.toLowerCase().includes(section));
                }

                if (!template) {
                     return {
                        error: `Section '${section}' not found for project type 'Essay'. Available: introduction, development, conclusions.`,
                        valid_sections: ["introduction", "development", "conclusions"]
                    };
                }

                return {
                    project_type: "Essay",
                    section: section,
                    blueprint: template,
                    advice: strategy
                };
            }

            // 3. Logic for Thesis and Papers (Scientific)
            // They share 'drafting_engine' for atomic sections but might have specific overrides
            
            const blueprints = draftingEngine.drafting_engine["1_core_sections_blueprints"];
            // Map common names to JSON keys
            const sectionKey = section === "objectives" ? "objectives_system" : section;
            
            let blueprint = blueprints[sectionKey];

            // Specific override for Papers if we had distinct templates (currently checking product definition for structure hints)
            let extraGuidance = "";
            if (projectType === "paper") {
                const paperModule = productEngine.product_definition_engine["2_scientific_article_module"];
                extraGuidance = `\n[Paper Specific]: ${paperModule.drafting_strategy}`;
                
                // Use IMRyD validation if possible, or just append hints
            }

            if (!blueprint) {
                 return {
                    error: `Section '${section}' not found for project type '${projectType}'.`,
                    valid_sections: Object.keys(blueprints)
                };
            }

            return {
                project_type: projectType,
                section: section,
                blueprint: blueprint,
                advice: "Write 'backwards' (Results -> Intro) for better coherence." + extraGuidance
            };
        }

        if (name === "writer_format_apa") {
            const engine = await this.resourceManager.getEngine<any>("apa_7_engine");
            return {
                apa_engine_data: engine, 
                instruction: "Use the attached APA engine rules to format the citation."
            };
        }

        if (name === "writer_get_connectors") {
            const engine = await this.resourceManager.getEngine<any>("connectors_library");
            const requestedType = args.type.toLowerCase();
            
            // The JSON has top-level keys like "1_structuring_and_ordering" -> "categories" -> [ { intention, connectors } ]
            // We need to flatten or search this structure.
            
            let foundConnectors: string[] = [];
            let foundIntention = "";

            const library = engine.connectors_library;
            for (const sectionKey in library) {
                if (sectionKey === "metadata") continue;
                
                const section = library[sectionKey];
                if (section.categories) {
                    for (const cat of section.categories) {
                        const intention = cat.intention.toLowerCase();
                        // Loose matching logic
                        if (intention.includes(requestedType) || 
                           (requestedType === "cause_effect" && (intention.includes("causa") || intention.includes("consecuencia"))) ||
                           (requestedType === "sequence" && intention.includes("ordenar")) ||
                           (requestedType === "emphasis" && intention.includes("énfasis"))
                        ) {
                            foundConnectors = [...foundConnectors, ...cat.connectors];
                            foundIntention = cat.intention; // Keep the last one found or combine
                        }
                    }
                }
            }
            
            if (foundConnectors.length === 0) {
                 return {
                    error: `Connector type '${requestedType}' not found in library.`,
                    tips: "Try generic types like: contrast, addition, cause, conclusion, sequence."
                 };
            }

            return {
                requested_type: requestedType,
                intention_found: foundIntention || "Combined",
                connectors: foundConnectors,
                usage_tip: "Use these to improve flow between paragraphs."
            };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
}
