import { NextResponse } from "next/server";
import { getResearchServer } from "@/lib/mcp/tools-loader";
import { randomUUID } from "crypto";
import mammoth from "mammoth";
const pdf = require("pdf-parse");

// Helper to chunk text
function chunkText(text: string, maxChunkSize: number = 1500): string[] {
    const chunks: string[] = [];
    const paragraphs = text.split(/\n\n+/);
    
    let currentChunk = "";
    
    for (const para of paragraphs) {
        if ((currentChunk.length + para.length) > maxChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += "\n\n" + para;
        }
    }
    
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`[File Upload] Received file: ${file.name} (${file.size} bytes)`);

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    // Parse based on file type
    if (file.name.endsWith(".pdf")) {
        const data = await pdf(buffer);
        text = data.text;
    } else if (file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer: buffer });
        text = result.value;
    } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        text = buffer.toString("utf-8");
    } else {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (!text.trim()) {
         return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    // Chunk and Save to Knowledge Base
    const chunks = chunkText(text);
    const server = getResearchServer();
    const stateManager = server.getStateManager();
    const state = await stateManager.loadState();
    
    const newEntries = chunks.map((chunk, index) => ({
        id: randomUUID(),
        content: chunk,
        source: `uploaded_file:${file.name}`,
        tags: ["user_upload", "file_parsing"],
        timestamp: new Date().toISOString()
    }));

    const currentKnowledge = state.knowledge_base || [];
    await stateManager.updateState({
        knowledge_base: [...currentKnowledge, ...newEntries]
    });

    console.log(`[File Upload] Extracted ${chunks.length} chunks from ${file.name}`);

    return NextResponse.json({ 
        success: true, 
        message: `Processed ${file.name} successfully. Added ${chunks.length} knowledge entries.`,
        filename: file.name
    });

  } catch (error: any) {
    console.error("Error processing file upload:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
