// Example integration of the YouTube Video Plugin in Red Hat Developer Hub
// This file shows how to integrate the plugin into your main application

import React from 'react';
import { createApp } from '@backstage/core-app-api';
import { youtubeVideoPlugin } from '@redhat-developer-hub/plugin-youtube-video';

// Example 1: Basic plugin integration
const app = createApp({
  apis: [],
  plugins: [
    // Add the YouTube video plugin
    youtubeVideoPlugin,
  ],
});

// Example 2: Using the plugin components in your app
import { YouTubeVideoPage, YouTubeVideoCard } from '@redhat-developer-hub/plugin-youtube-video';

// Example page component that uses the YouTube video plugin
export const ExamplePage: React.FC = () => {
  return (
    <div>
      <h1>My Application with YouTube Videos</h1>
      
      {/* Use the full page component */}
      <YouTubeVideoPage />
      
      {/* Or use the card component in entity views */}
      <YouTubeVideoCard
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Sample Video"
        description="This is a sample YouTube video"
      />
    </div>
  );
};

// Example 3: Integration in App.tsx
export const App: React.FC = () => {
  return (
    <div>
      {/* Your existing app content */}
      
      {/* Add the YouTube video plugin routes */}
      <youtubeVideoPlugin.routes.root />
    </div>
  );
};

// Example 4: Using the plugin in entity views
import { EntityLayout, EntitySwitch } from '@backstage/plugin-catalog';
import { EntityYouTubeVideoTab } from './EntityYouTubeVideoTab';

export const EntityLayoutWrapper: React.FC<{ entity: any }> = ({ entity }) => {
  return (
    <EntityLayout>
      {/* Existing tabs */}
      <EntityLayout.Route path="/" title="Overview">
        {/* Your existing overview content */}
      </EntityLayout.Route>
      
      {/* Add YouTube video tab */}
      <EntityLayout.Route path="/youtube" title="YouTube Videos">
        <EntityYouTubeVideoTab entity={entity} />
      </EntityLayout.Route>
    </EntityLayout>
  );
};

// Example 5: Custom entity tab component
export const EntityYouTubeVideoTab: React.FC<{ entity: any }> = ({ entity }) => {
  // Extract video information from entity metadata
  const videoUrl = entity.metadata?.annotations?.['youtube.com/video-url'];
  const videoTitle = entity.metadata?.annotations?.['youtube.com/video-title'];
  const videoDescription = entity.metadata?.annotations?.['youtube.com/video-description'];

  if (!videoUrl) {
    return (
      <div>
        <p>No YouTube video configured for this entity.</p>
        <p>Add the following annotation to your entity:</p>
        <code>youtube.com/video-url: https://www.youtube.com/watch?v=VIDEO_ID</code>
      </div>
    );
  }

  return (
    <div>
      <h2>Related YouTube Video</h2>
      <YouTubeVideoCard
        videoUrl={videoUrl}
        title={videoTitle}
        description={videoDescription}
        entity={entity}
      />
    </div>
  );
};

// Example 6: Configuration options
export const pluginConfig = {
  youtubeVideo: {
    defaultVideoId: 'dQw4w9WgXcQ',
    allowCustomUrls: true,
    showControls: true,
    autoplay: false,
    muted: true,
  },
};

// Example 7: Dynamic plugin loading configuration
export const dynamicPluginsConfig = {
  plugins: [
    {
      name: 'youtube-video',
      package: '@redhat-developer-hub/plugin-youtube-video',
      config: pluginConfig.youtubeVideo,
    },
  ],
};

// Example 8: Using the plugin with custom styling
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  videoContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  videoTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

export const StyledYouTubeVideo: React.FC<{ videoId: string }> = ({ videoId }) => {
  const classes = useStyles();

  return (
    <div className={classes.videoContainer}>
      <h3 className={classes.videoTitle}>Custom Styled Video Player</h3>
      <YouTubeVideoPlayer
        videoId={videoId}
        width="100%"
        height={400}
        options={{
          showControls: true,
          autoplay: false,
          muted: false,
        }}
      />
    </div>
  );
};