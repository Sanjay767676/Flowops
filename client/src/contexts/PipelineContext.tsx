// Pipeline Context Provider
// Provides real-time pipeline state to all components
// In production, this would connect to WebSocket or Server-Sent Events

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getPipelineEngine, type PipelineState } from "@/data/pipelineEngine";
import type { PipelineStep, Metric, Log } from "@shared/schema";

interface PipelineContextValue {
  pipelineData: {
    run: { id: number; status: string };
    steps: PipelineStep[];
  } | null;
  metricsData: Metric[] | null;
  logsData: Log[] | null;
  chartData: Array<{ time: string; success: number; latency: number }>;
  isLoading: boolean;
}

const PipelineContext = createContext<PipelineContextValue | undefined>(undefined);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PipelineState | null>(null);
  const [chartData, setChartData] = useState<Array<{ time: string; success: number; latency: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const engine = getPipelineEngine();
    
    // Subscribe to state changes
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
      setChartData(engine.getChartData());
      setIsLoading(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Update chart data periodically for smoother updates
  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      const engine = getPipelineEngine();
      setChartData(engine.getChartData());
    }, 1000); // Update chart every second

    return () => clearInterval(interval);
  }, [state]);

  const value: PipelineContextValue = {
    pipelineData: state
      ? {
          run: {
            id: state.cycleCount,
            status: state.steps.every((s: PipelineStep) => s.status === "success")
              ? "success"
              : state.steps.some((s: PipelineStep) => s.status === "failed")
              ? "failed"
              : state.steps.some((s: PipelineStep) => s.status === "running")
              ? "running"
              : "pending",
          },
          steps: state.steps,
        }
      : null,
    metricsData: state?.metrics || null,
    logsData: state?.logs || null,
    chartData,
    isLoading,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipelineContext() {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error("usePipelineContext must be used within a PipelineProvider");
  }
  return context;
}

