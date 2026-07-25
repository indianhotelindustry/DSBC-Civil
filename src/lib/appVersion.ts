/**
 * App version constants.
 * The version string is kept in sync with VERSION file and package.json.
 */

export const APP_VERSION = '1.0.0-beta.1';
export const APP_BUILD_LABEL = 'v1.0.0-beta.1-commercial';
export const APP_ENVIRONMENT = (import.meta.env.MODE === 'production' ? 'production' : 'development') as
  'development' | 'staging' | 'production';
