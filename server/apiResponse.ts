/**
 * Standardized API response helpers.
 *
 * All secure routes return one of three shapes:
 *   - success: { success: true, message: string }
 *   - business error: { success: false, code: string, message: string }
 *   - system error: { success: false, code: 'INTERNAL_ERROR', message: string }
 */

import { Response } from "express";

export interface ApiSuccessResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/** A business-rule error thrown inside route handlers / transactions */
export interface BusinessError {
  code: string;
  message: string;
}

export function isBusinessError(err: unknown): err is BusinessError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    typeof (err as BusinessError).code === 'string'
  );
}

export function sendSuccess(res: Response, message: string): void {
  res.json({ success: true, message } satisfies ApiSuccessResponse);
}

export function sendBusinessError(res: Response, code: string, message: string, status = 400): void {
  res.status(status).json({ success: false, code, message } satisfies ApiErrorResponse);
}

/**
 * Standard error handler for route catch blocks.
 * Distinguishes business errors (known codes) from unexpected system errors.
 */
export function sendError(res: Response, error: unknown): void {
  if (isBusinessError(error)) {
    sendBusinessError(res, error.code, error.message);
  } else {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('System error:', error);
    res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      message
    } satisfies ApiErrorResponse);
  }
}
