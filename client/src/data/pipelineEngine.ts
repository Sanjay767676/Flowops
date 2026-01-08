// Real-time CI/CD Pipeline Simulation Engine
// In production, this state would be updated via GitHub Actions webhooks
// or similar CI/CD system integrations

import type { PipelineStep, Metric, Log } from "@shared/schema";

export type PipelineStage = "code_push" | "build" | "test" | "deploy";
export type StepStatus = "pending" | "running" | "success" | "failed";

export interface PipelineState {
  currentStage: PipelineStage;
  currentStageIndex: number;
  steps: PipelineStep[];
  metrics: Metric[];
  logs: Log[];
  successRate: number;
  totalDeployments: number;
  failedDeployments: number;
  avgDeployTime: string;
  cycleCount: number;
}

// Pipeline stage configuration
const STAGES: PipelineStage[] = ["code_push", "build", "test", "deploy"];
const STAGE_NAMES: Record<PipelineStage, string> = {
  code_push: "Code Push",
  build: "Build",
  test: "Test",
  deploy: "Deploy",
};

// Timing configuration for demo clarity
const STAGE_DURATION_MIN = 2000; // 2 seconds
const STAGE_DURATION_MAX = 4000; // 4 seconds
const FULL_CYCLE_DURATION = 18000; // ~18 seconds total
const FAILURE_PROBABILITY = 0.1; // 10% chance of failure

// Log templates for each stage
const LOG_TEMPLATES: Record<PipelineStage, string[]> = {
  code_push: [
    "[INFO] Commit received: refs/heads/main",
    "[INFO] Validating commit message format",
    "[INFO] Checking branch protection rules",
    "[SUCCESS] Code push validated",
  ],
  build: [
    "[INFO] Build container started",
    "[INFO] Installing dependencies...",
    "[INFO] Running build script",
    "[INFO] Compiling TypeScript...",
    "[INFO] Bundling assets...",
    "[SUCCESS] Build completed successfully",
  ],
  test: [
    "[INFO] Running test suite...",
    "[INFO] Executing unit tests (127 tests)",
    "[INFO] Running integration tests (45 tests)",
    "[INFO] Running E2E tests (12 tests)",
    "[SUCCESS] All tests passed (184/184)",
  ],
  deploy: [
    "[INFO] Preparing deployment package",
    "[INFO] Uploading artifacts to staging",
    "[INFO] Running health checks...",
    "[INFO] Deploying to production servers",
    "[SUCCESS] Deployment completed",
  ],
};

const ERROR_LOG_TEMPLATES: Record<PipelineStage, string[]> = {
  code_push: [
    "[ERROR] Branch protection rule violation",
    "[ERROR] Commit message does not meet requirements",
  ],
  build: [
    "[ERROR] Build failed: TypeScript compilation error",
    "[ERROR] Build failed: Dependency installation failed",
  ],
  test: [
    "[ERROR] Test suite failed: 3 tests failed",
    "[ERROR] Integration test timeout",
  ],
  deploy: [
    "[ERROR] Deployment failed: Health check timeout",
    "[ERROR] Deployment failed: Server connection error",
  ],
};

class PipelineEngine {
  private state: PipelineState;
  private listeners: Set<(state: PipelineState) => void> = new Set();
  private logIdCounter = 1;
  private metricIdCounter = 1;
  private stepIdCounter = 1;
  private chartDataPoints: Array<{ time: string; success: number; latency: number }> = [];

  constructor() {
    this.state = this.initializeState();
    // Initialize chart with a few data points
    this.initializeChartData();
    // Notify any existing listeners of initial state
    this.notifyListeners();
    // Start the pipeline cycle
    this.start();
  }

  private initializeChartData() {
    const now = new Date();
    // Create 5 initial data points
    for (let i = 4; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      this.chartDataPoints.push({
        time: timeStr,
        success: 85 + Math.random() * 10, // 85-95%
        latency: 80 + Math.random() * 70, // 80-150ms
      });
    }
  }

