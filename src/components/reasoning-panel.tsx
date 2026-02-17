"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BrainCircuit, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ReasoningPanel({ trace }: { trace?: string }) {
  // Parse trace if it's likely JSON, otherwise split by newlines
  let steps: any[] = [];
  
  if (trace) {
      try {
          // Attempt JSON parse first
          const parsed = JSON.parse(trace);
          if (Array.isArray(parsed)) {
              steps = parsed;
          } else if (typeof parsed === 'object') {
              steps = [parsed];
          }
      } catch (e) {
          // Fallback to text parsing
          steps = [{
              id: "trace-raw",
              title: "Live Reasoning",
              content: trace,
              latency: "...",
              cost: "..."
          }];
      }
  }

  // If no trace, show empty state or placeholder
  if (!steps.length) {
      return (
        <div className="h-full border-l border-border bg-muted/40 p-4 w-full flex flex-col items-center justify-center text-muted-foreground">
            <BrainCircuit className="h-10 w-10 mb-2 opacity-20" />
            <span className="text-sm">Waiting for reasoning trace...</span>
        </div>
      );
  }

  return (
    <div className="h-full border-l border-border bg-muted/40 p-4 w-full flex flex-col">
       <div className="flex items-center gap-2 mb-4 px-2">
         <div className="bg-purple-500/10 p-2 rounded-lg">
           <BrainCircuit className="h-5 w-5 text-purple-500" />
         </div>
         <span className="font-semibold text-lg tracking-tight">Reasoning Trace</span>
       </div>

       <ScrollArea className="flex-1 pr-4">
         <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full" defaultValue={steps[0]?.id}>
              {steps.map((step, idx) => (
                <AccordionItem key={step.id || idx} value={step.id || `step-${idx}`} className="border-b-0 mb-2">
                  <div className="border rounded-lg bg-background overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {step.latency || "0ms"}
                        </span>
                        <span className="truncate max-w-[150px]">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 text-sm text-muted-foreground bg-muted/20 border-t">
                      <div className="font-mono text-xs mb-2 text-foreground/70 whitespace-pre-wrap">{step.content}</div>
                      <div className="flex justify-end text-[10px] text-muted-foreground gap-2">
                        <span>Cost: {step.cost || "N/A"}</span>
                        <span>Model: {step.model || "Unknown"}</span>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
         </div>
       </ScrollArea>

       <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
         <div className="flex gap-2 items-start">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-xs text-blue-600/90 dark:text-blue-400">
              <span className="font-semibold block mb-1">Chain of Thought Active</span>
               Reasoning steps are streamed in real-time as the agent thinks. Collapsed by default on mobile.
            </div>
         </div>
       </div>
    </div>
  );
}
