"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Brain, FileText, Settings, User } from "lucide-react";

export function StepsPanel({ steps = [] }: { steps?: any[] }) {
  // Mock steps if none provided
  const items = steps.length ? steps : [
    { id: 1, title: "Initialize Research", status: "completed", summary: "Loaded 5 agents." },
    { id: 2, title: "Load Knowledge Base", status: "completed", summary: "11 engines ready." },
    { id: 3, title: "Awaiting Input", status: "pending", summary: "Waiting for user query..." }
  ];

  return (
    <div className="h-full border-r border-border bg-muted/40 p-4 w-full">
       <div className="flex items-center gap-2 mb-6 px-2">
         <div className="bg-primary/10 p-2 rounded-lg">
           <Brain className="h-5 w-5 text-primary" />
         </div>
         <span className="font-semibold text-lg tracking-tight">AI Research MR</span>
       </div>

       <div className="space-y-4">
         <div className="px-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
           Current Workflow
         </div>
         
         <div className="space-y-2">
            {items.map((step, idx) => (
              <div 
                key={step.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  step.status === 'completed' ? 'bg-background/50 border-border/50 text-muted-foreground' : 
                  step.status === 'active' ? 'bg-background border-primary/20 shadow-sm' : 
                  'opacity-50 border-transparent'
                }`}
              >
                <div className={`mt-0.5 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border ${
                  step.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                  step.status === 'active' ? 'bg-primary text-primary-foreground border-primary' : 
                  'bg-muted text-muted-foreground border-muted-foreground/20'
                }`}>
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                <div>
                  <div className="text-sm font-medium leading-none mb-1">{step.title}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{step.summary}</div>
                </div>
              </div>
            ))}
         </div>
       </div>

       <div className="mt-8 px-2 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active Agents
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer text-sm">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>Writer Agent</span>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer text-sm">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>Reviewer Agent</span>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer text-sm">
             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
             <span>Search Agent</span>
          </div>
       </div>
    </div>
  );
}
