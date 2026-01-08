import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Poll every 2 seconds to simulate live updates
const POLL_INTERVAL = 2000;

export function usePipeline() {
  return useQuery({
    queryKey: [api.pipeline.latest.path],
    queryFn: async () => {
      const res = await fetch(api.pipeline.latest.path);
      if (!res.ok) throw new Error("Failed to fetch pipeline status");
      return api.pipeline.latest.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: [api.pipeline.metrics.path],
    queryFn: async () => {
      const res = await fetch(api.pipeline.metrics.path);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.pipeline.metrics.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
  });
}

export function useLogs() {
  return useQuery({
    queryKey: [api.pipeline.logs.path],
    queryFn: async () => {
      const res = await fetch(api.pipeline.logs.path);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.pipeline.logs.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL, // Faster poll for logs
  });
}
