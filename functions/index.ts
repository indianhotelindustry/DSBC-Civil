/**
 * Firebase Cloud Functions entry point.
 *
 * Deploys the EXISTING Express app (server/app.ts → createApp) as a single HTTPS
 * function behind a Hosting rewrite (/api/secure/** and /api/health → this function).
 * The secure financial handlers in server/secureRoutes.ts are reused verbatim.
 *
 * Also deploys the background alert/summary generators on a schedule, so they run
 * in production (previously they ran only under the local dev server's node-cron).
 *
 * Build: bundled with esbuild (see package.json) so the server's .ts-extension
 * imports resolve into a single JS artifact for deployment.
 */

import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { createApp } from "../server/app.ts";
import { runAlertEngine, runSummaryGenerator } from "../server/backgroundJobs.ts";

const REGION = "asia-south1";

// The server-authoritative financial API. The client (src/services/secureApi.ts)
// already calls fetch('/api/secure/...'); the Hosting rewrite routes those to here.
export const api = onRequest({ region: REGION }, createApp());

// Daily alert engine + summary generator (replaces the dev-only node-cron).
export const dailyJobs = onSchedule(
  { schedule: "0 8 * * *", region: REGION, timeZone: "Asia/Kolkata" },
  async () => {
    await runAlertEngine();
    await runSummaryGenerator();
  }
);
