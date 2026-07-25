/**
 * Local development server entry point.
 *
 * The Express app itself is built by server/app.ts (createApp), which is shared
 * with the Firebase HTTPS Function (functions/index.ts). This file adds the
 * dev-only concerns: Vite middleware, static serving, the node-cron scheduler,
 * and the HTTP listener.
 *
 * Structure:
 *   server/app.ts            — Express app factory (health, admin, secure routes)
 *   server/firebaseAdmin.ts  — Firebase Admin SDK initialization
 *   server/authMiddleware.ts — Auth token verification + role checking
 *   server/auditLog.ts       — Structured audit logging (success + failure)
 *   server/apiResponse.ts    — Standardized API response helpers
 *   server/secureRoutes.ts   — Server-authoritative financial operations
 *   server/backgroundJobs.ts — Alert engine + daily summary generator
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import { createApp } from "./server/app.ts";
import { runAlertEngine, runSummaryGenerator } from "./server/backgroundJobs.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApp();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // --------------- Scheduled jobs ---------------
  cron.schedule("0 8 * * *", async () => {
    await runAlertEngine();
    await runSummaryGenerator();
  });

  // --------------- Static / Vite ---------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --------------- Start ---------------
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Run background jobs once on startup
    runAlertEngine();
    runSummaryGenerator();
  });
}

startServer();
