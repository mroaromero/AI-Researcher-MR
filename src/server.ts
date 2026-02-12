
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    Tool
} from "@modelcontextprotocol/sdk/types.js";
import { ResourceManager } from "./managers/ResourceManager.js";
import { StateManager } from "./managers/StateManager.js";
import { OrchestratorAgent } from "./agents/OrchestratorAgent.js";
import { MethodologistAgent } from "./agents/MethodologistAgent.js";
import { HypothesisAgent } from "./agents/HypothesisAgent.js";
import { ReviewerAgent } from "./agents/ReviewerAgent.js";
import { WriterAgent } from "./agents/WriterAgent.js";
import { BaseAgent } from "./agents/BaseAgent.js";

export class ResearchServer {
    private server: Server;
    private resourceManager: ResourceManager;
    private stateManager: StateManager;
    private agents: Map<string, BaseAgent> = new Map();

    constructor() {
        this.server = new Server(
            {
                name: "ai-research-mr",
                version: "1.0.0",
            },
            {
                capabilities: {
                    resources: {},
                    tools: {},
                },
            }
        );

        this.resourceManager = new ResourceManager();
        this.stateManager = new StateManager();

        this.registerAgents();
        this.setupHandlers();
    }

    private toolMap: Map<string, BaseAgent> = new Map();

    private registerAgents() {
        const agents = [
            new OrchestratorAgent(this.resourceManager, this.stateManager),
            new MethodologistAgent(this.resourceManager, this.stateManager),
            new HypothesisAgent(this.resourceManager, this.stateManager),
            new ReviewerAgent(this.resourceManager, this.stateManager),
            new WriterAgent(this.resourceManager, this.stateManager)
        ];

        for (const agent of agents) {
            this.agents.set(agent.name, agent);
            const tools = agent.getTools();
            for (const tool of tools) {
                this.toolMap.set(tool.name, agent);
            }
        }
    }

    private setupHandlers() {
        // List Resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            const engines = await this.resourceManager.listEngines();
            return {
                resources: engines.map(name => ({
                    uri: `research://engine/${name}`,
                    name: `${name} JSON Engine`,
                    mimeType: "application/json",
                    description: `Configuration and logic for ${name}`
                }))
            };
        });

        // Read Resource
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            const match = uri.match(/^research:\/\/engine\/(.+)$/);
            if (!match) {
                throw new Error(`Invalid resource URI: ${uri}`);
            }
            const engineName = match[1];
            const engine = await this.resourceManager.getEngine(engineName);
            return {
                contents: [{
                    uri: uri,
                    mimeType: "application/json",
                    text: JSON.stringify(engine, null, 2)
                }]
            };
        });

        // List Tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            let allTools: Tool[] = [];
            for (const agent of this.agents.values()) {
                allTools = allTools.concat(agent.getTools());
            }
            return { tools: allTools };
        });

        // Call Tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            const agent = this.toolMap.get(name);
            if (!agent) {
                throw new Error(`Tool not found: ${name}`);
            }

            try {
                const result = await agent.handleToolCall(name, args);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error in agent ${agent.name}: ${error.message}` }],
                    isError: true,
                };
            }
        });
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        // console.error("AI ResearchMR Server running on stdio");
    }
}
