import { ApiRef, createApiRef } from '@backstage/core-plugin-api';
import { MendProjectSummary, MendVulnerability } from './types';

export interface MendApi {
  getProjectSummary(options: { projectId: string }): Promise<MendProjectSummary>;
  getProjectVulnerabilities(options: { projectId: string; status?: 'Open' | 'Closed' }): Promise<MendVulnerability[]>;
}

export const mendApiRef: ApiRef<MendApi> = createApiRef<MendApi>({
  id: 'plugin.mend.service',
});