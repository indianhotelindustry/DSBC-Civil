import { Project, WorkOrder, BusinessRuleError } from '../types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
  where
} from './db';

const COLLECTION = 'projects';

export const projectService = {
  getAll: (callback: (projects: Project[]) => void) => {
    return subscribeToCollection<Project>(COLLECTION, callback);
  },

  getById: async (id: string): Promise<Project | null> => {
    return getDocument<Project>(COLLECTION, id);
  },

  create: async (data: Omit<Project, 'id' | 'createdAt' | 'createdBy'>) => {
    const id = await createDocument(COLLECTION, data);
    if (id) {
      await logAction('CREATE', 'Project', id, `Created project: ${data.name}`);
    }
    return id;
  },

  update: async (id: string, data: Partial<Project>) => {
    await updateDocument(COLLECTION, id, data);
    await logAction('UPDATE', 'Project', id, `Updated project: ${data.name || id}`);
  },

  delete: async (id: string) => {
    const project = await getDocument<Project>(COLLECTION, id);
    if (!project) return;

    // Block if any work orders reference this project
    const workOrders = await queryDocuments<WorkOrder>('workOrders', [
      where('projectId', '==', id)
    ]);
    const activeWOs = workOrders.filter(wo => wo.status !== 'REJECTED');
    if (activeWOs.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete project ${project.name}: ${activeWOs.length} active work order(s) exist.`
      );
    }

    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Project', id, `Deleted project: ${project.name}`);
  }
};
