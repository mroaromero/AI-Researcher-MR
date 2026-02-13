
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
            },
            {
                name: "writer_save_section",
                description: "Save the content of a specific section to the project drafts.",
                inputSchema: {
                    type: "object",
                    properties: {
                        section: { type: "string", description: "Name of the section (e.g., 'introduction')." },
                        content: { type: "string", description: "The content text of the section." }
                    },
                    required: ["section", "content"]
                }
            },
            {
                name: "writer_assemble_document",
                description: "Assemble all saved sections into a single document based on the project structure.",
                inputSchema: {
                    type: "object",
                    properties: {
                         format: { type: "string", enum: ["markdown", "html"], description: "Output format (default: markdown)." }
                    }
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
            if (section === "theoretical_framework") {
                 const tfEngine = await this.resourceManager.getEngine<any>("theoretical_framework_engine");
                 return {
                     project_type: projectType,
                     section: section,
                     blueprint: tfEngine.theoretical_framework_engine["3_drafting_templates"],
                     workflow: tfEngine.theoretical_framework_engine["0_construction_workflow"],
                     definitions: tfEngine.theoretical_framework_engine["1_definitions_and_distinctions"],
                     citation_logic: tfEngine.theoretical_framework_engine["5_expert_citation_logic"],
                     advice: "Follow the 'construction workflow' to ensure you are not just listing definitions but connecting them to the problem. STRICTLY FOLLOW the 'citation_logic' for Narrative vs Parenthetical decisions."
                 };
            }

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

        if (name === "writer_save_section") {
            await this.stateManager.updateState({
                drafts: {
                    ...state.drafts,
                    [args.section]: args.content
                }
            });
            return {
                status: "success",
                message: `Section '${args.section}' saved to drafts.`,
                total_sections: Object.keys({ ...state.drafts, [args.section]: args.content }).length
            };
        }

        if (name === "writer_assemble_document") {
            const drafts = state.drafts || {};
            const projectType = state.project_info?.project_type || "thesis";
            const specs = state.project_info?.specs;
            
            // Build the document
            let fullDocument = `# ${state.project_info?.topic || "Untitled Research Project"}\n\n`;
            
            // Add Metadata Header
            if (specs) {
                fullDocument += `> **Target Audience:** ${specs.target_audience || "General"}\n`;
                fullDocument += `> **Word Count Limit:** ${specs.word_count_limit || "N/A"}\n\n`;
            }

            // Determine order based on Project Type using Product Engine
            let structure: any[] = [];
            
            // Helper to extract structure
            if (projectType === "thesis") {
                 structure = productEngine.product_definition_engine["1_thesis_module"].structure_blueprint;
            } else if (projectType === "paper") {
                // Approximate structure for Paper (simplification for general assembly)
                structure = [
                    { section: "Title", content: "..." },
                    { section: "Abstract", content: "..." },
                    { section: "Introduction", content: "..." },
                    { section: "Methodology", content: "..." },
                    { section: "Results", content: "..." },
                    { section: "Discussion", content: "..." },
                    { section: "References", content: "..." }
                ];
            } else if (projectType === "essay") {
                structure = productEngine.product_definition_engine["3_essay_module"].structure_flow;
            }

            // Assembly Loop
            let assembledSections = 0;
            const missingSections: string[] = [];

            // If we have a defined structure, try to follow it
            if (structure && structure.length > 0) {
                structure.forEach((item: any) => {
                    // Normalize keys: "1. Introducción" -> "introduction" logic or loose match
                    // This is tricky because keys in drafts might be "introduction" while structure says "1. Introducción"
                    // We will iterate through drafts to find matches if exact key fails
                    
                    // Simple heuristic: check if we have a draft that "looks like" this section part
                    // or if the user used the standard keys suggested by 'writer_get_drafting_template'
                    
                    // Specific mapping for standard keys
                    const map: Record<string, string> = {
                        "1. Introducción": "introduction", 
                        "Introducción": "introduction",
                        "2. Marco Teórico": "theoretical_framework", 
                        "3. Metodología": "methodology",
                        "4. Resultados": "results", 
                        "5. Discusión": "discussion",
                        "6. Conclusiones": "conclusions"
                    };
                    
                    let key = map[item.section] || map[item.part] || item.section?.toLowerCase();
                    // Essay mapping
                    if (item.part && item.part.includes("Introducción")) key = "introduction";
                    if (item.part && item.part.includes("Desarrollo")) key = "development"; // or arguments
                    if (item.part && item.part.includes("Conclusión")) key = "conclusions";

                    // Check draft
                    // If key is mapped, look for it. If not found, try to find *any* draft that contains the key name
                    let content = drafts[key];
                    
                    if (!content) {
                         // Loose search in drafts keys
                         const draftKey = Object.keys(drafts).find(k => k.toLowerCase().includes(key) || (item.section && k.toLowerCase().includes(item.section.toLowerCase())));
                         if (draftKey) content = drafts[draftKey];
                    }

                    if (content) {
                        fullDocument += `## ${item.section || item.part || key}\n\n${content}\n\n`;
                        assembledSections++;
                    } else {
                        missingSections.push(item.section || item.part || key);
                    }
                });
            } else {
                // Fallback: Just dump all drafts if no structure logic found
                for (const [key, content] of Object.entries(drafts)) {
                    fullDocument += `## ${key}\n\n${content}\n\n`;
                    assembledSections++;
                }
            }

            // Append any drafts that were NOT part of the structure? (Optional, maybe in Appendix)
            
            return {
                document_content: fullDocument,
                stats: {
                    sections_assembled: assembledSections,
                    missing_sections: missingSections,
                    total_chars: fullDocument.length
                },
                message: "Document assembled from drafts."
            };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
}
