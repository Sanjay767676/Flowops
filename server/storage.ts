import { 
  pipelineRuns, pipelineSteps, metrics, logs,
  type PipelineRun, type PipelineStep, type Metric, type Log,
  type InsertPipelineRun, type InsertPipelineStep, type InsertMetric, type InsertLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Pipeline
  getLatestPipelineRun(): Promise<{ run: PipelineRun, steps: PipelineStep[] } | undefined>;
  createPipelineRun(status: string): Promise<PipelineRun>;
  updatePipelineRun(id: number, status: string, endTime?: Date): Promise<PipelineRun>;
  
  // Steps
  createPipelineStep(step: InsertPipelineStep): Promise<PipelineStep>;
  updatePipelineStep(id: number, status: string, duration?: number): Promise<PipelineStep>;
  getPipelineSteps(runId: number): Promise<PipelineStep[]>;

  // Metrics
  getMetrics(): Promise<Metric[]>;
  updateMetric(id: number, value: string, trend?: string): Promise<Metric>;
  initializeMetrics(): Promise<void>;

  // Logs
  getLogs(): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;
  clearLogs(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getLatestPipelineRun() {
    const run = await db.query.pipelineRuns.findFirst({
      orderBy: [desc(pipelineRuns.id)]
    });
    if (!run) return undefined;
    const steps = await db.select().from(pipelineSteps).where(eq(pipelineSteps.runId, run.id));
    return { run, steps };
  }

  async createPipelineRun(status: string) {
    const [run] = await db.insert(pipelineRuns).values({ status }).returning();
    return run;
  }

  async updatePipelineRun(id: number, status: string, endTime?: Date) {
    const [run] = await db.update(pipelineRuns)
      .set({ status, endTime })
      .where(eq(pipelineRuns.id, id))
      .returning();
    return run;
  }

  async createPipelineStep(step: InsertPipelineStep) {
    const [newStep] = await db.insert(pipelineSteps).values(step).returning();
    return newStep;
  }

  async updatePipelineStep(id: number, status: string, duration?: number) {
    const [step] = await db.update(pipelineSteps)
      .set({ status, duration })
      .where(eq(pipelineSteps.id, id))
      .returning();
    return step;
  }

  async getPipelineSteps(runId: number) {
    return await db.select().from(pipelineSteps).where(eq(pipelineSteps.runId, runId));
  }

  async getMetrics() {
    return await db.select().from(metrics).orderBy(metrics.id);
  }

  async updateMetric(id: number, value: string, trend?: string) {
    const [metric] = await db.update(metrics)
      .set({ value, trend })
      .where(eq(metrics.id, id))
      .returning();
    return metric;
  }

  async initializeMetrics() {
    const existing = await this.getMetrics();
    if (existing.length === 0) {
      await db.insert(metrics).values([
        { label: "Total Deployments", value: "1,234", trend: "+12%" },
        { label: "Success Rate", value: "98.5%", trend: "+0.5%" },
        { label: "Failed Builds", value: "12", trend: "-2%" },
        { label: "Avg Duration", value: "4m 12s", trend: "-30s" },
      ]);
    }
  }

  async getLogs() {
    return await db.select().from(logs).orderBy(desc(logs.id)).limit(50);
  }

  async createLog(log: InsertLog) {
    const [newLog] = await db.insert(logs).values(log).returning();
    return newLog;
  }

  async clearLogs() {
    await db.delete(logs);
  }
}

export const storage = new DatabaseStorage();
