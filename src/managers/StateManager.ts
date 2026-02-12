
import fs from 'fs/promises';
import path from 'path';
import { ResearchState } from '../types.js';

export class StateManager {
    private statePath: string;
    private currentState: ResearchState | null = null;

    constructor() {
        this.statePath = path.resolve(process.cwd(), 'research_state.json');
    }

    async loadState(): Promise<ResearchState> {
        try {
            const data = await fs.readFile(this.statePath, 'utf-8');
            this.currentState = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, create initial state
            this.currentState = this.createInitialState();
            await this.saveState();
        }
        return this.currentState!;
    }

    async saveState(): Promise<void> {
        if (!this.currentState) return;
        await fs.writeFile(this.statePath, JSON.stringify(this.currentState, null, 2), 'utf-8');
    }

    getState(): ResearchState {
        if (!this.currentState) {
            throw new Error("State not loaded. Call loadState() first.");
        }
        return this.currentState;
    }

    updateState(partial: Partial<ResearchState>): void {
        if (!this.currentState) return;
        this.currentState = { ...this.currentState, ...partial };
        // We don't await save here to avoid blocking, but in a real app might want to queue it
        this.saveState().catch(console.error);
    }

    logAction(agent: string, action: string, details: string): void {
        if (!this.currentState) return;
        this.currentState.logs.push({
            timestamp: new Date().toISOString(),
            agent,
            action,
            details
        });
        this.saveState().catch(console.error);
    }

    private createInitialState(): ResearchState {
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