  private initializeState(): PipelineState {
    // Initialize steps
    const steps: PipelineStep[] = STAGES.map((stage, index) => ({
      id: this.stepIdCounter++,
      runId: 1,
      name: STAGE_NAMES[stage],
      status: index === 0 ? "running" : "pending",
      duration: null,
    }));

    // Initialize metrics
    const metrics: Metric[] = [
      {
        id: this.metricIdCounter++,
        label: "Success Rate",
        value: "92%",
        trend: "+2%",
        description: "Deployment success rate over last 30 days",
      },
      {
        id: this.metricIdCounter++,
        label: "Total Deployments",
        value: "128",
        trend: "+12",
        description: "Total deployments this month",
      },
      {
        id: this.metricIdCounter++,
        label: "Failed Deployments",
        value: "11",
        trend: "-3",
        description: "Failed deployments this month",
      },
      {
        id: this.metricIdCounter++,
        label: "Avg Deploy Time",
        value: "2m 14s",
        trend: "-8s",
        description: "Average deployment duration",
      },
    ];

    // Initialize logs
    const logs: Log[] = [];

    return {
      currentStage: "code_push",
      currentStageIndex: 0,
      steps,
      metrics,
      logs,
      successRate: 92,
      totalDeployments: 128,
      failedDeployments: 11,
      avgDeployTime: "2m 14s",
      cycleCount: 0,
    };
  }

  subscribe(listener: (state: PipelineState) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify new subscriber with current state
    listener({ ...this.state });
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    // Create a new state object to ensure React detects changes
    const stateCopy = { ...this.state };
    this.listeners.forEach((listener) => listener(stateCopy));
  }

  private start() {
    // Start the first stage immediately
    this.runStageCycle();
  }

  stop() {
    // Engine uses async/await, so no interval to clear
    // This method is kept for API compatibility
  }

  private async runStageCycle() {
    // Process all stages in sequence
    for (let i = 0; i < STAGES.length; i++) {
      await this.processCurrentStage();
      
      // Wait a bit before moving to next stage (unless it's the last one)
      if (i < STAGES.length - 1) {
        await this.delay(500); // Small delay between stages
        this.advanceToNextStage();
      }
    }
    
    // After completing all stages, start a new cycle
    await this.delay(1000);
    this.startNewCycle();
  }

  private async processCurrentStage() {
    const stage = this.state.currentStage;
    const stepIndex = this.state.currentStageIndex;
    const step = this.state.steps[stepIndex];

    // Mark step as running
    this.updateStepStatus(stepIndex, "running", null);
    this.addLog("INFO", `Starting ${STAGE_NAMES[stage]} stage...`);
    
    // Update chart data when stage starts
    this.updateChartData();

    // Simulate stage execution with logs
    const logs = LOG_TEMPLATES[stage];
    const shouldFail = Math.random() < FAILURE_PROBABILITY;

    for (let i = 0; i < logs.length; i++) {
      await this.delay(STAGE_DURATION_MIN / logs.length);
      
      const logMessage = logs[i];
      const level = logMessage.includes("[SUCCESS]") ? "SUCCESS" : 
                   logMessage.includes("[ERROR]") ? "ERROR" : "INFO";
      this.addLog(level, logMessage.replace(/\[(INFO|SUCCESS|ERROR)\]\s*/, ""));
      
      // Update chart data periodically during stage execution
      if (i % 2 === 0) {
        this.updateChartData();
      }

      // If this is the last log and we should fail, add error logs
      if (i === logs.length - 1 && shouldFail) {
        const errorLogs = ERROR_LOG_TEMPLATES[stage];
        const errorLog = errorLogs[Math.floor(Math.random() * errorLogs.length)];
        this.addLog("ERROR", errorLog.replace(/\[ERROR\]\s*/, ""));
      }
    }

    // Complete the stage
    const duration = Math.floor(
      (STAGE_DURATION_MIN + Math.random() * (STAGE_DURATION_MAX - STAGE_DURATION_MIN)) / 1000
    );
    
    const status: StepStatus = shouldFail ? "failed" : "success";
    this.updateStepStatus(stepIndex, status, duration);
    
    // Update chart data when stage completes
    this.updateChartData();

    if (status === "success") {
      this.addLog("SUCCESS", `${STAGE_NAMES[stage]} completed successfully`);
    } else {
      this.addLog("ERROR", `${STAGE_NAMES[stage]} failed`);
    }
  }

  private advanceToNextStage() {
    const nextIndex = (this.state.currentStageIndex + 1) % STAGES.length;
    this.state.currentStageIndex = nextIndex;
    this.state.currentStage = STAGES[nextIndex];
    this.notifyListeners();
  }

  startNewCycle() {
    // Reset all steps to pending
    this.state.steps = STAGES.map((stage, index) => ({
      id: this.stepIdCounter++,
      runId: this.state.cycleCount + 1,
      name: STAGE_NAMES[stage],
      status: index === 0 ? "running" : "pending",
      duration: null,
    }));

    // Clear logs for new cycle
    this.state.logs = [];
    this.addLog("INFO", "=== New pipeline run started ===");

    // Update metrics
    this.updateMetrics();

    // Update chart data
    this.updateChartData();

    this.state.currentStageIndex = 0;
    this.state.currentStage = "code_push";
    this.state.cycleCount++;

    this.notifyListeners();
    
    // Start the new cycle
    this.runStageCycle();
  }

