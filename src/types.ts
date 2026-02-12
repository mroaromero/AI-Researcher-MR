
export interface ResearchStep {
    phase: string;
    description: string;
    action?: string;
    sub_tasks?: string[];
    linked_engines?: Record<string, string>;
    critical_decision?: string;
    options?: string[];
    routing_logic?: Record<string, string>;
}

export interface MasterEngine {
    metadata: {
        component: string;
        context: string;
        purpose: string;
        version: string;
        critical_instruction: string;
    };
    research_process_master_engine: Record<string, ResearchStep | string>;
}

export interface BaseEngine {
    metadata: any;
    [key: string]: any;
}

export interface ResearchState {
    current_step: string;
    project_info: {
        topic: string;
        project_type?: "thesis" | "paper" | "essay";
        paradigm?: string;
        approach?: string;
        research_question?: string;
        objectives?: string[];
        hypothesis?: string;
        design?: string;
        population?: string;
    };
    accumulated_data: Record<string, any>;
    logs: {
        timestamp: string;
        agent: string;
        action: string;
        details: string;
    }[];
}
