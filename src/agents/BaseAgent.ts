
import { ResourceManager } from '../managers/ResourceManager.js';
import { StateManager } from '../managers/StateManager.js';
import { CallToolRequestSchema, ListToolsRequestSchema,  Tool } from "@modelcontextprotocol/sdk/types.js";

export abstract class BaseAgent {
    protected resourceManager: ResourceManager;
    protected stateManager: StateManager;
    public abstract name: string;
    public abstract description: string;

    constructor(resourceManager: ResourceManager, stateManager: StateManager) {
        this.resourceManager = resourceManager;
        this.stateManager = stateManager;
    }

    abstract getTools(): Tool[];
    abstract handleToolCall(name: string, args: any): Promise<any>;
}
