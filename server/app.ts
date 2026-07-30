/**
 * Express application factory.
 *
 * Builds the app with health, admin-trigger and secure financial routes, WITHOUT
 * starting a listener or mounting Vite. Shared by:
 *   - server.ts          (local dev harness: adds Vite middleware + listen + cron)
 *   - functions/index.ts (Firebase HTTPS Function: wraps this app)
 *
 * Handlers are reused verbatim from server/secureRoutes.ts — nothing here rewrites them.
 */

import express, { type Express } from "express";
import { createSecureRoutes } from "./secureRoutes.ts";
import { runAlertEngine, runSummaryGenerator } from "./backgroundJobs.ts";

export function createApp(): Express {
  const app = express();

  // --------------- Proxy awareness (DEPLOYMENT_READINESS_REPORT D-1) ---------------
  // Behind Firebase Hosting the function is reached through the Google Front End,
  // so the socket peer is a proxy rather than the caller. Declaring one trusted
  // hop makes `req.ip` meaningful in logs and error reporting.
  //
  // Deliberately NOT `true`: that would let any client spoof `X-Forwarded-For`,
  // and express-rate-limit rejects it outright (ERR_ERL_PERMISSIVE_TRUST_PROXY —
  // "allows anyone to trivially bypass IP-based rate limiting").
  //
  // The exact hop count cannot be verified without a deployed environment, so
  // VERIFY POST-DEPLOY. Nothing security-critical depends on it: the secure-route
  // rate limiter keys on the authenticated uid, not on `req.ip` (see
  // server/secureRoutes.ts).
  app.set("trust proxy", 1);

  // --------------- Middleware ---------------
  app.use(express.json({ limit: "1mb" }));

  // --------------- Health check ---------------
  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "ok" });
  });

  // --------------- Admin triggers (manual) ---------------
  // NOTE: not exposed via the production Hosting rewrite (see firebase.json);
  // reachable only when running the full Express harness locally.
  app.post("/api/admin/run-alerts", async (_req, res) => {
    await runAlertEngine();
    res.json({ success: true, message: "Alert engine triggered." });
  });

  app.post("/api/admin/run-summary", async (_req, res) => {
    await runSummaryGenerator();
    res.json({ success: true, message: "Daily summary generated." });
  });

  // --------------- Secure financial routes ---------------
  app.use("/api/secure", createSecureRoutes());

  return app;
}
