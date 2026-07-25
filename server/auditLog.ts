/**
 * Server-side audit logging.
 *
 * Logs both successful and failed/blocked actions to Firestore.
 * Every entry includes userId, role, action, outcome, and error details if applicable.
 */

import { db } from "./firebaseAdmin.ts";

export type AuditOutcome = 'SUCCESS' | 'BLOCKED' | 'ERROR';

export interface AuditEntry {
  userId: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId: string;
  outcome: AuditOutcome;
  details: string;
  errorCode?: string;
  timestamp: string;
  source: 'server';
}

/**
 * Write an audit log entry. Failures to write the log itself are caught
 * and logged to stderr — they never propagate to the caller.
 */
export async function writeAuditLog(
  userId: string,
  userRole: string | undefined,
  action: string,
  entity: string,
  entityId: string,
  outcome: AuditOutcome,
  details: string,
  errorCode?: string
): Promise<void> {
  const entry: AuditEntry = {
    userId,
    userRole,
    action,
    entity,
    entityId,
    outcome,
    details,
    errorCode,
    timestamp: new Date().toISOString(),
    source: 'server',
  };

  try {
    await db.collection('auditLogs').add(entry);
  } catch (err) {
    // Audit write failure must never block the main operation
    console.error('Failed to write audit log:', err, entry);
  }
}
