
export interface ResearchStep {
    phase: string;
    description: string;
    action?: string;
    sub_tasks?: string[];
    linked_engines?: Record<string, string>;
    critical_decision?: string;
    options?: string[];
    routing_logic?: Record<string, string>;
    recommended_actions?: {
        agent: string;
        tool: string;
        description: string;
        arguments_hint?: string;
    }[];
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
        methodology_design?: string;
        population?: string;
        sample_size?: number;
        variables?: {
            independent: string;
            dependent: string;
            extras?: string;
        };
        specs?: {
            target_audience?: string;
            word_count_limit?: number;
            formatting_style?: string;
        };
    };
    drafts?: Record<string, string>; // Section name -> Content
    knowledge_base?: {
        id: string;
        content: string;
        source: string; // e.g., "notebooklm", "search", "user_upload"
        tags?: string[];
        timestamp: string;
    }[];
    accumulated_data: Record<string, any>;
    logs: {
        timestamp: string;
        agent: string;
        action: string;
        details: string;
    }[];
}
