
import fs from 'fs/promises';
import path from 'path';
import { BaseEngine } from '../types.js';

export class ResourceManager {
    private assetsPath: string;
    private cache: Map<string, BaseEngine> = new Map();

    constructor() {
        // Adjust path based on whether we are in src (TS) or build (JS)
        // Assuming assets is at the project root: project/assets
        // And this file is at: project/src/managers/ResourceManager.ts or project/build/managers/ResourceManager.js
        this.assetsPath = path.resolve(process.cwd(), 'assets');
    }

    async getEngine<T extends BaseEngine>(name: string): Promise<T> {
        if (this.cache.has(name)) {
            return this.cache.get(name) as T;
        }

        const filePath = path.join(this.assetsPath, `${name}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const engine = JSON.parse(data);
            this.cache.set(name, engine);
            return engine as T;
        } catch (error: any) {
            throw new Error(`Failed to load engine '${name}': ${error.message}`);
        }
    }

    async listEngines(): Promise<string[]> {
        try {
            const files = await fs.readdir(this.assetsPath);
            return files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
        } catch (error) {
            console.error("Could not list assets:", error);
            return [];
        }
    }
}
