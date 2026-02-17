
import { BaseAgent } from './BaseAgent';
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MasterEngine, ResearchStep } from '../types';

export class OrchestratorAgent extends BaseAgent {
    public name = "orchestrator";
    public description = "Manages the overall research process, tracks progress, and delegates tasks.";

    getTools(): Tool[] {
        return [
            {
                name: "orchestrator_get_current_step",
                description: "Get the current step in the research process and its instructions.",
                inputSchema: {
                    type: "object",
                    properties: {},
                }
            },
            {
                name: "orchestrator_complete_step",
                description: "Mark the current step as complete and move to the next one.",
                inputSchema: {
                    type: "object",
                    properties: {
                        summary: { type: "string", description: "Summary of what was achieved in this step." },
                        next_step_id: { type: "string", description: "The ID of the next step to move to (e.g., 'step_2_problem_definition')." },
                        confirm_quality_gate: { type: "boolean", description: "Set to true if you have verified the Quality Gate checks." }
                    },
                    required: ["summary", "next_step_id"]
                }
            },
            {
                name: "orchestrator_reset_project",
                description: "Resets the entire project state to start a new research from scratch. WARNING: Deletes all data.",
                inputSchema: {
                    type: "object",
                    properties: {
                         confirm: { type: "boolean", description: "Must be true to proceed." }
                    },
                    required: ["confirm"]
                }
            },
            {
                name: "orchestrator_update_project_info",
                description: "Update the project information (topic, research question, etc.).",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: { type: "string" },
                        research_question: { type: "string" },
                        approach: { type: "string", enum: ["Cuantitativo", "Cualitativo", "Mixto"] },
                        scope: { type: "string", enum: ["Exploratorio", "Descriptivo", "Correlacional", "Explicativo"] },
                        target_audience: { type: "string" },
                        word_count_limit: { type: "number" },
                        formatting_style: { type: "string" },
                        population: { type: "string", description: "Target population description." },
                        sample_size: { type: "number", description: "Calculated sample size." },
                        variables: { type: "array", items: { type: "string" }, description: "List of defined variables." },
                        hypothesis: { type: "array", items: { type: "string" }, description: "Formulated hypotheses." }
                    }
                }
            },
            {
                name: "orchestrator_get_project_summary",
                description: "Get a high-level summary of the project status, including completion percentage and key statistics.",
                inputSchema: {
                    type: "object",
                    properties: {},
                }
            },
            {
                name: "orchestrator_add_knowledge",
                description: "Add a piece of knowledge, note, or source summary to the project context.",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: { type: "string", description: "The content text to save." },
                        source: { type: "string", description: "Where this came from (e.g., 'NotebookLM', 'Tavily Search', 'User')." },
                        tags: { type: "array", items: { type: "string" } }
                    },
                    required: ["content", "source"]
                }
            },
            {
                name: "orchestrator_query_knowledge",
                description: "Retrieve knowledge entries from the project context.",
                inputSchema: {
                    type: "object",
                    properties: {
                         search_term: { type: "string", description: "Keyword to filter content or source." }
                    }
                }
            }
        ];
    }

    async handleToolCall(name: string, args: any): Promise<any> {
        const state = await this.stateManager.loadState();
        const masterEngine = await this.resourceManager.getEngine<MasterEngine>("research_process_master_engine");

        // Use optional chaining or type assertion if necessary, though direct access is usually fine if type definition is correct
        const steps = masterEngine.research_process_master_engine as Record<string, ResearchStep>;

        switch (name) {
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
                // Determine next step dynamically first to check for Gates
                let nextStepId = args.next_step_id;
                const currentStepData = steps[state.current_step];
                
                // Routing Logic
                if (currentStepData && currentStepData.routing_logic) {
                    const approach = state.project_info?.approach?.toLowerCase();
                    if (approach) {
                        if (approach === "cuantitativo" && currentStepData.routing_logic.quantitative_path) {
                            nextStepId = "step_5_quantitative_hypothesis";
                        } else if (approach === "cualitativo" && currentStepData.routing_logic.qualitative_path) {
                            nextStepId = "step_5_qualitative_questions";
                        } else if (approach === "mixto") {
                             nextStepId = "step_5_to_9_mixed_methods_note";
                        }
                    }
                }

                // Fallback Logic
                if (!nextStepId) {
                     const keys = Object.keys(steps);
                     const currentIndex = keys.indexOf(state.current_step);
                     if (currentIndex >= 0 && currentIndex < keys.length - 1) {
                         nextStepId = keys[currentIndex + 1];
                     }
                }
                
                // QUALITY GATE CHECK
                // We check if there is a gate defined for "current -> next" or just "after current"
                const engineData = masterEngine.research_process_master_engine as any;
                const qualityGates = engineData.quality_gates?.gates || [];
                // Heuristic: check if any gate says "between": "current -> next" or starts with current
                // The JSON format is "step_X → step_Y". We try to match.
                
                // We normalize ids just in case (e.g. "step_2" vs "step_2_problem_definition")
                // For simplified matching, we check if the gate's "between" string contains the current step's short name
                const currentShort = state.current_step.split('_').slice(0, 2).join('_'); // step_1
                
                const activeGate = qualityGates.find((g: any) => g.between.includes(currentShort) && g.between.includes('→'));
                
                if (activeGate && !args.confirm_quality_gate) {
                    return {
                        status: "quality_gate_required",
                        gate_name: activeGate.name,
                        checks: activeGate.checks || activeGate.checks_quantitative || [], // Generic fallback
                        message: `Cannot advance to ${nextStepId} yet. Quality Gate '${activeGate.name}' must be passed.`,
                        instruction: "Review the checks and call 'orchestrator_complete_step' again with 'confirm_quality_gate': true."
                    };
                }

                // If passed or no gate, proceed
                this.stateManager.logAction(this.name, "complete_step", `Completed ${state.current_step}. Summary: ${args.summary}`);

                // Update state
                this.stateManager.updateState({
                    current_step: nextStepId
                });
                
                const nextStepData = steps[nextStepId];

                return {
                    status: "success",
                    previous_step: state.current_step,
                    new_step: nextStepId,
                    message: `Advanced to ${nextStepId}`,
                    quality_gate_passed: activeGate ? true : false,
                    auto_routed: !!currentStepData?.routing_logic,
                    recommended_actions: nextStepData?.recommended_actions || []
                };

            case "orchestrator_update_project_info":
                const updates = { ...args };
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
                        specs: { ...state.project_info?.specs, ...specs }
                    }
                });
                return {
                    status: "success",
                    updated_info: { ...updates, specs }
                };

            case "orchestrator_get_project_summary":
                const allSteps = Object.keys(steps);
                const currentIdx = allSteps.indexOf(state.current_step);
                const progress = Math.round(((currentIdx + 1) / allSteps.length) * 100);

                return {
                    project_status: {
                        current_step: state.current_step,
                        current_phase: steps[state.current_step]?.phase,
                        progress_percentage: `${progress}%`
                    },
                    core_info: {
                        topic: state.project_info?.topic || "Not defined",
                        research_question: state.project_info?.research_question || "Pending",
                        approach: state.project_info?.approach || "Pending",
                        scope: (state.project_info as any)?.scope || "Pending"
                    },
                    statistics: {
                        knowledge_entries: (state.knowledge_base || []).length,
                        draft_sections_completed: Object.keys(state.drafts || {}).length,
                        variables_defined: (state.project_info as any)?.variables?.length || 0
                    },
                    next_actions: steps[state.current_step]?.recommended_actions || []
                };

            case "orchestrator_reset_project":
                if (!args.confirm) return { error: "Please confirm reset with 'confirm: true'." };
                
                // Hard Reset
                // Since updateState performs a shallow merge at the top level, passing empty objects/arrays for keys will effectively clear them.
                const emptyState = {
                    current_step: "step_1_conception",
                    project_info: { topic: "" },
                    accumulated_data: {},
                    drafts: {},
                    knowledge_base: [],
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
                    knowledge_base: [...currentKnowledge, newEntry]
                });

                return {
                    status: "success",
                    entry_id: newEntry.id,
                    message: "Added to knowledge base."
                };

            case "orchestrator_query_knowledge":
                const allKnowledge = state.knowledge_base || [];
                const query = (args.search_term || "").toLowerCase();
                
                const filtered = allKnowledge.filter(k => 
                    !query || 
                    k.content.toLowerCase().includes(query) || 
                    k.source.toLowerCase().includes(query) ||
                    (k.tags && k.tags.some(t => t.toLowerCase().includes(query)))
                );

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
