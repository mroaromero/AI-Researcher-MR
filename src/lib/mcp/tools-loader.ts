import { z } from "zod";
import { ResearchServer } from "./server";

const globalForServer = globalThis as unknown as { researchServer: ResearchServer };

export function getResearchServer() {
  if (!globalForServer.researchServer) {
    globalForServer.researchServer = new ResearchServer();
  }
  return globalForServer.researchServer;
}

// Simple JSON Schema to Zod mapper for our specific agent schemas
function jsonSchemaToZod(schema: any): z.ZodType<any> {
    if (!schema) return z.any();

    if (schema.type === "string") {
        if (schema.enum) {
            // Zod enum requires at least one value, and typescript tuple issues
            // @ts-ignore
            return z.enum(schema.enum);
        }
        return z.string().describe(schema.description || "");
    }
    
    if (schema.type === "number" || schema.type === "integer") {
        return z.number().describe(schema.description || "");
    }

    if (schema.type === "boolean") {
        return z.boolean().describe(schema.description || "");
    }

    if (schema.type === "array") {
        return z.array(jsonSchemaToZod(schema.items)).describe(schema.description || "");
    }

    if (schema.type === "object") {
        const shape: Record<string, any> = {};
        if (schema.properties) {
            for (const key in schema.properties) {
                let fieldSchema = jsonSchemaToZod(schema.properties[key]);
                // Handle optional fields
                if (!schema.required?.includes(key)) {
                    fieldSchema = fieldSchema.optional();
                }
                shape[key] = fieldSchema;
            }
        }
        return z.object(shape).describe(schema.description || "");
    }

    return z.any();
}

export async function getResearchTools() {
    const server = getResearchServer();
    const mcpTools = server.getTools();
    
    const aiTools: Record<string, any> = {};

    for (const tool of mcpTools) {
        aiTools[tool.name] = {
            description: tool.description,
            parameters: jsonSchemaToZod(tool.inputSchema),
            execute: async (args: any) => {
                // Execute directly via our bridge method
                console.log(`[Agent Bridge] Executing ${tool.name}`, args);
                try {
                    const result = await server.executeTool(tool.name, args);
                    return result;
                } catch (error: any) {
                    console.error(`[Agent Bridge] Error in ${tool.name}:`, error);
                    return { error: error.message };
                }
            }
        };
    }

    return aiTools;
}
