import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, XCircle, Loader2 } from "lucide-react";
import type { PipelineStep } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PipelineVisualizerProps {
  steps: PipelineStep[];
}

export function PipelineVisualizer({ steps }: PipelineVisualizerProps) {
  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px] px-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex-1 flex items-center group">
              {/* Step Node */}
              <div className="relative flex flex-col items-center">
                <StepIcon status={step.status} />
                <div className="absolute -bottom-8 text-center w-32">
                  <p className="text-sm font-semibold text-foreground/90">{step.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 capitalize">
                    {step.status} {step.duration && `(${step.duration}s)`}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-[2px] mx-4 bg-muted relative overflow-hidden rounded-full">
                  {(step.status === 'success' || step.status === 'running') && (
                    <motion.div
                      className={cn(
                        "absolute inset-0 h-full",
                        step.status === 'success' ? "bg-green-500" : "bg-blue-500"
                      )}
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ 
                        duration: 1, 
                        ease: "easeInOut",
                        repeat: step.status === 'running' ? Infinity : 0
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIcon({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'running':
        return { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', animate: true };
      default:
        return { icon: CircleDashed, color: 'text-muted-foreground', bg: 'bg-muted/10', border: 'border-muted/20' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg backdrop-blur-sm z-10 transition-colors duration-300",
        config.bg,
        config.border,
        config.color
      )}
    >
      <Icon className={cn("w-6 h-6", config.animate && "animate-spin")} />
    </motion.div>
  );
}
