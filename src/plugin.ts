import { createPlugin } from '@backstage/core-plugin-api';
import { createRoutableExtension } from '@backstage/core-components';
import { createCardExtension } from '@backstage/plugin-catalog-react';
import { youtubeVideoRouteRef } from './routes';
import { YouTubeVideoPage } from './components/YouTubeVideoPage';
import { YouTubeVideoCard } from './components/YouTubeVideoCard';

export const youtubeVideoPlugin = createPlugin({
  id: 'youtube-video',
  routes: {
    root: youtubeVideoRouteRef,
  },
});

export const YouTubeVideoPageExtension = youtubeVideoPlugin.provide(
  createRoutableExtension({
    name: 'YouTubeVideoPage',
    component: () => import('./components/YouTubeVideoPage').then(m => m.YouTubeVideoPage),
    mountPoint: youtubeVideoRouteRef,
  }),
);

export const YouTubeVideoCardExtension = youtubeVideoPlugin.provide(
  createCardExtension({
    name: 'YouTubeVideoCard',
    title: 'YouTube Video',
    description: 'Display a YouTube video',
    component: () => import('./components/YouTubeVideoCard').then(m => m.YouTubeVideoCard),
  }),
);