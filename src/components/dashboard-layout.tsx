"use client";

"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatPanel } from "@/components/chat-panel";
import { StepsPanel } from "@/components/steps-panel";
import { ReasoningPanel } from "@/components/reasoning-panel";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const [isStepsCollapsed, setIsStepsCollapsed] = useState(false);
  const [isReasoningCollapsed, setIsReasoningCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Lifted State for Panels
  const [steps, setSteps] = useState<any[]>([]);
  const [trace, setTrace] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLeftPanel = () => setIsStepsCollapsed(!isStepsCollapsed);
  const toggleRightPanel = () => setIsReasoningCollapsed(!isReasoningCollapsed);

  if (!mounted) return <div className="h-screen w-full bg-background" />;

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header / Nav */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background z-10 shrink-0">
        <div className="flex items-center gap-2 font-semibold">
           <Button variant="ghost" size="icon" onClick={toggleLeftPanel} title="Toggle Steps">
              <Settings className="h-4 w-4 text-muted-foreground rotate-90" />
           </Button>
           <span className="hidden md:inline-block">AI Research MR</span>
           <span className="text-muted-foreground font-normal ml-2 text-sm hidden lg:inline-block">/ Thesis Assistant</span>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleRightPanel} title="Toggle Reasoning">
               <Settings className="h-4 w-4 text-muted-foreground -rotate-90" />
           </Button>
           <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <Settings className="h-4 w-4" />
           </Button>
           <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center text-xs font-medium">
             AD
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
         <ResizablePanelGroup orientation="horizontal" className="h-full items-stretch">
            
            {/* Left Panel: Agent Steps */}
            {!isStepsCollapsed && (
                <ResizablePanel 
                  defaultSize={20} 
                  minSize={15} 
                  maxSize={25}
                  className="border-r transition-all duration-300 ease-in-out"
                >
                   <div className="h-full overflow-hidden">
                     <StepsPanel steps={steps} />
                   </div>
                </ResizablePanel>
            )}
            {!isStepsCollapsed && (
                <ResizableHandle withHandle />
            )}

            {/* Center Panel: Chat */}
            <ResizablePanel defaultSize={55} minSize={30}>
               <ChatPanel 
                  onStepsChange={setSteps}
                  onReasoningChange={setTrace}
               />
            </ResizablePanel>

            {/* Right Panel: Reasoning */}
            {!isReasoningCollapsed && (
                <ResizableHandle withHandle />
            )}
            {!isReasoningCollapsed && (
                <ResizablePanel 
                  defaultSize={25} 
                  minSize={20} 
                  maxSize={35}
                  className="border-l transition-all duration-300 ease-in-out"
                >
                   <div className="h-full overflow-hidden">
                     <ReasoningPanel trace={trace} />
                   </div>
                </ResizablePanel>
            )}

         </ResizablePanelGroup>
      </div>
    </div>
  );
}
