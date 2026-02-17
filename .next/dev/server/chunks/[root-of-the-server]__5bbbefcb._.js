module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/mcp/managers/ResourceManager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResourceManager",
    ()=>ResourceManager
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class ResourceManager {
    assetsPath;
    cache = new Map();
    constructor(){
        // In Next.js / Vercel, usage of process.cwd() is safer to find the project root
        this.assetsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'assets');
    }
    async getEngine(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(this.assetsPath, `${name}.json`);
        try {
            const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(filePath, 'utf-8');
            const engine = JSON.parse(data);
            this.cache.set(name, engine);
            return engine;
        } catch (error) {
            throw new Error(`Failed to load engine '${name}': ${error.message}`);
        }
    }
    async listEngines() {
        try {
            const files = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readdir(this.assetsPath);
            return files.filter((f)=>f.endsWith('.json')).map((f)=>f.replace('.json', ''));
        } catch (error) {
            console.error("Could not list assets:", error);
            return [];
        }
    }
}
}),
"[project]/src/lib/mcp/managers/StateManager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StateManager",
    ()=>StateManager
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class StateManager {
    statePath;
    currentState = null;
    constructor(){
        this.statePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'research_state.json');
    }
    async loadState() {
        try {
            const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(this.statePath, 'utf-8');
            this.currentState = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, create initial state
            this.currentState = this.createInitialState();
            await this.saveState();
        }
        return this.currentState;
    }
    async saveState() {
        if (!this.currentState) return;
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(this.statePath, JSON.stringify(this.currentState, null, 2), 'utf-8');
    }
    getState() {
        if (!this.currentState) {
            throw new Error("State not loaded. Call loadState() first.");
        }
        return this.currentState;
    }
    async updateState(partial) {
        if (!this.currentState) return;
        this.currentState = {
            ...this.currentState,
            ...partial,
            logs: this.currentState.logs || []
        };
        // Ensure log array exists
        await this.saveState();
    }
    async logAction(agent, action, details) {
        if (!this.currentState) return;
        this.currentState.logs.push({
            timestamp: new Date().toISOString(),
            agent,
            action,
            details
        });
        await this.saveState();
    }
    createInitialState() {
        return {
            current_step: "step_1_conception",
            project_info: {
                topic: ""
            },
            accumulated_data: {},
            logs: []
        };
    }
}
}),
"[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseAgent",
    ()=>BaseAgent
]);
class BaseAgent {
    resourceManager;
    stateManager;
    constructor(resourceManager, stateManager){
        this.resourceManager = resourceManager;
        this.stateManager = stateManager;
    }
}
}),
"[project]/src/lib/mcp/agents/OrchestratorAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrchestratorAgent",
    ()=>OrchestratorAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)");
