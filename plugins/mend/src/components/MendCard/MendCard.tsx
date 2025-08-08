import React from 'react';
import { InfoCard, Progress, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { mendApiRef } from '../../api/MendApi';
import { useAsync } from 'react-use';
import { MendVulnerability } from '../../api/types';

const MEND_PROJECT_ANNOTATION = 'mend.io/project-token';

export const MendCard = () => {
  const { entity } = useEntity();
  const mendApi = useApi(mendApiRef);
  const projectId = entity?.metadata?.annotations?.[MEND_PROJECT_ANNOTATION];

  const { value: vulns, loading, error } = useAsync(async () => {
    if (!projectId) return [] as MendVulnerability[];
    return await mendApi.getProjectVulnerabilities({ projectId, status: 'Open' });
  }, [projectId]);

  const columns: TableColumn<MendVulnerability>[] = [
    { title: 'Severity', field: 'severity' },
    { title: 'Title', field: 'title' },
    { title: 'CVE', field: 'cve' },
  ];

  if (!projectId) {
    return (
      <InfoCard title="Mend">
        Add <code>{MEND_PROJECT_ANNOTATION}</code> annotation to enable Mend data.
      </InfoCard>
    );
  }

  if (loading) return (<InfoCard title="Mend"><Progress /></InfoCard>);
  if (error) return (<InfoCard title="Mend"><ResponseErrorPanel error={error} /></InfoCard>);

  return (
    <InfoCard title="Mend">
      <Table<MendVulnerability>
        options={{ paging: false, padding: 'dense', showTitle: false }}
        columns={columns}
        data={(vulns ?? []).slice(0, 5)}
      />
    </InfoCard>
  );
};