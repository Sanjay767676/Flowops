import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // API Routes
  app.get(api.pipeline.latest.path, async (req, res) => {
    const data = await storage.getLatestPipelineRun();
    if (!data) {
      // Create initial run if none exists
      const run = await storage.createPipelineRun("pending");
      const steps = ["Code Push", "Build", "Test", "Deploy"];
      for (const name of steps) {
        await storage.createPipelineStep({ runId: run.id, name, status: "pending", duration: 0 });
      }
      return res.json({ run, steps: await storage.getPipelineSteps(run.id) });
    }
    res.json(data);
  });

  app.get(api.pipeline.metrics.path, async (req, res) => {
    await storage.initializeMetrics();
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  app.get(api.pipeline.logs.path, async (req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  // Simulation Loop
  startSimulation();

  return httpServer;
}

// Simple simulation logic
let simulationInterval: NodeJS.Timeout;

function startSimulation() {
  if (simulationInterval) clearInterval(simulationInterval);
  
  // Initialize
  storage.initializeMetrics();

  simulationInterval = setInterval(async () => {
    try {
      let data = await storage.getLatestPipelineRun();
      
      if (!data || data.run.status === 'success' || data.run.status === 'failed') {
        // Start new run occasionally
        if (!data || Math.random() > 0.8) {
           // Clear logs for new run
           if (Math.random() > 0.5) await storage.clearLogs();
           
           const run = await storage.createPipelineRun("running");
           const steps = ["Code Push", "Build", "Test", "Deploy"];
           for (const name of steps) {
             await storage.createPipelineStep({ runId: run.id, name, status: "pending", duration: 0 });
           }
           await storage.createLog({ level: "INFO", message: "🚀 New deployment pipeline started" });
        }
        return;
      }

      // Process current run
      const { run, steps } = data;
      const pendingStep = steps.find(s => s.status === 'pending');
      const runningStep = steps.find(s => s.status === 'running');

      if (runningStep) {
        // Complete running step
        if (Math.random() > 0.3) {
           const isFailure = Math.random() > 0.95 && runningStep.name !== 'Code Push'; // Rare failure
           const status = isFailure ? 'failed' : 'success';
           await storage.updatePipelineStep(runningStep.id, status, Math.floor(Math.random() * 60) + 10);
           
           if (isFailure) {
             await storage.updatePipelineRun(run.id, 'failed', new Date());
             await storage.createLog({ level: "ERROR", message: `❌ ${runningStep.name} failed. Pipeline stopped.` });
           } else {
             await storage.createLog({ level: "SUCCESS", message: `✅ ${runningStep.name} completed successfully` });
           }
        } else {
           // Still running, maybe add a log
           await storage.createLog({ level: "INFO", message: `Running ${runningStep.name}...` });
        }
      } else if (pendingStep) {
        // Start next step
        await storage.updatePipelineStep(pendingStep.id, 'running');
        await storage.createLog({ level: "INFO", message: `▶️ Starting ${pendingStep.name}...` });
      } else {
        // All steps done
        if (run.status === 'running') {
            const allSuccess = steps.every(s => s.status === 'success');
            await storage.updatePipelineRun(run.id, allSuccess ? 'success' : 'failed', new Date());
            if (allSuccess) {
              await storage.createLog({ level: "SUCCESS", message: "🎉 Deployment completed successfully!" });
              // Update metrics
              const metrics = await storage.getMetrics();
              const total = parseInt(metrics.find(m => m.label === "Total Deployments")?.value.replace(',','') || "0") + 1;
              await storage.updateMetric(metrics.find(m => m.label === "Total Deployments")!.id, total.toLocaleString());
            }
        }
      }

    } catch (e) {
      console.error("Simulation error:", e);
    }
  }, 2000); // Check every 2 seconds
}