;
class OrchestratorAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseAgent"] {
    name = "orchestrator";
    description = "Manages the overall research process, tracks progress, and delegates tasks.";
    getTools() {
        return [
            {
                name: "orchestrator_get_current_step",
                description: "Get the current step in the research process and its instructions.",
                inputSchema: {
                    type: "object",
                    properties: {}
                }
            },
            {
                name: "orchestrator_complete_step",
                description: "Mark the current step as complete and move to the next one.",
                inputSchema: {
                    type: "object",
                    properties: {
                        summary: {
                            type: "string",
                            description: "Summary of what was achieved in this step."
                        },
                        next_step_id: {
                            type: "string",
                            description: "The ID of the next step to move to (e.g., 'step_2_problem_definition')."
                        }
                    },
                    required: [
                        "summary",
                        "next_step_id"
                    ]
                }
            },
            {
                name: "orchestrator_reset_project",
                description: "Resets the entire project state to start a new research from scratch. WARNING: Deletes all data.",
                inputSchema: {
                    type: "object",
                    properties: {
                        confirm: {
                            type: "boolean",
                            description: "Must be true to proceed."
                        }
                    },
                    required: [
                        "confirm"
                    ]
                }
            },
            {
                name: "orchestrator_update_project_info",
                description: "Update the project information (topic, research question, etc.).",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: {
                            type: "string"
                        },
                        research_question: {
                            type: "string"
                        },
                        approach: {
                            type: "string",
                            enum: [
                                "Cuantitativo",
                                "Cualitativo",
                                "Mixto"
                            ]
                        },
                        scope: {
                            type: "string",
                            enum: [
                                "Exploratorio",
                                "Descriptivo",
                                "Correlacional",
                                "Explicativo"
                            ]
                        },
                        target_audience: {
                            type: "string"
                        },
                        word_count_limit: {
                            type: "number"
                        },
                        formatting_style: {
                            type: "string"
                        }
                    }
                }
            },
            {
                name: "orchestrator_add_knowledge",
                description: "Add a piece of knowledge, note, or source summary to the project context.",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: {
                            type: "string",
                            description: "The content text to save."
                        },
                        source: {
                            type: "string",
                            description: "Where this came from (e.g., 'NotebookLM', 'Tavily Search', 'User')."
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    },
                    required: [
                        "content",
                        "source"
                    ]
                }
            },
            {
                name: "orchestrator_query_knowledge",
                description: "Retrieve knowledge entries from the project context.",
                inputSchema: {
                    type: "object",
                    properties: {
                        search_term: {
                            type: "string",
                            description: "Keyword to filter content or source."
                        }
                    }
                }
            }
        ];
    }
    async handleToolCall(name, args) {
        const state = await this.stateManager.loadState();
        const masterEngine = await this.resourceManager.getEngine("research_process_master_engine");
        // Use optional chaining or type assertion if necessary, though direct access is usually fine if type definition is correct
        const steps = masterEngine.research_process_master_engine;
        switch(name){
            case "orchestrator_get_current_step":
                const currentStepId = state.current_step;
                const stepData = steps[currentStepId];
                return {
                    current_step_id: currentStepId,
                    project_info: state.project_info,
                    instructions: stepData,
                    recommended_actions: stepData?.recommended_actions || []
                };
            case "orchestrator_complete_step":
                this.stateManager.logAction(this.name, "complete_step", `Completed ${state.current_step}. Summary: ${args.summary}`);
                // Determine next step dynamically
                let nextStepId = args.next_step_id;
                const currentStepData = steps[state.current_step];
                // Check if the current step has routing logic (e.g., Step 4B)
                if (currentStepData && currentStepData.routing_logic) {
                    const approach = state.project_info?.approach?.toLowerCase();
                    if (approach) {
                        if (approach === "cuantitativo" && currentStepData.routing_logic.quantitative_path) {
                            nextStepId = "step_5_quantitative_hypothesis"; // Could be extracted more dynamically, but hardcoded for safety alongside JSON
                        } else if (approach === "cualitativo" && currentStepData.routing_logic.qualitative_path) {
                            nextStepId = "step_5_qualitative_questions";
                        } else if (approach === "mixto") {
                            nextStepId = "step_5_to_9_mixed_methods_note";
                        }
                    }
                }
                // Fallback or explicit override
                if (!nextStepId) {
                    // If no ID provided and no routing found, defaulting to next key in map (risky but better than crash)
                    const keys = Object.keys(steps);
                    const currentIndex = keys.indexOf(state.current_step);
                    if (currentIndex >= 0 && currentIndex < keys.length - 1) {
                        nextStepId = keys[currentIndex + 1];
                    }
                }
                // Update state to next step
                this.stateManager.updateState({
                    current_step: nextStepId
                });
                // Get data for the NEW step to provide immediate recommendations
                const nextStepData = steps[nextStepId];
                // Save accumulated data if any
                return {
                    status: "success",
                    previous_step: state.current_step,
                    new_step: nextStepId,
                    message: `Advanced to ${nextStepId}`,
                    auto_routed: !!currentStepData?.routing_logic,
                    recommended_actions: nextStepData?.recommended_actions || []
                };
            case "orchestrator_update_project_info":
                const updates = {
                    ...args
                };
                // Extract specs
                const specs = {
                    target_audience: args.target_audience,
                    word_count_limit: args.word_count_limit,
                    formatting_style: args.formatting_style
                };
                // Remove specs from top-level updates (optional, but keeps object clean)
                delete updates.target_audience;
                delete updates.word_count_limit;
                delete updates.formatting_style;
                await this.stateManager.updateState({
                    project_info: {
                        ...state.project_info,
                        ...updates,
                        specs: {
                            ...state.project_info?.specs,
                            ...specs
                        }
                    }
                });
                return {
                    status: "success",
                    updated_info: {
                        ...updates,
                        specs
                    }
                };
            case "orchestrator_reset_project":
                if (!args.confirm) return {
                    error: "Please confirm reset with 'confirm: true'."
                };
                // Hard Reset
                const emptyState = {
                    current_step: "step_1_conception",
                    project_info: {
                        topic: ""
                    },
                    accumulated_data: {},
                    drafts: {},
                    logs: []
                };
                await this.stateManager.updateState(emptyState);
                return {
                    message: "Project reset successful. Ready for a new research.",
                    current_step: "step_1_conception"
                };
            case "orchestrator_add_knowledge":
                const newEntry = {
                    id: crypto.randomUUID(),
                    content: args.content,
                    source: args.source,
                    tags: args.tags || [],
                    timestamp: new Date().toISOString()
                };
                const currentKnowledge = state.knowledge_base || [];
                await this.stateManager.updateState({
                    knowledge_base: [
                        ...currentKnowledge,
                        newEntry
                    ]
                });
                return {
                    status: "success",
                    entry_id: newEntry.id,
                    message: "Added to knowledge base."
                };
            case "orchestrator_query_knowledge":
                const allKnowledge = state.knowledge_base || [];
                const query = (args.search_term || "").toLowerCase();
                const filtered = allKnowledge.filter((k)=>!query || k.content.toLowerCase().includes(query) || k.source.toLowerCase().includes(query) || k.tags && k.tags.some((t)=>t.toLowerCase().includes(query)));
                return {
                    total_entries: allKnowledge.length,
                    results: filtered,
                    count: filtered.length
                };
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
}),
"[project]/src/lib/mcp/agents/MethodologistAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MethodologistAgent",
    ()=>MethodologistAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)");
