import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { Log } from "@shared/schema";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  logs: Log[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[500px] border border-white/10">
      {/* Header */}
      <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono font-medium text-muted-foreground">Live Build Logs</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>

      {/* Log Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 bg-black/20"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Waiting for logs...</p>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 group hover:bg-white/5 p-1 rounded transition-colors"
              >
                <span className="text-muted-foreground/40 shrink-0 text-xs mt-0.5 select-none w-20">
                  {new Date(log.timestamp!).toLocaleTimeString()}
                </span>
                
                <div className="shrink-0 mt-0.5">
                  {log.level === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {log.level === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {log.level === 'INFO' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mx-1" />}
                </div>

                <span className={cn(
                  "break-all",
                  log.level === 'ERROR' && "text-red-400",
                  log.level === 'SUCCESS' && "text-green-400",
                  log.level === 'INFO' && "text-foreground/80"
                )}>
                  {log.message}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
