import React from 'react';
import { Content, Header, Page, Progress, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { mendApiRef } from '../../api/MendApi';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Typography, Box } from '@mui/material';
import { useAsync } from 'react-use';
import { MendVulnerability } from '../../api/types';

const MEND_PROJECT_ANNOTATION = 'mend.io/project-token';

export const MendPage = () => {
  const { entity } = useEntity();
  const mendApi = useApi(mendApiRef);

  const projectId = entity?.metadata?.annotations?.[MEND_PROJECT_ANNOTATION];

  const { value: summary, loading: loadingSummary, error: errorSummary } = useAsync(async () => {
    if (!projectId) return undefined;
    return await mendApi.getProjectSummary({ projectId });
  }, [projectId]);

  const { value: vulns, loading: loadingVulns, error: errorVulns } = useAsync(async () => {
    if (!projectId) return [] as MendVulnerability[];
    return await mendApi.getProjectVulnerabilities({ projectId, status: 'Open' });
  }, [projectId]);

  const columns: TableColumn<MendVulnerability>[] = [
    { title: 'Severity', field: 'severity' },
    { title: 'Title', field: 'title' },
    { title: 'CVE', field: 'cve' },
    { title: 'Library', field: 'libraryName' },
    { title: 'Version', field: 'libraryVersion' },
  ];

  if (!projectId) {
    const proxyTip = `proxy:/mend -> https://api.mend.io`;
    return (
      <Page themeId="tool">
        <Header title="Mend" subtitle="Software Composition Analysis" />
        <Content>
          <Box mb={2}>
            <Typography variant="body1">
              Missing required entity annotation <code>{MEND_PROJECT_ANNOTATION}</code>.
            </Typography>
          </Box>
          <Typography variant="body2">
            Add the annotation to your entity and configure the Backstage proxy to Mend.
          </Typography>
          <Box mt={2}>
            <Typography variant="body2">Proxy example:</Typography>
            <pre>{proxyTip}</pre>
          </Box>
        </Content>
      </Page>
    );
  }

  if (loadingSummary || loadingVulns) {
    return (
      <Page themeId="tool">
        <Header title="Mend" />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (errorSummary || errorVulns) {
    return (
      <Page themeId="tool">
        <Header title="Mend" />
        <Content>
          <ResponseErrorPanel error={(errorSummary ?? errorVulns)!} />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="Mend" subtitle={summary?.projectName ?? projectId} />
      <Content>
        <Box mb={2}>
          <Typography>
            Open vulnerabilities: <strong>{summary?.openVulnerabilities ?? (vulns?.length ?? 0)}</strong>
          </Typography>
          <Typography variant="body2">
            Critical: {summary?.critical ?? 0} · High: {summary?.high ?? 0} · Medium: {summary?.medium ?? 0} · Low: {summary?.low ?? 0}
          </Typography>
        </Box>
        <Table<MendVulnerability>
          options={{ paging: true, pageSize: 10, padding: 'dense', search: true, showTitle: false }}
          columns={columns}
          data={vulns ?? []}
        />
      </Content>
    </Page>
  );
};