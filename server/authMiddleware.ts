/**
 * Express middleware for Firebase Auth token verification and role checking.
 */

import { Request, Response, NextFunction } from "express";
import { admin, db } from "./firebaseAdmin.ts";

export type UserRole = 'CEO' | 'PROJECT_MANAGER' | 'ACCOUNTS' | 'ADMIN'
  | 'SUPER_ADMIN' | 'PURCHASE_MANAGER' | 'STORE_MANAGER' | 'STORE_KEEPER';

export interface AuthenticatedRequest extends Request {
  uid?: string;
  userRole?: UserRole;
  userEmail?: string;
}

/**
 * Verifies the Firebase Auth ID token from the Authorization header
 * and loads the user's role from Firestore.
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      code: 'UNAUTHENTICATED',
      message: 'Missing or invalid Authorization header.'
    });
    return;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.userEmail = decoded.email;

    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'User profile not found. Contact an administrator.'
      });
      return;
    }
    req.userRole = userDoc.data()?.role as UserRole;

    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({
      success: false,
      code: 'UNAUTHENTICATED',
      message: 'Invalid or expired auth token.'
    });
  }
}

/**
 * Factory: returns middleware that checks the authenticated user has one of the allowed roles.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: `This action requires one of: ${roles.join(', ')}. Your role: ${req.userRole || 'none'}.`
      });
      return;
    }
    next();
  };
}
