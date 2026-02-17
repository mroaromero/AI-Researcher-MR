#!/usr/bin/env node
import { ResearchServer } from './server.js';

const server = new ResearchServer();
server.start().catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
});
