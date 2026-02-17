
import { BaseAgent } from './BaseAgent';
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
            },
            {
                name: "writer_export_document",
                description: "Export the full assembled document to a file (Markdown, DOCX, HTML).",
                inputSchema: {
                    type: "object",
                    properties: {
                        format: { type: "string", enum: ["markdown", "docx", "txt"], default: "markdown" },
                        filename: { type: "string", description: "Optional filename (without extension)." }
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
            const type = args.type; // journal_article, book, website
            const data = args.data; // author, year, title, source, etc.
            
            // Helper to handle Authors
            const formatAuthors = (authors: string[]) => {
                if (!authors || authors.length === 0) return "Anon.";
                if (authors.length === 1) return authors[0];
                if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
                // APA 7: up to 20 authors. For simplicity/LLM usage:
                return `${authors[0]} et al.`; 
            };

            let citation = "";
            let in_text = "";
            
            const templates = engine.apa_7_engine["6_reference_list_formatting"].templates;
            
            // logic for different types
            if (type === "journal_article") {
                // "{Apellido}, {Inicial}. ({Año}). {Título del artículo}. {Nombre de la Revista}, {Volumen}({Número}), {pp-pp}. https://doi.org/xxxxx"
                // We user args data to replace.
                // Expected data keys: author_last, author_init, year, title, journal, volume, issue, pages, doi
                const t = templates.journal_article.with_doi; // Default to best case
                citation = `${data.author_last}, ${data.author_init}. (${data.year}). ${data.title}. *${data.journal}*, *${data.volume}*(${data.issue}), ${data.pages}. ${data.doi || ""}`;
                in_text = `(${data.author_last}, ${data.year})`;
            } 
            else if (type === "book") {
                 // "{Apellido}, {Inicial}. ({Año}). {Título del libro} ({Edición}). {Editorial}."
                 citation = `${data.author_last}, ${data.author_init}. (${data.year}). *${data.title}*. ${data.publisher}.`;
                 in_text = `(${data.author_last}, ${data.year})`;
            }
            else if (type === "website") {
                // "{Apellido}, {Inicial}. ({Fecha}). {Título de la página}. {Nombre del sitio web}. {URL}"
                citation = `${data.author_last}, ${data.author_init}. (${data.date || "s.f."}). *${data.title}*. ${data.site_name}. ${data.url}`;
                in_text = `(${data.author_last}, ${data.date ? data.date.split(' ')[0] : "s.f."})`;
            } else {
                return { error: `Unsupported citation type '${type}'. Supported: journal_article, book, website.` };
            }

            return {
                formatted_citation: citation,
                in_text_parenthetical: in_text,
                rule_used: `APA 7 - ${type}`,
                note: "Italics are marked with asterisks."
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
            const title = state.project_info?.topic || "Untitled Research Project";
            let header = `# ${title}\n\n`;
            
            // Title Page Info (Simulated)
            header += `**Author:** User (AI Assisted)\n`;
            header += `**Date:** ${new Date().toLocaleDateString()}\n`;
            if (specs) {
                header += `**Target Audience:** ${specs.target_audience || "General"}\n`;
                header += `**Word Count Limit:** ${specs.word_count_limit || "N/A"}\n`;
            }
            header += `\n---\n\n`;

            // Table of Contents Placeholder
            let toc = "## Table of Contents\n\n";
            let contentBody = ""; 
            
            // Determine order based on Project Type using Product Engine
            let structure: any[] = [];
            
            // Helper to extract structure (Robust Fallback)
            try {
                if (projectType === "thesis") {
                     structure = productEngine.product_definition_engine["1_thesis_module"].structure_blueprint || [];
                } else if (projectType === "essay") {
                    structure = productEngine.product_definition_engine["3_essay_module"].structure_flow || [];
                }
            } catch (e) {
                // Fallback if engine structure is missing
                structure = [];
            }

            // Assembly Loop
            let assembledSections = 0;
            const missingSections: string[] = [];

            // If we have a defined structure, try to follow it
            if (structure && structure.length > 0) {
                structure.forEach((item: any) => {
                    // Logic to find key match...
                    // We map common JSON structure names to our draft keys (which are usually simple lowercase strings like 'introduction')
                    const itemName = item.section || item.part || "unknown";
                    const itemNameLower = itemName.toLowerCase();

                    // Map of "Fancy Name" -> "draft_key"
                    const map: Record<string, string> = {
                        "introducción": "introduction",
                        "marco teórico": "theoretical_framework",
                        "metodología": "methodology",
                        "resultados": "results", 
                        "discusión": "discussion",
                        "conclusiones": "conclusions",
                        "desarrollo": "development",
                        "argumento": "essay_argument_1" // simple heuristic
                    };
                    
                    let key = map[itemNameLower] || itemNameLower;
                    
                    // Fuzzy matching for keys
                    for (const mapKey of Object.keys(map)) {
                        if (itemNameLower.includes(mapKey)) key = map[mapKey];
                    }

                    // Attempt to find content in drafts
                    let content = drafts[key];
                    if (!content) {
                         // Reverse search: do we have a draft that contains this key?
                         const draftKey = Object.keys(drafts).find(k => k.toLowerCase().includes(key) || key.includes(k.toLowerCase()));
                         if (draftKey) content = drafts[draftKey];
                    }

                    // Formatting the section title for the document
                    const sectionTitle = itemName.replace(/^\d+\.\s*/, ''); // Remove numbering if present "1. Intro" -> "Intro"

                    if (content) {
                        const anchor = sectionTitle.replace(/\s+/g, '-').toLowerCase();
                        toc += `- [${sectionTitle}](#${anchor})\n`;
                        contentBody += `\n## ${sectionTitle}\n\n${content}\n\n`;
                        assembledSections++;
                    } else {
                        toc += `- [${sectionTitle} (Pending)](#)\n`;
                        contentBody += `\n## ${sectionTitle}\n\n*[Content pending for ${sectionTitle}...]*\n\n`; 
                        missingSections.push(sectionTitle);
                    }
                });
            } else {
                // Fallback: Just dump whatever drafts we have
                for (const [key, content] of Object.entries(drafts)) {
                    contentBody += `## ${key}\n\n${content}\n\n`;
                    toc += `- [${key}](#${key})\n`;
                    assembledSections++;
                }
            }

            // Combine everything
            const fullDocument = header + toc + "\n---\n\n" + contentBody;

            return {
                document_content: fullDocument,
                stats: {
                    sections_assembled: assembledSections,
                    missing_sections: missingSections,
                    total_chars: fullDocument.length
                },
                message: `Document assembled. ${assembledSections} sections found, ${missingSections.length} missing.`
            };
        }

        if (name === "writer_export_document") {
            // Quick assemble reuse
            // We call assemble internally to get the latest content
            const assembly = await this.handleToolCall("writer_assemble_document", {});
            const content = assembly.document_content;
            
            let format = (args.format || "markdown").toLowerCase();
            const filenameArg = args.filename || state.project_info?.topic?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "research_draft";
            
            let ext = "md";
            if (format === "docx") ext = "docx";
            if (format === "txt") ext = "txt";
            
            const filename = `${filenameArg}.${ext}`;
            
            const fs = require('fs/promises');
            const path = require('path');
            const exportDir = path.join(process.cwd(), 'public', 'exports');
            
            try {
                await fs.mkdir(exportDir, { recursive: true });
                const filePath = path.join(exportDir, filename);
                
                // Honest Export Logic
                // We write the Markdown content to the file.
                // If it is .docx, we are just saving text with a .docx extension.
                // We must inform the user about this.
                
                await fs.writeFile(filePath, content, 'utf-8');

                let warningMessage = "";
                if (format === 'docx') {
                    warningMessage = " (Note: This is a text-based DOCX. Open with Word -> Convert from Text, or use Markdown viewer).";
                }

                return {
                    status: "success",
                    filename: filename,
                    format: format,
                    download_url: `/exports/${filename}`,
                    message: `Document exported successfully${warningMessage}`
                };
            } catch (error: any) {
                return { error: `Failed to export document: ${error.message}` };
            }
        }

        throw new Error(`Unknown tool: ${name}`);
    }
}
