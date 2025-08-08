import { createPlugin, createRoutableExtension, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { mendApiRef } from './api/MendApi';
import { MendClient } from './api/MendClient';
import { rootRouteRef } from './routes';

export const mendPlugin = createPlugin({
  id: 'mend',
  apis: [
    {
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) => new MendClient({ discoveryApi, fetchApi }),
      provide: mendApiRef,
    },
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const MendPage = mendPlugin.provide(
  createRoutableExtension({
    name: 'MendPage',
    component: () => import('./components/MendPage').then(m => m.MendPage),
    mountPoint: rootRouteRef,
  }),
);