;
class MethodologistAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseAgent"] {
    name = "methodologist";
    description = "Expert in research methodology, paradigms, designs, and sampling.";
    getTools() {
        return [
            {
                name: "methodologist_recommend_design",
                description: "Recommends a research design based on the study's goal and scope.",
                inputSchema: {
                    type: "object",
                    properties: {
                        scope: {
                            type: "string",
                            enum: [
                                "Exploratorio",
                                "Descriptivo",
                                "Correlacional",
                                "Explicativo"
                            ]
                        },
                        approach: {
                            type: "string",
                            enum: [
                                "Cuantitativo",
                                "Cualitativo",
                                "Mixto"
                            ]
                        }
                    },
                    required: [
                        "scope",
                        "approach"
                    ]
                }
            },
            {
                name: "methodologist_calculate_sample",
                description: "Calculates sample size for finite or infinite populations with adjustable confidence levels.",
                inputSchema: {
                    type: "object",
                    properties: {
                        population_size: {
                            type: "number",
                            description: "Total population size (N). Leave empty or 0 if infinite."
                        },
                        confidence_level: {
                            type: "number",
                            description: "Confidence level. Supported: 0.90, 0.95 (default), 0.99."
                        },
                        margin_of_error: {
                            type: "number",
                            description: "Margin of error (e.g., 0.05 for 5%). Default is 0.05."
                        },
                        p_value: {
                            type: "number",
                            description: "Probability of success (p). Default is 0.5."
                        }
                    }
                }
            },
            {
                name: "methodologist_check_consistency",
                description: "Validates the consistency between the chosen approach and design (The 'Golden Rule').",
                inputSchema: {
                    type: "object",
                    properties: {
                        approach: {
                            type: "string",
                            enum: [
                                "Cuantitativo",
                                "Cualitativo",
                                "Mixto"
                            ]
                        },
                        design: {
                            type: "string"
                        }
                    },
                    required: [
                        "approach",
                        "design"
                    ]
                }
            }
        ];
    }
    async handleToolCall(name, args) {
        const state = await this.stateManager.loadState();
        const engine = await this.resourceManager.getEngine("methodology_engine");
        if (name === "methodologist_recommend_design") {
            const designs = engine.methodology_engine["3_research_designs"];
            // Intelligent Fallback: Use arg OR state
            const approach = (args.approach || state.project_info?.approach || "").toLowerCase();
            if (!approach) return {
                error: "Approach not specified and not found in state."
            };
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
                    recommended_designs: [
                        "Secuencial",
                        "Concurrente",
                        "Transformación"
                    ],
                    advice: "Combine both qualitative and quantitative phases. See 'methodology_engine' for details on mixed methods integration.",
                    logic: engine.methodology_engine["1_paradigm_and_approach"].approaches[2]
                };
            } else {
                return {
                    error: `Unknown approach: ${approach}`
                };
            }
        }
        if (name === "methodologist_calculate_sample") {
            // Organic Data Flow: Read from State if arg is missing
            let N = args.population_size;
            if (N === undefined || N === null) {
                // Try to parse from state.population (which might be a string description)
                // If it's a number-like string "1500", use it.
                const popState = state.project_info?.population;
                if (popState && !isNaN(Number(popState))) {
                    N = Number(popState);
                } else {
                    N = 0; // Default to infinite if unknown
                }
            }
            const confidence = args.confidence_level || 0.95;
            // Z-score lookup table
            const zScores = {
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
                const denominator = Math.pow(e, 2) * (N - 1) + Math.pow(Z, 2) * p * q;
                n = numerator / denominator;
            } else {
                // Infinite
                // n = (Z² * p * q) / e²
                n = Math.pow(Z, 2) * p * q / Math.pow(e, 2);
            }
            const finalSampleSize = Math.ceil(n);
            // Save to State
            await this.stateManager.updateState({
                project_info: {
                    ...state.project_info,
                    sample_size: finalSampleSize
                }
            });
            return {
                sample_size: finalSampleSize,
                parameters_used: {
                    N,
                    confidence_level: confidence,
                    Z_score: Z,
                    e,
                    p
                }
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
}),
"[project]/src/lib/mcp/agents/HypothesisAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HypothesisAgent",
    ()=>HypothesisAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)");
