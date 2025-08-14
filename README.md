# Red Hat Developer Hub YouTube Video Plugin

A dynamic plugin for Red Hat Developer Hub that allows users to watch YouTube videos directly within the platform. The plugin provides both a full-page video player and a catalog card component for embedding videos in entity views.

## Features

- **Full-Page Video Player**: Dedicated page for watching YouTube videos with URL input
- **Catalog Card Component**: Embed YouTube videos in entity catalog views
- **Smart URL Parsing**: Supports multiple YouTube URL formats
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable Options**: Configurable player settings (autoplay, controls, etc.)
- **Error Handling**: Graceful handling of invalid URLs and loading errors

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- URLs with additional parameters and timestamps

## Installation

### Prerequisites

- Red Hat Developer Hub instance
- Node.js 18+ and npm/yarn
- Backstage CLI

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Plugin

```bash
npm run build
```

### 3. Integration with Red Hat Developer Hub

#### Option A: Dynamic Plugin Loading

1. Copy the built plugin to your Red Hat Developer Hub instance
2. Add the plugin to your dynamic plugin configuration
3. Restart the service

#### Option B: Source Integration

1. Copy the source files to your Red Hat Developer Hub project
2. Add the plugin to your `packages/app/src/App.tsx`
3. Rebuild and restart

## Usage

### Full-Page Video Player

The plugin provides a dedicated page at `/youtube-video` where users can:

1. Enter a YouTube video URL
2. Watch the video directly in the browser
3. Switch between different videos

### Catalog Card Component

Use the `YouTubeVideoCard` component in entity views:

```tsx
import { YouTubeVideoCard } from '@redhat-developer-hub/plugin-youtube-video';

// In your entity view component
<YouTubeVideoCard
  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="My Video"
  description="Video description"
  entity={entity}
/>
```

### Programmatic Usage

```tsx
import { YouTubeVideoPlayer } from '@redhat-developer-hub/plugin-youtube-video';

<YouTubeVideoPlayer
  videoId="dQw4w9WgXcQ"
  width="100%"
  height={400}
  options={{
    autoplay: false,
    muted: true,
    showControls: true,
  }}
/>
```

## Configuration

### Plugin Options

```typescript
interface YouTubeVideoPluginOptions {
  defaultVideoId?: string;        // Default video to show
  allowCustomUrls?: boolean;      // Allow custom URL input
  showControls?: boolean;         // Show video controls
  autoplay?: boolean;             // Autoplay videos
  muted?: boolean;                // Mute videos by default
}
```

### Environment Variables

```bash
# Optional: Set default video ID
YOUTUBE_DEFAULT_VIDEO_ID=your_default_video_id

# Optional: Enable/disable features
YOUTUBE_ALLOW_CUSTOM_URLS=true
YOUTUBE_AUTOPLAY=false
```

## API Reference

### Components

#### YouTubeVideoPage
Main page component for the video player interface.

**Props:**
- None (uses internal state)

#### YouTubeVideoPlayer
Core video player component.

**Props:**
- `videoId?: string` - YouTube video ID
- `videoUrl?: string` - YouTube video URL
- `title?: string` - Video title
- `description?: string` - Video description
- `width?: string | number` - Player width
- `height?: string | number` - Player height
- `options?: YouTubeVideoPluginOptions` - Player options

#### YouTubeVideoCard
Catalog card component for entity views.

**Props:**
- `videoId?: string` - YouTube video ID
- `videoUrl?: string` - YouTube video URL
- `title?: string` - Video title
- `description?: string` - Video description
- `entity?: any` - Backstage entity object

### Utility Functions

#### extractYouTubeVideoId(url: string): string | null
Extracts video ID from various YouTube URL formats.

#### isValidYouTubeVideoId(videoId: string): boolean
Validates if a string is a valid YouTube video ID.

#### buildYouTubeEmbedUrl(videoId: string, options?: object): string
Builds a YouTube embed URL with optional parameters.

## Development

### Development Server

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── YouTubeVideoPage.tsx      # Main page component
│   ├── YouTubeVideoPlayer.tsx    # Video player component
│   └── YouTubeVideoCard.tsx      # Catalog card component
├── utils/
│   └── youtubeUtils.ts           # Utility functions
├── types.ts                      # TypeScript type definitions
├── routes.ts                     # Routing configuration
├── plugin.ts                     # Plugin configuration
└── index.ts                      # Main entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Video not loading**: Check if the video ID is valid and the video is publicly accessible
2. **Plugin not appearing**: Ensure the plugin is properly integrated and the service is restarted
3. **URL parsing errors**: Verify the YouTube URL format is supported

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=youtube-video-plugin:*
```

## License

Apache-2.0

## Support

For issues and questions:
- Create an issue in the repository
- Check the Red Hat Developer Hub documentation
- Contact the Red Hat Developer Hub team

## Changelog

### v0.1.0
- Initial release
- Full-page video player
- Catalog card component
- URL parsing utilities
- Basic configuration options