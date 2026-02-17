
import { BaseAgent } from './BaseAgent';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class MethodologistAgent extends BaseAgent {
    public name = "methodologist";
    public description = "Expert in research methodology, paradigms, designs, and sampling.";

    getTools(): Tool[] {
        return [
            {
                name: "methodologist_recommend_design",
                description: "Recommends a research design based on the study's goal and scope.",
                inputSchema: {
                    type: "object",
                    properties: {
                        scope: { type: "string", enum: ["Exploratorio", "Descriptivo", "Correlacional", "Explicativo"] },
                        approach: { type: "string", enum: ["Cuantitativo", "Cualitativo", "Mixto"] }
                    },
                    required: ["scope", "approach"]
                }
            },
            {
                name: "methodologist_calculate_sample",
                description: "Calculates sample size for finite or infinite populations with adjustable confidence levels.",
                inputSchema: {
                    type: "object",
                    properties: {
                        population_size: { type: "number", description: "Total population size (N). Leave empty or 0 if infinite." },
                        confidence_level: { type: "number", description: "Confidence level. Supported: 0.90, 0.95 (default), 0.99." },
                        margin_of_error: { type: "number", description: "Margin of error (e.g., 0.05 for 5%). Default is 0.05." },
                        p_value: { type: "number", description: "Probability of success (p). Default is 0.5." }
                    },
                    required: []
                }
            },
            {
                name: "methodologist_check_consistency",
                description: "Validates the consistency between the chosen approach and design (The 'Golden Rule').",
                inputSchema: {
                    type: "object",
                    properties: {
                        approach: { type: "string", enum: ["Cuantitativo", "Cualitativo", "Mixto"] },
                        design: { type: "string" }
                    },
                    required: ["approach", "design"]
                }
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const state = await this.stateManager.loadState();
        const engine = await this.resourceManager.getEngine<any>("methodology_engine");
        
        if (name === "methodologist_recommend_design") {
            const designs = engine.methodology_engine["3_research_designs"];
            // Intelligent Fallback: Use arg OR state
            const approach = (args.approach || state.project_info?.approach || "").toLowerCase();
            
            if (!approach) return { error: "Approach not specified and not found in state." };
            
            if (approach === "cuantitativo") {
                 return {
                    recommended_designs: designs.quantitative_designs,
                    advice: "Select based on control over variables (Experimental) or observation (Non-experimental).",
                    logic: engine.methodology_engine["1_paradigm_and_approach"].approaches[0]
                 };
            } else if (approach === "cualitativo") {
                return {
                    recommended_designs: designs.qualitative_designs,
                    advice: "Select based on the nature of the phenomenon (Culture -> Ethnographic, Experience -> Phenomenological).",
                    logic: engine.methodology_engine["1_paradigm_and_approach"].approaches[1]
                };
            } else if (approach === "mixto") {
                return {
                    recommended_designs: ["Secuencial", "Concurrente", "Transformación"],
                    advice: "Combine both qualitative and quantitative phases. See 'methodology_engine' for details on mixed methods integration.",
                    logic: engine.methodology_engine["1_paradigm_and_approach"].approaches[2]
                };
            } else {
                return { error: `Unknown approach: ${approach}` };
            }
        }

        if (name === "methodologist_calculate_sample") {
            // Organic Data Flow: Read from State if arg is missing
            let N = args.population_size;
            if (N === undefined || N === null) {
                // Try to parse from state.project_info (using 'any' cast as population might be dynamic)
                const info = state.project_info as any;
                const popState = info?.population;
                if (popState && !isNaN(Number(popState))) {
                    N = Number(popState);
                } else {
                    N = 0; // Default to infinite if unknown
                }
            }

            const confidence = args.confidence_level || 0.95;
            
            // Z-score lookup table
            const zScores: Record<number, number> = {
                0.90: 1.645,
                0.95: 1.96,
                0.99: 2.576
            };
            
            const Z = zScores[confidence] || 1.96;
            const e = args.margin_of_error || 0.05;
            const p = args.p_value || 0.5;
            const q = 1 - p;

            let n;
            if (N > 0) {
                 // Finite population formula
                 // n = (Z² * p * q * N) / (e² * (N-1) + Z² * p * q)
                 const numerator = Math.pow(Z, 2) * p * q * N;
                 const denominator = (Math.pow(e, 2) * (N - 1)) + (Math.pow(Z, 2) * p * q);
                 n = numerator / denominator;
            } else {
                // Infinite
                // n = (Z² * p * q) / e²
                n = (Math.pow(Z, 2) * p * q) / Math.pow(e, 2);
            }

            const finalSampleSize = Math.ceil(n);
            
            // Save to State
            await this.stateManager.updateState({
                project_info: {
                    ...state.project_info,
                    sample_size: finalSampleSize
                } as any
            });

            return {
                sample_size: finalSampleSize,
                parameters_used: { N, confidence_level: confidence, Z_score: Z, e, p }
            };
        }

        if (name === "methodologist_check_consistency") {
            // "0_golden_rule_consistency" logic
            const approach = args.approach.toLowerCase();
            const design = args.design.toLowerCase();
            
            let consistent = true;
            let message = "Consistency check passed.";

            // Basic heuristic for validation (could be expanded)
            if (approach === "cualitativo" && (design.includes("experimental") || design.includes("encuesta"))) {
                consistent = false;
                message = "CRITICAL ERROR: Qualitative studies cannot use Experimental designs or probabilistic Surveys. Use Ethnography, Phenomenology, etc.";
            }
            
            if (approach === "cuantitativo" && (design.includes("etnograf") || design.includes("fenomenol") || design.includes("teoría fundamentada"))) {
                 consistent = false;
                 message = "CRITICAL ERROR: Quantitative studies cannot use Qualitative designs (Ethnography, etc). Use Experimental or Non-Experimental designs.";
            }

            return {
                is_consistent: consistent,
                feedback: message,
                rule: engine.methodology_engine["0_golden_rule_consistency"]
            };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
}
