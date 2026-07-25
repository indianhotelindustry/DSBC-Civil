import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  limit,
  QueryConstraint,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  BATCH = 'batch',
  TRANSACTION = 'transaction',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  // Full context logged to console only (never surfaced to the user).
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('[firestore]', operationType, path, errInfo);

  // User-facing message: short, actionable, no PII.
  const rawMsg = error instanceof Error ? error.message : String(error);
  let friendly = `Firestore ${operationType} failed${path ? ` on ${path}` : ''}.`;
  if (/permission|insufficient/i.test(rawMsg)) {
    friendly = 'Permission denied. You may not have access to this operation.';
  } else if (/offline|network|unavailable/i.test(rawMsg)) {
    friendly = 'Network error. Please check your connection and try again.';
  } else if (/not[\s-]?found/i.test(rawMsg)) {
    friendly = 'Record not found. It may have been deleted.';
  }
  throw new Error(friendly);
}

// ===============================================================
// Generic CRUD
// ===============================================================

export const createDocument = async (collectionName: string, data: Record<string, unknown>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser?.uid
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionName);
  }
};

export const updateDocument = async (collectionName: string, id: string, data: Record<string, unknown>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
  }
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
};

export const getDocument = async <T extends { id: string }>(collectionName: string, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
  }
};

// ===============================================================
// Real-time listeners
// ===============================================================

export const subscribeToCollection = <T extends { id: string }>(
  collectionName: string,
  callback: (data: T[]) => void,
  queries: QueryConstraint[] = []
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...queries);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  });
};

// ===============================================================
// One-shot query (for validation checks that don't need real-time)
// ===============================================================

export const queryDocuments = async <T extends { id: string }>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
};

// Re-export Firestore query helpers for use in service-layer validation
export { where, orderBy, limit } from 'firebase/firestore';

// ===============================================================
// Batched writes — all-or-nothing multi-document updates
// ===============================================================

export interface BatchOperation {
  type: 'set' | 'update' | 'delete';
  collection: string;
  id: string;
  data?: Record<string, unknown>;
}

/**
 * Execute multiple Firestore writes atomically.
 * If any write fails, all writes are rolled back.
 * Max 500 operations per batch (Firestore limit).
 */
export const executeBatch = async (operations: BatchOperation[]): Promise<void> => {
  if (operations.length === 0) return;
  if (operations.length > 500) {
    throw new Error('Firestore batch limit is 500 operations.');
  }

  try {
    const batch = writeBatch(db);

    for (const op of operations) {
      const docRef = doc(db, op.collection, op.id);
      switch (op.type) {
        case 'set':
          batch.set(docRef, op.data!);
          break;
        case 'update':
          batch.update(docRef, op.data!);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.BATCH, `batch(${operations.length} ops)`);
  }
};

/**
 * Generate a new document ID without writing (for use in batched creates).
 */
export const generateDocId = (collectionName: string): string => {
  return doc(collection(db, collectionName)).id;
};

// ===============================================================
// Audit Log
// ===============================================================

export const logAction = async (action: string, entity: string, entityId: string, details: string): Promise<void> => {
  if (!auth.currentUser) return;
  await createDocument('auditLogs', {
    userId: auth.currentUser.uid,
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    details
  });
};
