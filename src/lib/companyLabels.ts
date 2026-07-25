/**
 * Dynamic labels based on company business type.
 *
 * SIPL (CONSTRUCTION): Project/Site, Unit, Unit Type
 * SHSPL (HOSPITALITY): Project/Hotel, Department, Department Type
 */

import { BusinessType } from '../types';

export interface CompanyLabels {
  projectLabel: string;
  subLocationLabel: string;
  subLocationTypeLabel: string;
  subLocationPlural: string;
}

const LABELS: Record<BusinessType, CompanyLabels> = {
  CONSTRUCTION: {
    projectLabel: 'Project / Site',
    subLocationLabel: 'Unit',
    subLocationTypeLabel: 'Unit Type',
    subLocationPlural: 'Units',
  },
  HOSPITALITY: {
    projectLabel: 'Project / Hotel',
    subLocationLabel: 'Department',
    subLocationTypeLabel: 'Department Type',
    subLocationPlural: 'Departments',
  },
};

const DEFAULT_LABELS: CompanyLabels = LABELS.CONSTRUCTION;

export function getLabels(businessType?: BusinessType | null): CompanyLabels {
  if (!businessType) return DEFAULT_LABELS;
  return LABELS[businessType] || DEFAULT_LABELS;
}

/** SIPL sub-location types */
export const CONSTRUCTION_SUB_TYPES = [
  'Plot', 'Singlex', 'Duplex', 'Common Area', 'Infrastructure'
];

/** SHSPL sub-location types */
export const HOSPITALITY_SUB_TYPES = [
  'Kitchen', 'Rooms', 'Banquet', 'Lawn', 'Pool',
  'Reception', 'Housekeeping', 'Maintenance', 'Exterior', 'Service Area'
];

export function getSubLocationTypes(businessType?: BusinessType | null): string[] {
  if (businessType === 'HOSPITALITY') return HOSPITALITY_SUB_TYPES;
  return CONSTRUCTION_SUB_TYPES;
}
