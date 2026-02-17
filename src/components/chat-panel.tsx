"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Send, Upload, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function ChatPanel({
  onStepsChange,
  onReasoningChange,
}: {
  onStepsChange?: (steps: any[]) => void;
  onReasoningChange?: (trace: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    maxSteps: 5,
    onResponse: (response: Response) => {
      // Future: connect this to update headers or status
    },
    onFinish: (message: any) => {
      // Future: extract reasoning or tool calls here
    },
  } as any) as any;

  // Handle File Upload for Sprint 5 Prep
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
              method: "POST",
              body: formData
          });

          if (res.ok) {
              const data = await res.json();
              // Simulate "adding" to chat context by notifying user to ask about it
              handleInputChange({ target: { value: `I have uploaded ${file.name}. Please analyze it.` } } as any);
          } else {
              console.error("Upload failed");
              alert("Upload failed. Please try again.");
          }
      } catch (err) {
          console.error(err);
          alert("Error uploading file.");
      } finally {
          setIsUploading(false);
          // Reset input
          if (e.target) e.target.value = "";
      }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Sync tool invocations to StepsPanel and ReasoningPanel
  useEffect(() => {
    if (!onStepsChange && !onReasoningChange) return;

    const steps: any[] = [];
    const traceEvents: any[] = [];
    
    // Add initial system step
    steps.push({ id: "init", title: "Initialize Agents", status: "completed", summary: "Agents ready." });

    messages.forEach((m: any, msgIdx: number) => {
       if (m.toolInvocations) {
          m.toolInvocations.forEach((tool: any, toolIdx: number) => {
             const status = tool.state === 'result' ? 'completed' : 'active';
             // Populate Steps
             steps.push({
                id: tool.toolCallId,
                title: tool.toolName.replace(/_/g, ' '), // Humanize name
                status: status,
                summary: status === 'completed' ? 'Done' : 'Working...',
                details: JSON.stringify(tool.args)
             });

             // Populate Reasoning Trace
             traceEvents.push({
                id: `${msgIdx}-${toolIdx}`,
                title: tool.toolName,
                content: `Args: ${JSON.stringify(tool.args, null, 2)}\nResult: ${tool.result ? JSON.stringify(tool.result, null, 2).substring(0, 200) + '...' : 'Pending...'}`,
                latency: "N/A", // Could track if we had timestamps
                cost: "Free",
                model: "llama-3.3-70b"
             });
          });
       }
       // Also add message content as a thought step?
       if (m.role === 'assistant' && m.content && !m.toolInvocations) {
           traceEvents.push({
               id: `msg-${msgIdx}`,
               title: "Agent Response",
               content: m.content,
               latency: "N/A",
               cost: "Free",
               model: "llama-3.3-70b"
           });
       }
    });

    if (isLoading) {
        steps.push({ id: "loading", title: "Thinking...", status: "active", summary: "Agent is processing" });
    } else if (steps.length > 1 && steps[steps.length-1].status === 'completed') {
         steps.push({ id: "idle", title: "Awaiting Input", status: "pending", summary: "Ready" });
    }

    // Update Steps
    if (onStepsChange) onStepsChange(steps);
    
    // Update Reasoning
    if (onReasoningChange) onReasoningChange(JSON.stringify(traceEvents));

  }, [messages, isLoading, onStepsChange, onReasoningChange]);

  return (
    <div className="flex flex-col h-full bg-background border-l border-r border-border">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && isLoading ? (
             <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-8">
               <h2 className="text-2xl font-semibold mb-2 animate-pulse">Initializing Research...</h2>
             </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-8">
              <h2 className="text-2xl font-semibold mb-2">AI Research MR</h2>
              <p className="max-w-md">
                Start your research journey. Ask me to analyze papers, formulate hypotheses, or structure your thesis.
              </p>
            </div>
          ) : null}
          
          {messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {m.role === "user" ? "ME" : "AI"}
                </AvatarFallback>
                {m.role === "assistant" && <AvatarImage src="/bot-avatar.png" />}
              </Avatar>
              <div
                className={`rounded-lg p-3 max-w-[85%] text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                  {m.content ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : null}
                  
                  {/* Render Tool Invocations and Results */}
                  {m.toolInvocations && (
                    <div className="flex flex-col gap-2 mt-2">
                       {m.toolInvocations.map((tool: any) => (
                          <div key={tool.toolCallId} className="text-xs bg-background/50 p-2 rounded border border-border/50">
                              <div className="font-semibold text-muted-foreground flex items-center gap-1">
                                 Executing: {tool.toolName.replace(/_/g, ' ')}
                              </div>
                              
                              {/* Show Tool Result if available */}
                              {tool.state === 'result' && (
                                 <div className="mt-2 pl-2 border-l-2 border-primary/20">
                                    {tool.toolName === 'reviewer_execute_search' && tool.result && (
                                       <div className="space-y-2">
                                          {tool.result.results?.slice(0, 3).map((r: any, idx: number) => (
                                              <div key={idx} className="block group">
                                                 <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium truncate block">
                                                    {r.title}
                                                 </a>
                                                 <p className="text-muted-foreground line-clamp-2">{r.snippet}</p>
                                              </div>
                                          ))}
                                          {tool.result.result_count > 3 && <div className="text-[10px] text-muted-foreground">And {tool.result.result_count - 3} more...</div>}
                                       </div>
                                    )}

                                    {(tool.toolName === 'orchestrator_query_knowledge' || tool.toolName === 'reviewer_query_knowledge') && tool.result && (
                                        <div className="space-y-1">
                                            {tool.result.results?.length > 0 ? (
                                                tool.result.results.map((k: any) => (
                                                    <div key={k.id} className="bg-card p-1 rounded text-[10px]">
                                                        <span className="font-bold text-primary">{k.source}:</span> {k.content.substring(0, 100)}...
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="italic">No knowledge found.</span>
                                            )}
                                        </div>
                                    )}

                                    {tool.toolName === 'writer_export_document' && tool.result && (
                                       <div className="mt-2 bg-green-500/10 p-3 rounded-md flex flex-col gap-2 border border-green-500/20">
                                           <div className="flex items-center gap-2">
                                               <span className="text-green-600 dark:text-green-400 font-semibold text-sm">✓ Document Exported</span>
                                           </div>
                                           <a 
                                             href={tool.result.download_url} 
                                             download={tool.result.filename}
                                             target="_blank"
                                             rel="noreferrer"
                                             className="inline-flex items-center justify-center rounded-md text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white shadow hover:bg-green-600/90 h-8 px-4 py-2"
                                           >
                                             Download {tool.result.filename}
                                           </a>
                                       </div>
                                    )}

                                    {/* Project Summary Dashboard */}
                                    {tool.toolName === 'orchestrator_get_project_summary' && tool.result && (
                                        <div className="mt-2 space-y-3 border rounded-md p-3 bg-card shadow-sm">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <h4 className="font-bold text-sm">Project Dashboard</h4>
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">{tool.result.project_status?.progress_percentage}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="space-y-1">
                                                    <span className="text-muted-foreground block">Current Phase</span>
                                                    <span className="font-medium block truncate" title={tool.result.project_status?.current_phase}>{tool.result.project_status?.current_step?.replace(/step_\d+_/, '')}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-muted-foreground block">Approach</span>
                                                    <span className="font-medium block">{tool.result.core_info?.approach || "N/A"}</span>
                                                </div>
                                            </div>

                                            <div className="bg-muted/50 p-2 rounded text-xs space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Knowledge Entries:</span>
                                                    <span className="font-mono">{tool.result.statistics?.knowledge_entries}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Draft Sections:</span>
                                                    <span className="font-mono">{tool.result.statistics?.draft_sections_completed}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Variables:</span>
                                                    <span className="font-mono">{tool.result.statistics?.variables_defined}</span>
                                                </div>
                                            </div>

                                            {tool.result.next_actions?.length > 0 && (
                                                <div className="text-xs border-t pt-2">
                                                    <span className="font-bold text-muted-foreground block mb-1">Recommended Actions:</span>
                                                    <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                                                        {tool.result.next_actions.slice(0, 2).map((action: any, i: number) => (
                                                            <li key={i}>{action.description || action.tool}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Default JSON dump for other tools */}
                                    {!['reviewer_execute_search', 'orchestrator_query_knowledge', 'reviewer_query_knowledge', 'writer_export_document', 'orchestrator_get_project_summary'].includes(tool.toolName) && (
                                       <details>
                                          <summary className="cursor-pointer hover:text-foreground transition-colors">View Result</summary>
                                          <pre className="whitespace-pre-wrap mt-1 overflow-x-auto max-h-40">{JSON.stringify(tool.result, null, 2)}</pre>
                                       </details>
                                    )}
                                 </div>
                              )}
                          </div>
                       ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isLoading && messages.length > 0 && messages[messages.length-1].role !== 'assistant' && (
            <div className="flex gap-3">
               <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                 <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e, {
                // Optional: Pass selected model via headers or body if not default
            } as any);
          }}
          className="flex gap-2 items-end"
        >
          <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
             accept=".pdf,.docx,.txt" // Sprint 5 target formats
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            title="Attach file (Sprint 5)"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? <span className="animate-spin">↻</span> : <Paperclip className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Analiza..."
            className="flex-1 min-h-[44px]"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !(input || '').trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-xs text-muted-foreground mt-2 flex justify-between px-1">
          <span>Model: Llama 3.3 70B (Groq)</span>
          <span>Sprint 7: Orchestrator & Final Polish</span>
        </div>
      </div>
    </div>
  );
}
