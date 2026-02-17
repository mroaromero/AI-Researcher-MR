
import fs from 'fs/promises';
import path from 'path';
import { ResearchState } from '../types';

class AsyncMutex {
    private mutex = Promise.resolve();

    lock(): Promise<() => void> {
        let unlock: () => void = () => {};
        const next = new Promise<void>(resolve => { unlock = resolve; });
        const previous = this.mutex;
        this.mutex = next; // Update the tail of the queue
        
        return previous.then(() => unlock);
    }

    async dispatch<T>(fn: (() => T) | (() => Promise<T>)): Promise<T> {
        const unlock = await this.lock();
        try {
            return await Promise.resolve(fn());
        } finally {
            unlock();
        }
    }
}

export class StateManager {
    private statePath: string;
    private currentState: ResearchState | null = null;
    private mutex = new AsyncMutex();

    constructor() {
        this.statePath = path.resolve(process.cwd(), 'research_state.json');
    }

    async loadState(): Promise<ResearchState> {
        // Load can be concurrent, but if we want strict consistency, we lock it too.
        // For now, load is usually read-only or init.
        // Let's lock to be safe against reading while writing.
        return this.mutex.dispatch(async () => {
            try {
                const data = await fs.readFile(this.statePath, 'utf-8');
                this.currentState = JSON.parse(data);
            } catch (error) {
                // If file doesn't exist, create initial state
                this.currentState = this.createInitialState();
                await this._saveStateInternal(); // Use internal save
            }
            return this.currentState!;
        });
    }

    // Internal save without lock (caller must hold lock)
    private async _saveStateInternal(): Promise<void> {
        if (!this.currentState) return;
        await fs.writeFile(this.statePath, JSON.stringify(this.currentState, null, 2), 'utf-8');
    }

    async saveState(): Promise<void> {
        return this.mutex.dispatch(async () => {
            await this._saveStateInternal();
        });
    }

    getState(): ResearchState {
        // Synchronous getter of *cached* state. Logic might rely on this.
        // Warning: This might return stale data if a write is pending in the mutex queue.
        // But for this app, it's mostly acceptable.
        if (!this.currentState) {
            throw new Error("State not loaded. Call loadState() first.");
        }
        return this.currentState;
    }

    async updateState(partial: Partial<ResearchState>): Promise<void> {
        return this.mutex.dispatch(async () => {
             if (!this.currentState) return;
             // Deep merge logic if needed, but for now top-level merge
             this.currentState = { 
                 ...this.currentState, 
                 ...partial, 
                 logs: this.currentState.logs || [],
                 // Ensure nested objects are merged correctly if passed partially? 
                 // The current logic does shallow merge of top keys. 
                 // Project info usually needs merge.
                 project_info: {
                     ...this.currentState.project_info,
                     ...(partial.project_info || {})
                 }
             };
             await this._saveStateInternal();
        });
    }

    async logAction(agent: string, action: string, details: string): Promise<void> {
        return this.mutex.dispatch(async () => {
            if (!this.currentState) return;
            this.currentState.logs.push({
                timestamp: new Date().toISOString(),
                agent,
                action,
                details
            });
            await this._saveStateInternal();
        });
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
