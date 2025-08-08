export type MendSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MendVulnerability {
  id: string;
  title: string;
  severity: MendSeverity;
  cve?: string;
  cwe?: string;
  libraryName?: string;
  libraryVersion?: string;
  publishedDate?: string;
  fixedVersions?: string[];
  url?: string;
}

export interface MendProjectSummary {
  projectId: string;
  projectName?: string;
  openVulnerabilities: number;
  high: number;
  medium: number;
  low: number;
  critical: number;
  lastScanDate?: string;
}