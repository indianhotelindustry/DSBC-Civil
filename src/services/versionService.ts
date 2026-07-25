import { AppVersion } from '../types';
import {
  createDocument,
  subscribeToCollection,
  logAction
} from './db';
import { APP_VERSION, APP_BUILD_LABEL, APP_ENVIRONMENT } from '../lib/appVersion';
import { auth } from '../lib/firebase';

const COLLECTION = 'appVersions';

export const versionService = {
  /** Subscribe to all version entries, newest first */
  getAll: (callback: (versions: AppVersion[]) => void) => {
    return subscribeToCollection<AppVersion>(COLLECTION, (data) => {
      const sorted = [...data].sort((a, b) =>
        new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
      );
      callback(sorted);
    });
  },

  /**
   * Log the current deployment. Called manually by an admin after deploy.
   * Creates an append-only record in the appVersions collection.
   */
  logDeployment: async (notes: string, gitTag?: string, gitCommit?: string): Promise<string> => {
    const user = auth.currentUser;
    const entry: Omit<AppVersion, 'id'> = {
      version: APP_VERSION,
      buildLabel: APP_BUILD_LABEL,
      gitTag: gitTag || '',
      gitCommit: gitCommit || '',
      deployedBy: user?.email || user?.uid || 'unknown',
      deployedAt: new Date().toISOString(),
      environment: APP_ENVIRONMENT,
      notes,
    };

    const id = await createDocument(COLLECTION, entry as Record<string, unknown>);
    await logAction('DEPLOY', 'AppVersion', id, `Logged deployment: ${APP_VERSION} (${APP_BUILD_LABEL})`);
    return id;
  }
};