  private updateStepStatus(index: number, status: StepStatus, duration: number | null) {
    // Create new steps array to ensure React detects changes
    this.state.steps = this.state.steps.map((step, i) => 
      i === index ? { ...step, status, duration } : step
    );
    this.notifyListeners();
  }

  private addLog(level: "INFO" | "SUCCESS" | "ERROR", message: string) {
    const log: Log = {
      id: this.logIdCounter++,
      level,
      message,
      timestamp: new Date(),
    };
    
    // Keep only last 50 logs for performance
    // Create new array to ensure React detects changes
    this.state.logs = [...this.state.logs, log].slice(-50);
    this.notifyListeners();
  }

  private updateMetrics() {
    // Simulate realistic metric changes
    const successRateChange = (Math.random() - 0.5) * 4; // ±2%
    const newSuccessRate = Math.max(85, Math.min(98, this.state.successRate + successRateChange));
    this.state.successRate = Math.round(newSuccessRate);

    const deploymentsChange = Math.floor(Math.random() * 3) + 1; // +1 to +3
    this.state.totalDeployments += deploymentsChange;

    const failuresChange = Math.random() < 0.3 ? -1 : Math.random() < 0.5 ? 0 : 1;
    this.state.failedDeployments = Math.max(0, this.state.failedDeployments + failuresChange);

    const timeChange = Math.floor((Math.random() - 0.5) * 20); // ±10s
    const currentSeconds = this.parseTime(this.state.avgDeployTime);
    const newSeconds = Math.max(60, currentSeconds + timeChange);
    this.state.avgDeployTime = this.formatTime(newSeconds);

    // Update metric objects
    this.state.metrics[0] = {
      ...this.state.metrics[0],
      value: `${Math.round(newSuccessRate)}%`,
      trend: successRateChange > 0 ? `+${Math.round(successRateChange)}%` : `${Math.round(successRateChange)}%`,
    };

    this.state.metrics[1] = {
      ...this.state.metrics[1],
      value: String(this.state.totalDeployments),
      trend: `+${deploymentsChange}`,
    };

    this.state.metrics[2] = {
      ...this.state.metrics[2],
      value: String(this.state.failedDeployments),
      trend: failuresChange > 0 ? `+${failuresChange}` : failuresChange < 0 ? `${failuresChange}` : null,
    };

    this.state.metrics[3] = {
      ...this.state.metrics[3],
      value: this.state.avgDeployTime,
      trend: timeChange < 0 ? `${timeChange}s` : `+${timeChange}s`,
    };
  }

  private parseTime(timeStr: string): number {
    const match = timeStr.match(/(\d+)m\s*(\d+)s/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 120; // default 2 minutes
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  private updateChartData() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    
    // Calculate success rate for chart (based on recent cycles)
    const recentSuccess = this.state.steps.filter(s => s.status === "success").length;
    const successPercentage = (recentSuccess / STAGES.length) * 100;
    
    // Simulate latency (80-150ms range)
    const latency = Math.floor(80 + Math.random() * 70);

    this.chartDataPoints.push({
      time: timeStr,
      success: Math.round(successPercentage),
      latency,
    });

    // Keep only last 20 data points
    if (this.chartDataPoints.length > 20) {
      this.chartDataPoints.shift();
    }
    
    // Notify listeners that chart data has been updated
    // (Context will also poll, but this ensures immediate updates)
    this.notifyListeners();
  }

  getChartData() {
    return [...this.chartDataPoints];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getState(): PipelineState {
    return { ...this.state };
  }

  // Public method to manually trigger a new deployment
  triggerDeployment() {
    // If there's a current cycle running, wait for it to complete
    // Otherwise, start a new cycle immediately
    const hasRunningSteps = this.state.steps.some(s => s.status === "running");
    if (!hasRunningSteps) {
      this.startNewCycle();
    } else {
      // Queue a new deployment after current one completes
      // We'll use a flag or callback mechanism
      // For simplicity, we'll just start a new cycle anyway
      // In a real scenario, you might want to queue this
      this.startNewCycle();
    }
  }
}

// Singleton instance
let engineInstance: PipelineEngine | null = null;

export function getPipelineEngine(): PipelineEngine {
  if (!engineInstance) {
    engineInstance = new PipelineEngine();
  }
  return engineInstance;
}