;
class HypothesisAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseAgent"] {
    name = "hypothesis_expert";
    description = "Advanced hypothesis engine following a 7-module cognitive architecture.";
    getTools() {
        return [
            {
                name: "hypothesis_semantic_exploration",
                description: "Deconstructs a research problem into 5 Ws (Journalistic) and Key Terms (Module 1).",
                inputSchema: {
                    type: "object",
                    properties: {
                        problem_statement: {
                            type: "string",
                            description: "The full research problem or question."
                        }
                    },
                    required: [
                        "problem_statement"
                    ]
                }
            },
            {
                name: "hypothesis_map_variables",
                description: "Provides definitions and categories for variables involved (Module 2/3).",
                inputSchema: {
                    type: "object",
                    properties: {
                        independent: {
                            type: "string"
                        },
                        dependent: {
                            type: "string"
                        },
                        extras: {
                            type: "string",
                            description: "Control, mediating, or moderating variables."
                        }
                    },
                    required: [
                        "independent",
                        "dependent"
                    ]
                }
            },
            {
                name: "hypothesis_generate_candidates",
                description: "Generates hypothesis templates based on the variables and logic type (Module 3/4).",
                inputSchema: {
                    type: "object",
                    properties: {
                        iv: {
                            type: "string",
                            description: "Independent Variable (or Central Phenomenon for Qualitative)"
                        },
                        dv: {
                            type: "string",
                            description: "Dependent Variable (or Context/Experience for Qualitative)"
                        },
                        type: {
                            type: "string",
                            enum: [
                                "Descriptive",
                                "Correlational",
                                "Causal",
                                "Null",
                                "Directional",
                                "Qualitative"
                            ]
                        }
                    },
                    required: [
                        "iv",
                        "dv",
                        "type"
                    ]
                }
            },
            {
                name: "hypothesis_validate_checklist",
                description: "Returns the quality checklist criteria to evaluate the hypothesis (Module 5).",
                inputSchema: {
                    type: "object",
                    properties: {}
                }
            }
        ];
    }
    async handleToolCall(name, args) {
        const state = await this.stateManager.loadState();
        const engine = await this.resourceManager.getEngine("hypothesis_engine");
        switch(name){
            case "hypothesis_semantic_exploration":
                return {
                    instructions: engine.hypothesis_engine.module_1_semantic_exploration,
                    guidance: "Analyze the input problem using these steps."
                };
            case "hypothesis_map_variables":
                const mappedVariables = {
                    independent: args.independent,
                    dependent: args.dependent,
                    extras: args.extras
                };
                // Save to State (Organic Flow)
                await this.stateManager.updateState({
                    project_info: {
                        ...state.project_info,
                        variables: mappedVariables
                    }
                });
                return {
                    definitions: engine.hypothesis_engine.module_2_variable_mapping,
                    mapping_result: {
                        ...mappedVariables,
                        note: "Ensure these are operationalized (measurable). Saved to project state."
                    }
                };
            case "hypothesis_generate_candidates":
                const templates = engine.hypothesis_engine.module_3_creative_generation.types;
                const selected = templates.find((t)=>t.type === args.type);
                if (!selected) return {
                    error: `Type ${args.type} not found.`
                };
                let draft = selected.template;
                // Standard quantitative replacements
                draft = draft.replace("[Variable Independiente]", args.iv).replace("[Variable X]", args.iv).replace("[Variable 1]", args.iv);
                draft = draft.replace("[Variable Dependiente]", args.dv).replace("[Variable Y]", args.dv).replace("[Variable 2]", args.dv);
                // Qualitative replacements (handling the mapping)
                // IV -> Phenomenon
                // DV -> Context/Experience
                draft = draft.replace("[Fenómeno Central]", args.iv);
                draft = draft.replace("[Contexto/Experiencia]", args.dv);
                const generatedHypothesis = draft;
                // Save to State (Organic Flow)
                await this.stateManager.updateState({
                    project_info: {
                        ...state.project_info,
                        hypothesis: generatedHypothesis,
                        // Update variables if provided here too, to be safe
                        variables: {
                            independent: args.iv,
                            dependent: args.dv,
                            extras: state.project_info?.variables?.extras // Preserve if existing
                        }
                    }
                });
                return {
                    type: args.type,
                    template: generatedHypothesis,
                    logic: selected.logic,
                    state_update: "Hypothesis saved to project."
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
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/src/lib/search-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchService",
    ()=>SearchService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tavily$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tavily/core/dist/index.mjs [app-route] (ecmascript)");
;
class SearchService {
    client;
    constructor(){
        const apiKey = process.env.TAVILY_API_KEY;
        if (apiKey) {
            this.client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tavily$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tavily"])({
                apiKey
            });
        }
    }
    async search(query, maxResults = 5) {
        if (!this.client) {
            console.warn("TAVILY_API_KEY is not set. Returning mock results.");
            return [
                {
                    title: "Mock Result: " + query,
                    url: "https://example.com/mock",
                    content: "This is a mock search result because the TAVILY_API_KEY environment variable is not set.",
                    score: 1.0
                }
            ];
        }
        try {
            const response = await this.client.search(query, {
                searchDepth: "advanced",
                maxResults: maxResults,
                includeAnswer: true
            });
            return response.results.map((r)=>({
                    title: r.title,
                    url: r.url,
                    content: r.content,
                    score: r.score
                }));
        } catch (error) {
            console.error("Search failed:", error);
            throw new Error("Failed to execute search query.");
        }
    }
}
}),
"[project]/src/lib/mcp/agents/ReviewerAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewerAgent",
    ()=>ReviewerAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search-service.ts [app-route] (ecmascript)");
