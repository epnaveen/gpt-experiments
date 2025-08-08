import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { MendApi } from './MendApi';
import { MendProjectSummary, MendVulnerability } from './types';

export class MendClient implements MendApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async getBaseUrl(): Promise<string> {
    const proxyBaseUrl = await this.discoveryApi.getBaseUrl('proxy');
    // Calls will be routed via app-config proxy: proxy:/mend -> https://api.mend.io
    return `${proxyBaseUrl}/mend`;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${path}`;

    const response = await this.fetchApi.fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Mend API request failed (${response.status}): ${text}`);
    }

    return (await response.json()) as T;
  }

  async getProjectSummary(options: { projectId: string }): Promise<MendProjectSummary> {
    const { projectId } = options;
    // Example: Summaries endpoint: adapt to your Mend plan/APIs
    const data = await this.request<any>(`/v1.3/projects/${encodeURIComponent(projectId)}`);
    return {
      projectId,
      projectName: data.projectName ?? data.name ?? undefined,
      openVulnerabilities: data.openVulnerabilities ?? data.openAlerts ?? 0,
      high: data.highVulnerabilities ?? data.highAlerts ?? 0,
      medium: data.mediumVulnerabilities ?? data.mediumAlerts ?? 0,
      low: data.lowVulnerabilities ?? data.lowAlerts ?? 0,
      critical: data.criticalVulnerabilities ?? data.criticalAlerts ?? 0,
      lastScanDate: data.lastScanDate ?? undefined,
    };
  }

  async getProjectVulnerabilities(options: { projectId: string; status?: 'Open' | 'Closed' }): Promise<MendVulnerability[]> {
    const { projectId, status = 'Open' } = options;
    // Example: Alerts endpoint; map to a simplified shape
    const data = await this.request<any[]>(`/v1.3/projects/${encodeURIComponent(projectId)}/alerts?status=${encodeURIComponent(status)}`);
    return (data ?? []).map(alert => ({
      id: String(alert.alertUuid ?? alert.id ?? ''),
      title: alert.title ?? alert.vulnerability?.name ?? 'Vulnerability',
      severity: (alert.severity ?? alert.vulnerability?.severity ?? 'Medium') as any,
      cve: alert.cve ?? alert.vulnerability?.cveIds?.[0],
      cwe: alert.cwe ?? undefined,
      libraryName: alert.library?.name ?? alert.componentName ?? undefined,
      libraryVersion: alert.library?.version ?? alert.componentVersion ?? undefined,
      publishedDate: alert.publishedDate ?? alert.creationDate ?? undefined,
      fixedVersions: alert.fixedVersions ?? alert.remediation?.recommendedVersions ?? [],
      url: alert.url ?? alert.vulnerability?.references?.[0]?.url ?? undefined,
    }));
  }
}