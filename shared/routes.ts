import { z } from 'zod';
import { pipelineRuns, pipelineSteps, metrics, logs } from './schema';

export const api = {
  pipeline: {
    latest: {
      method: 'GET' as const,
      path: '/api/pipeline/latest',
      responses: {
        200: z.object({
          run: z.custom<typeof pipelineRuns.$inferSelect>(),
          steps: z.array(z.custom<typeof pipelineSteps.$inferSelect>())
        })
      }
    },
    metrics: {
      method: 'GET' as const,
      path: '/api/metrics',
      responses: {
        200: z.array(z.custom<typeof metrics.$inferSelect>())
      }
    },
    logs: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>())
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
