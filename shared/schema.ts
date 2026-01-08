import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pipelineRuns = pgTable("pipeline_runs", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(), // 'running', 'success', 'failed'
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
});

export const pipelineSteps = pgTable("pipeline_steps", {
  id: serial("id").primaryKey(),
  runId: integer("run_id").notNull(),
  name: text("name").notNull(), // 'Code Push', 'Build', 'Test', 'Deploy'
  status: text("status").notNull(), // 'pending', 'running', 'success', 'failed'
  duration: integer("duration"), // in seconds
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  trend: text("trend"), // '+5%', '-2%'
  description: text("description"),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // 'INFO', 'SUCCESS', 'ERROR'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertPipelineRunSchema = createInsertSchema(pipelineRuns).omit({ id: true, startTime: true, endTime: true });
export const insertPipelineStepSchema = createInsertSchema(pipelineSteps).omit({ id: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true, timestamp: true });

export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type PipelineStep = typeof pipelineSteps.$inferSelect;
export type Metric = typeof metrics.$inferSelect;
export type Log = typeof logs.$inferSelect;
