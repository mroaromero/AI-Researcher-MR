
import fs from 'fs/promises';
import path from 'path';
import { BaseEngine } from '../types.js';

export class ResourceManager {
    private assetsPath: string;
    private cache: Map<string, BaseEngine> = new Map();

    constructor() {
        // However, we are writing in TS. 
        // In the build output (JS), __dirname will be available.
        this.assetsPath = path.resolve(__dirname, '..', '..', 'assets');
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