;
;
class ReviewerAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseAgent"] {
    name = "reviewer";
    description = "Expert in literature review, web search strategies, and PRISMA protocol.";
    getTools() {
        return [
            {
                name: "reviewer_generate_search_query",
                description: "Generates an optimized search query string based on variables and strategy.",
                inputSchema: {
                    type: "object",
                    properties: {
                        variables: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        strategy: {
                            type: "string",
                            enum: [
                                "broad",
                                "specific",
                                "methodological"
                            ]
                        }
                    },
                    required: [
                        "variables",
                        "strategy"
                    ]
                }
            },
            {
                name: "reviewer_prisma_guide",
                description: "Get instructions for a specific phase of the PRISMA systematic review.",
                inputSchema: {
                    type: "object",
                    properties: {
                        phase: {
                            type: "string",
                            enum: [
                                "identification",
                                "screening",
                                "eligibility",
                                "inclusion"
                            ]
                        }
                    },
                    required: [
                        "phase"
                    ]
                }
            },
            {
                name: "reviewer_execute_search",
                description: "Execute a web search query to find academic papers or information using Tavily.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string"
                        },
                        max_results: {
                            type: "number",
                            description: "Default 5"
                        }
                    },
                    required: [
                        "query"
                    ]
                }
            },
            {
                name: "reviewer_consult_notebooklm",
                description: "Get guidance on how to use Google NotebookLM for specific research phases.",
                inputSchema: {
                    type: "object",
                    properties: {
                        current_step: {
                            type: "string",
                            description: "The current research step (e.g., 'literature_review', 'prisma', 'qualitative')."
                        }
                    },
                    required: [
                        "current_step"
                    ]
                }
            }
        ];
    }
    async handleToolCall(name, args) {
        const state = await this.stateManager.loadState(); // Load state for Organic logic
        const searchEngine = await this.resourceManager.getEngine("web_search_tool");
        if (name === "reviewer_generate_search_query") {
            const booleanBuilder = searchEngine.web_search_tool["2_boolean_search_builder"];
            const strategy = args.strategy || "broad";
            // Organic Data Flow: Use state variables if args are missing
            let vars = args.variables;
            if (!vars || vars.length === 0) {
                const storedVars = state.project_info?.variables;
                if (storedVars && storedVars.independent && storedVars.dependent) {
                    vars = [
                        storedVars.independent,
                        storedVars.dependent
                    ];
                } else {
                    return {
                        error: "No variables provided and none found in project state."
                    };
                }
            }
            // Construct search query using the template: (Var1 OR Syn1) AND (Var2 OR Syn2)
            // For now, we simulate synonyms with a placeholder or simple logic
            let finalQuery = "";
            const groups = vars.map((v)=>{
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
            const prismaEngine = await this.resourceManager.getEngine("prisma_engine");
            const map = {
                identification: "1_identification_phase",
                screening: "2_screening_phase",
                eligibility: "3_eligibility_phase",
                inclusion: "4_inclusion_phase"
            };
            const key = map[args.phase];
            return prismaEngine.prisma_engine[key];
        }
        if (name === "reviewer_consult_notebooklm") {
            const notebookEngine = await this.resourceManager.getEngine("notebooklm_tool");
            const nbTool = notebookEngine.notebooklm_tool;
            const integration = nbTool["2_research_workflow_integration"].integration_points;
            // Map simple step names to JSON keys
            const map = {
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
            const service = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SearchService"]();
            const results = await service.search(args.query, args.max_results || 5);
            // Log this action
            await this.stateManager.logAction(this.name, "web_search", `Searched for: ${args.query}`);
            return {
                query: args.query,
                result_count: results.length,
                results: results.map((r)=>({
                        title: r.title,
                        url: r.url,
                        snippet: r.content.substring(0, 200) + "..."
                    }))
            };
        }
        throw new Error(`Unknown tool: ${name}`);
    }
}
}),
"[project]/src/lib/mcp/agents/WriterAgent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WriterAgent",
    ()=>WriterAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/BaseAgent.ts [app-route] (ecmascript)");
