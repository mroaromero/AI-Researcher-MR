
import { BaseAgent } from './BaseAgent.js';
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MasterEngine, ResearchStep } from '../types.js';

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
                        next_step_id: { type: "string", description: "The ID of the next step to move to (e.g., 'step_2_problem_definition')." }
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
                        formatting_style: { type: "string" }
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

            case "orchestrator_reset_project":
                if (!args.confirm) return { error: "Please confirm reset with 'confirm: true'." };
                
                // Hard Reset
                const emptyState = {
                    current_step: "step_1_conception",
                    project_info: { topic: "" },
                    accumulated_data: {},
                    drafts: {},
                    logs: []
                };
                
                await this.stateManager.updateState(emptyState);
                
                return {
                    message: "Project reset successful. Ready for a new research.",
                    current_step: "step_1_conception"
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
