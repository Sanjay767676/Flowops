// Real-time pipeline hooks using client-side engine
// In production, these would connect to WebSocket or Server-Sent Events
import { usePipelineContext } from "@/contexts/PipelineContext";

export function usePipeline() {
  const { pipelineData, isLoading } = usePipelineContext();
  
  return {
    data: pipelineData,
    isLoading,
  };
}

export function useMetrics() {
  const { metricsData, isLoading } = usePipelineContext();
  
  return {
    data: metricsData,
    isLoading,
  };
}

export function useLogs() {
  const { logsData } = usePipelineContext();
  
  return {
    data: logsData || [],
  };
}

// Export chart data hook
export function useChartData() {
  const { chartData } = usePipelineContext();
  return chartData;
}