;
class WriterAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$BaseAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseAgent"] {
    name = "writer";
    description = "Expert in academic writing, drafting, and APA 7 referencing.";
    getTools() {
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
                                "development",
                                "essay_argument_1",
                                "essay_argument_2",
                                "essay_conclusion"
                            ]
                        },
                        project_type: {
                            type: "string",
                            enum: [
                                "thesis",
                                "paper",
                                "essay"
                            ],
                            description: "Override the project type stored in state."
                        }
                    },
                    required: [
                        "section"
                    ]
                }
            },
            {
                name: "writer_format_apa",
                description: "Format a reference according to APA 7 standards.",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: [
                                "journal_article",
                                "book",
                                "website"
                            ]
                        },
                        data: {
                            type: "object",
                            description: "Fields: author, year, title, source, doi/url"
                        }
                    },
                    required: [
                        "type",
                        "data"
                    ]
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
                            enum: [
                                "contrast",
                                "addition",
                                "cause_effect",
                                "conclusion",
                                "example",
                                "emphasis",
                                "sequence"
                            ]
                        }
                    },
                    required: [
                        "type"
                    ]
                }
            },
            {
                name: "writer_save_section",
                description: "Save the content of a specific section to the project drafts.",
                inputSchema: {
                    type: "object",
                    properties: {
                        section: {
                            type: "string",
                            description: "Name of the section (e.g., 'introduction')."
                        },
                        content: {
                            type: "string",
                            description: "The content text of the section."
                        }
                    },
                    required: [
                        "section",
                        "content"
                    ]
                }
            },
            {
                name: "writer_assemble_document",
                description: "Assemble all saved sections into a single document based on the project structure.",
                inputSchema: {
                    type: "object",
                    properties: {
                        format: {
                            type: "string",
                            enum: [
                                "markdown",
                                "html"
                            ],
                            description: "Output format (default: markdown)."
                        }
                    }
                }
            }
        ];
    }
    async handleToolCall(name, args) {
        const state = await this.stateManager.loadState();
        const draftingEngine = await this.resourceManager.getEngine("drafting_engine");
        const productEngine = await this.resourceManager.getEngine("product_definition_engine");
        if (name === "writer_get_drafting_template") {
            // 1. Determine Project Type
            const projectType = args.project_type || state.project_info?.project_type || "thesis";
            const section = args.section;
            // 2. Logic Switch based on Type
            if (section === "theoretical_framework") {
                const tfEngine = await this.resourceManager.getEngine("theoretical_framework_engine");
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
                    template = essayModule.structure_flow.find((p)=>p.part.includes("Introducción"));
                } else if (section === "development" || section === "essay_argument_1") {
                    template = essayModule.structure_flow.find((p)=>p.part.includes("Desarrollo"));
                } else if (section === "conclusions" || section === "essay_conclusion") {
                    template = essayModule.structure_flow.find((p)=>p.part.includes("Conclusión"));
                } else {
                    // Fallback to searching in structure_flow by simpler match
                    template = essayModule.structure_flow.find((p)=>p.part.toLowerCase().includes(section));
                }
                if (!template) {
                    return {
                        error: `Section '${section}' not found for project type 'Essay'. Available: introduction, development, conclusions.`,
                        valid_sections: [
                            "introduction",
                            "development",
                            "conclusions"
                        ]
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
            const engine = await this.resourceManager.getEngine("apa_7_engine");
            return {
                apa_engine_data: engine,
                instruction: "Use the attached APA engine rules to format the citation."
            };
        }
        if (name === "writer_get_connectors") {
            const engine = await this.resourceManager.getEngine("connectors_library");
            const requestedType = args.type.toLowerCase();
            // The JSON has top-level keys like "1_structuring_and_ordering" -> "categories" -> [ { intention, connectors } ]
            // We need to flatten or search this structure.
            let foundConnectors = [];
            let foundIntention = "";
            const library = engine.connectors_library;
            for(const sectionKey in library){
                if (sectionKey === "metadata") continue;
                const section = library[sectionKey];
                if (section.categories) {
                    for (const cat of section.categories){
                        const intention = cat.intention.toLowerCase();
                        // Loose matching logic
                        if (intention.includes(requestedType) || requestedType === "cause_effect" && (intention.includes("causa") || intention.includes("consecuencia")) || requestedType === "sequence" && intention.includes("ordenar") || requestedType === "emphasis" && intention.includes("énfasis")) {
                            foundConnectors = [
                                ...foundConnectors,
                                ...cat.connectors
                            ];
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
                total_sections: Object.keys({
                    ...state.drafts,
                    [args.section]: args.content
                }).length
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
            let structure = [];
            // Helper to extract structure
            if (projectType === "thesis") {
                structure = productEngine.product_definition_engine["1_thesis_module"].structure_blueprint;
            } else if (projectType === "paper") {
                // Approximate structure for Paper (simplification for general assembly)
                structure = [
                    {
                        section: "Title",
                        content: "..."
                    },
                    {
                        section: "Abstract",
                        content: "..."
                    },
                    {
                        section: "Introduction",
                        content: "..."
                    },
                    {
                        section: "Methodology",
                        content: "..."
                    },
                    {
                        section: "Results",
                        content: "..."
                    },
                    {
                        section: "Discussion",
                        content: "..."
                    },
                    {
                        section: "References",
                        content: "..."
                    }
                ];
            } else if (projectType === "essay") {
                structure = productEngine.product_definition_engine["3_essay_module"].structure_flow;
            }
            // Assembly Loop
            let assembledSections = 0;
            const missingSections = [];
            // If we have a defined structure, try to follow it
            if (structure && structure.length > 0) {
                structure.forEach((item)=>{
                    // Normalize keys: "1. Introducción" -> "introduction" logic or loose match
                    // This is tricky because keys in drafts might be "introduction" while structure says "1. Introducción"
                    // We will iterate through drafts to find matches if exact key fails
                    // Simple heuristic: check if we have a draft that "looks like" this section part
                    // or if the user used the standard keys suggested by 'writer_get_drafting_template'
                    // Specific mapping for standard keys
                    const map = {
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
                        const draftKey = Object.keys(drafts).find((k)=>k.toLowerCase().includes(key) || item.section && k.toLowerCase().includes(item.section.toLowerCase()));
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
                for (const [key, content] of Object.entries(drafts)){
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
}),
"[project]/src/lib/mcp/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ResearchServer",
    ()=>ResearchServer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@modelcontextprotocol/sdk/server/index.js [external] (@modelcontextprotocol/sdk/server/index.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@modelcontextprotocol/sdk/server/stdio.js [external] (@modelcontextprotocol/sdk/server/stdio.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@modelcontextprotocol/sdk/types.js [external] (@modelcontextprotocol/sdk/types.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$managers$2f$ResourceManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/managers/ResourceManager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$managers$2f$StateManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/managers/StateManager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$OrchestratorAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/OrchestratorAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$MethodologistAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/MethodologistAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$HypothesisAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/HypothesisAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$ReviewerAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/ReviewerAgent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$WriterAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/agents/WriterAgent.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
class ResearchServer {
    server;
    resourceManager;
    stateManager;
    agents = new Map();
    constructor(){
        this.server = new __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$index$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["Server"]({
            name: "ai-research-mr",
            version: "1.0.0"
        }, {
            capabilities: {
                resources: {},
                tools: {}
            }
        });
        this.resourceManager = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$managers$2f$ResourceManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ResourceManager"]();
        this.stateManager = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$managers$2f$StateManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StateManager"]();
        this.registerAgents();
        this.setupHandlers();
    }
    toolMap = new Map();
    registerAgents() {
        const agents = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$OrchestratorAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OrchestratorAgent"](this.resourceManager, this.stateManager),
            new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$MethodologistAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MethodologistAgent"](this.resourceManager, this.stateManager),
            new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$HypothesisAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HypothesisAgent"](this.resourceManager, this.stateManager),
            new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$ReviewerAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ReviewerAgent"](this.resourceManager, this.stateManager),
            new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$agents$2f$WriterAgent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WriterAgent"](this.resourceManager, this.stateManager)
        ];
        for (const agent of agents){
            this.agents.set(agent.name, agent);
            const tools = agent.getTools();
            for (const tool of tools){
                this.toolMap.set(tool.name, agent);
            }
        }
    }
    setupHandlers() {
        // List Resources
        this.server.setRequestHandler(__TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["ListResourcesRequestSchema"], async ()=>{
            const engines = await this.resourceManager.listEngines();
            return {
                resources: engines.map((name)=>({
                        uri: `research://engine/${name}`,
                        name: `${name} JSON Engine`,
                        mimeType: "application/json",
                        description: `Configuration and logic for ${name}`
                    }))
            };
        });
        // Read Resource
        this.server.setRequestHandler(__TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["ReadResourceRequestSchema"], async (request)=>{
            const uri = request.params.uri;
            const match = uri.match(/^research:\/\/engine\/(.+)$/);
            if (!match) {
                throw new Error(`Invalid resource URI: ${uri}`);
            }
            const engineName = match[1];
            const engine = await this.resourceManager.getEngine(engineName);
            return {
                contents: [
                    {
                        uri: uri,
                        mimeType: "application/json",
                        text: JSON.stringify(engine, null, 2)
                    }
                ]
            };
        });
        // List Tools
        this.server.setRequestHandler(__TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["ListToolsRequestSchema"], async ()=>{
            let allTools = [];
            for (const agent of this.agents.values()){
                allTools = allTools.concat(agent.getTools());
            }
            return {
                tools: allTools
            };
        });
        // Call Tool
        this.server.setRequestHandler(__TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$types$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$types$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["CallToolRequestSchema"], async (request)=>{
            const { name, arguments: args } = request.params;
            const agent = this.toolMap.get(name);
            if (!agent) {
                throw new Error(`Tool not found: ${name}`);
            }
            try {
                const result = await agent.handleToolCall(name, args);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error in agent ${agent.name}: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        });
    }
    async executeTool(name, args) {
        const agent = this.toolMap.get(name);
        if (!agent) {
            throw new Error(`Tool not found: ${name}`);
        }
        return await agent.handleToolCall(name, args);
    }
    getTools() {
        let allTools = [];
        for (const agent of this.agents.values()){
            allTools = allTools.concat(agent.getTools());
        }
        return allTools;
    }
    async start() {
        const transport = new __TURBOPACK__imported__module__$5b$externals$5d2f40$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js__$5b$external$5d$__$2840$modelcontextprotocol$2f$sdk$2f$server$2f$stdio$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$modelcontextprotocol$2f$sdk$29$__["StdioServerTransport"]();
        await this.server.connect(transport);
    // console.error("AI ResearchMR Server running on stdio");
    }
    getStateManager() {
        return this.stateManager;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/mcp/tools-loader.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getResearchServer",
    ()=>getResearchServer,
    "getResearchTools",
    ()=>getResearchTools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/server.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const globalForServer = globalThis;
function getResearchServer() {
    if (!globalForServer.researchServer) {
        globalForServer.researchServer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ResearchServer"]();
    }
    return globalForServer.researchServer;
}
// Simple JSON Schema to Zod mapper for our specific agent schemas
function jsonSchemaToZod(schema) {
    if (!schema) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any();
    if (schema.type === "string") {
        if (schema.enum) {
            // Zod enum requires at least one value, and typescript tuple issues
            // @ts-ignore
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(schema.enum);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe(schema.description || "");
    }
    if (schema.type === "number" || schema.type === "integer") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe(schema.description || "");
    }
    if (schema.type === "boolean") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().describe(schema.description || "");
    }
    if (schema.type === "array") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(jsonSchemaToZod(schema.items)).describe(schema.description || "");
    }
    if (schema.type === "object") {
        const shape = {};
        if (schema.properties) {
            for(const key in schema.properties){
                let fieldSchema = jsonSchemaToZod(schema.properties[key]);
                // Handle optional fields
                if (!schema.required?.includes(key)) {
                    fieldSchema = fieldSchema.optional();
                }
                shape[key] = fieldSchema;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object(shape).describe(schema.description || "");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any();
}
async function getResearchTools() {
    const server = getResearchServer();
    const mcpTools = server.getTools();
    const aiTools = {};
    for (const tool of mcpTools){
        aiTools[tool.name] = {
            description: tool.description,
            parameters: jsonSchemaToZod(tool.inputSchema),
            execute: async (args)=>{
                // Execute directly via our bridge method
                console.log(`[Agent Bridge] Executing ${tool.name}`, args);
                try {
                    const result = await server.executeTool(tool.name, args);
                    return result;
                } catch (error) {
                    console.error(`[Agent Bridge] Error in ${tool.name}:`, error);
                    return {
                        error: error.message
                    };
                }
            }
        };
    }
    return aiTools;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$tools$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mcp/tools-loader.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mammoth/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$tools$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$tools$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const pdf = __turbopack_context__.r("[project]/node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs [app-route] (ecmascript)");
;
;
// Helper to chunk text
function chunkText(text, maxChunkSize = 1500) {
    const chunks = [];
    const paragraphs = text.split(/\n\n+/);
    let currentChunk = "";
    for (const para of paragraphs){
        if (currentChunk.length + para.length > maxChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += "\n\n" + para;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No file uploaded"
            }, {
                status: 400
            });
        }
        console.log(`[File Upload] Received file: ${file.name} (${file.size} bytes)`);
        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";
        // Parse based on file type
        if (file.name.endsWith(".pdf")) {
            const data = await pdf(buffer);
            text = data.text;
        } else if (file.name.endsWith(".docx")) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractRawText"]({
                buffer: buffer
            });
            text = result.value;
        } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
            text = buffer.toString("utf-8");
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unsupported file type"
            }, {
                status: 400
            });
        }
        if (!text.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Could not extract text from file"
            }, {
                status: 400
            });
        }
        // Chunk and Save to Knowledge Base
        const chunks = chunkText(text);
        const server = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mcp$2f$tools$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResearchServer"])();
        const stateManager = server.getStateManager();
        const state = await stateManager.loadState();
        const newEntries = chunks.map((chunk, index)=>({
                id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
                content: chunk,
                source: `uploaded_file:${file.name}`,
                tags: [
                    "user_upload",
                    "file_parsing"
                ],
                timestamp: new Date().toISOString()
            }));
        const currentKnowledge = state.knowledge_base || [];
        await stateManager.updateState({
            knowledge_base: [
                ...currentKnowledge,
                ...newEntries
            ]
        });
        console.log(`[File Upload] Extracted ${chunks.length} chunks from ${file.name}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Processed ${file.name} successfully. Added ${chunks.length} knowledge entries.`,
            filename: file.name
        });
    } catch (error) {
        console.error("Error processing file upload:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error: " + error.message
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5bbbefcb._.js.map