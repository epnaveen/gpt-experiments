# Red Hat Developer Hub YouTube Video Plugin

A dynamic plugin for Red Hat Developer Hub that allows users to watch YouTube videos directly within the platform. The plugin provides both a full-page video player and a catalog card component for embedding videos in entity views.

## Features

- **Full-Page Video Player**: Dedicated page for watching YouTube videos with URL input
- **Catalog Card Component**: Embed YouTube videos in entity catalog views
- **Smart URL Parsing**: Supports multiple YouTube URL formats
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable Options**: Configurable player settings (autoplay, controls, etc.)
- **Error Handling**: Graceful handling of invalid URLs and loading errors
- **Dynamic Plugin Architecture**: Loads at runtime without rebuilding Red Hat Developer Hub

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- URLs with additional parameters and timestamps

## Prerequisites

Before deploying the plugin, ensure you have:

- **Red Hat Developer Hub instance** running (version 1.0.0 or later)
- **Node.js 18+** and **npm/yarn** for building the plugin
- **Backstage CLI** installed globally
- **Kubernetes cluster** (if deploying to Kubernetes)
- **kubectl** configured and connected to your cluster
- **Git** for cloning and version control

## Installation & Deployment

### Step 1: Clone and Prepare the Plugin

```bash
# Clone the plugin repository
git clone <your-repo-url>
cd plugin-youtube-video

# Install dependencies
npm install

# Verify the setup
npm run lint
npm test
```

### Step 2: Build the Plugin

```bash
# Build the plugin for production
npm run build

# Verify the build output
ls -la dist/
```

The build should create a `dist/` directory containing:
- `index.esm.js` - Main plugin bundle
- `index.d.ts` - TypeScript definitions
- `package.json` - Plugin metadata

### Step 3: Deploy as Dynamic Plugin

#### Option A: Kubernetes Deployment (Recommended)

1. **Create the namespace** (if it doesn't exist):
```bash
kubectl create namespace redhat-developer-hub
```

2. **Apply the plugin configuration**:
```bash
kubectl apply -f deployment/plugin-config.yaml
```

3. **Verify the configuration**:
```bash
kubectl get configmaps -n redhat-developer-hub
kubectl get pods -n redhat-developer-hub
```

#### Option B: Local Development Deployment

1. **Copy the built plugin** to your Red Hat Developer Hub's dynamic plugins directory:
```bash
# Assuming Red Hat Developer Hub is running locally
cp -r dist/ /path/to/redhat-developer-hub/dynamic-plugins/youtube-video/
```

2. **Create a dynamic plugins configuration file**:
```bash
cat > /path/to/redhat-developer-hub/dynamic-plugins.yaml << EOF
plugins:
  - name: youtube-video
    package: "./dynamic-plugins/youtube-video"
    config:
      defaultVideoId: ""
      allowCustomUrls: true
      showControls: true
      autoplay: false
      muted: false
EOF
```

### Step 4: Configure Red Hat Developer Hub

#### Environment Variables Configuration

Add these environment variables to your Red Hat Developer Hub deployment:

```bash
# Required for dynamic plugin loading
DYNAMIC_PLUGINS_CONFIG_PATH=/app/dynamic-plugins/dynamic-plugins.yaml

# Plugin-specific configuration
YOUTUBE_DEFAULT_VIDEO_ID=""
YOUTUBE_ALLOW_CUSTOM_URLS=true
YOUTUBE_SHOW_CONTROLS=true
YOUTUBE_AUTOPLAY=false
YOUTUBE_MUTED=false
YOUTUBE_MAX_WIDTH=1200px
YOUTUBE_DEFAULT_HEIGHT=400
```

#### Kubernetes Environment Variables

If using Kubernetes, update the deployment:

```bash
kubectl patch deployment redhat-developer-hub -n redhat-developer-hub --patch '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "redhat-developer-hub",
            "env": [
              {
                "name": "DYNAMIC_PLUGINS_CONFIG_PATH",
                "value": "/app/dynamic-plugins/dynamic-plugins.yaml"
              },
              {
                "name": "YOUTUBE_ALLOW_CUSTOM_URLS",
                "value": "true"
              }
            ]
          }
        ]
      }
    }
  }
}'
```

### Step 5: Restart Red Hat Developer Hub

#### Kubernetes Restart
```bash
# Restart the deployment to pick up new configuration
kubectl rollout restart deployment redhat-developer-hub -n redhat-developer-hub

# Monitor the restart
kubectl rollout status deployment redhat-developer-hub -n redhat-developer-hub

# Check pod status
kubectl get pods -n redhat-developer-hub
```

#### Local Development Restart
```bash
# Stop the current Red Hat Developer Hub instance
# (Ctrl+C if running in terminal, or stop the service)

# Start Red Hat Developer Hub again
npm start
# or
yarn start
```

### Step 6: Verify Plugin Installation

1. **Access Red Hat Developer Hub** in your browser
2. **Check the navigation menu** - you should see "YouTube Video" or similar
3. **Navigate to the plugin page** - typically `/youtube-video`
4. **Test with a YouTube URL**:
   - Enter: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Click "Watch Video"
   - Verify the video loads and plays

### Step 7: Configure Entity Annotations (Optional)

To display YouTube videos in entity catalog views, add annotations to your entities:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    youtube.com/video-url: "https://www.youtube.com/watch?v=VIDEO_ID"
    youtube.com/video-title: "Service Overview Video"
    youtube.com/video-description: "Learn about this service"
spec:
  type: service
  lifecycle: production
  owner: team-a
```

## Configuration Options

### Plugin Configuration

The plugin supports extensive configuration through multiple methods:

#### 1. Environment Variables
```bash
# Core settings
YOUTUBE_DEFAULT_VIDEO_ID="your_default_video_id"
YOUTUBE_ALLOW_CUSTOM_URLS=true
YOUTUBE_SHOW_CONTROLS=true
YOUTUBE_AUTOPLAY=false
YOUTUBE_MUTED=false

# Display settings
YOUTUBE_MAX_WIDTH=1200px
YOUTUBE_DEFAULT_HEIGHT=400
YOUTUBE_ENABLE_TIMESTAMPS=true
YOUTUBE_SHOW_RELATED_VIDEOS=false
YOUTUBE_MODEST_BRANDING=true
```

#### 2. Backstage Configuration
```yaml
# app-config.yaml
youtube:
  defaultVideoId: ""
  allowCustomUrls: true
  showControls: true
  autoplay: false
  muted: false
  maxWidth: "1200px"
  defaultHeight: 400
  enableTimestamps: true
  showRelatedVideos: false
  modestBranding: true
```

#### 3. Dynamic Plugin Configuration
```yaml
# dynamic-plugins.yaml
plugins:
  - name: youtube-video
    package: "./dynamic-plugins/youtube-video"
    config:
      defaultVideoId: ""
      allowCustomUrls: true
      showControls: true
      autoplay: false
      muted: false
```

### Component-Level Configuration

You can also configure individual components:

```tsx
<YouTubeVideoPlayer
  videoId="dQw4w9WgXcQ"
  width="100%"
  height={400}
  options={{
    autoplay: false,
    muted: true,
    showControls: true,
    startTime: 30,  // Start at 30 seconds
    endTime: 120,   // End at 2 minutes
  }}
/>
```

## Usage

### Full-Page Video Player

The plugin provides a dedicated page at `/youtube-video` where users can:

1. **Enter a YouTube video URL** in the input field
2. **Click "Watch Video"** to load the video
3. **Watch the video** directly in the browser
4. **Switch between different videos** by entering new URLs

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

## Troubleshooting

### Common Issues and Solutions

#### 1. Plugin Not Appearing

**Symptoms**: Plugin doesn't show in navigation or routes
**Solutions**:
```bash
# Check if dynamic plugins are enabled
kubectl get configmap dynamic-plugins-config -n redhat-developer-hub -o yaml

# Verify the plugin package exists
ls -la /app/dynamic-plugins/youtube-video/

# Check Red Hat Developer Hub logs
kubectl logs -f deployment/redhat-developer-hub -n redhat-developer-hub
```

#### 2. Video Not Loading

**Symptoms**: Video player shows but content doesn't load
**Solutions**:
- Verify the YouTube URL is valid and accessible
- Check if the video is publicly available
- Ensure network connectivity to YouTube
- Check browser console for errors

#### 3. Configuration Not Applied

**Symptoms**: Default settings not taking effect
**Solutions**:
```bash
# Verify environment variables
kubectl exec -it deployment/redhat-developer-hub -n redhat-developer-hub -- env | grep YOUTUBE

# Check configuration loading
kubectl logs deployment/redhat-developer-hub -n redhat-developer-hub | grep -i config
```

#### 4. Build Errors

**Symptoms**: Plugin fails to build
**Solutions**:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint

# Verify dependencies
npm audit
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
# Set debug environment variable
export DEBUG=youtube-video-plugin:*

# Or add to Kubernetes deployment
kubectl patch deployment redhat-developer-hub -n redhat-developer-hub --patch '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "redhat-developer-hub",
            "env": [
              {
                "name": "DEBUG",
                "value": "youtube-video-plugin:*"
              }
            ]
          }
        ]
      }
    }
  }
}'
```

### Health Checks

Verify the plugin is working correctly:

```bash
# Check plugin status
curl -s http://localhost:3000/api/health | jq '.status'

# Verify dynamic plugins
curl -s http://localhost:3000/api/plugins | jq '.[] | select(.name == "youtube-video")'
```

## Development

### Development Server

```bash
# Start development mode
npm run dev

# The plugin will be available at http://localhost:3000/youtube-video
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- youtubeUtils.test.ts
```

### Linting

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Building

```bash
# Build for production
npm run build

# Build with type checking
npm run build:types

# Clean build artifacts
npm run clean
```

## API Reference

### Components

#### YouTubeVideoPage
Main page component for the video player interface.

**Props**: None (uses internal state)

**Features**:
- URL input form
- Video player display
- Error handling
- Responsive design

#### YouTubeVideoPlayer
Core video player component.

**Props**:
- `videoId?: string` - YouTube video ID
- `videoUrl?: string` - YouTube video URL
- `title?: string` - Video title
- `description?: string` - Video description
- `width?: string | number` - Player width
- `height?: string | number` - Player height
- `options?: YouTubeVideoPluginOptions` - Player options

**Options**:
- `autoplay?: boolean` - Auto-play video
- `muted?: boolean` - Mute video
- `showControls?: boolean` - Show player controls
- `startTime?: number` - Start time in seconds
- `endTime?: number` - End time in seconds

#### YouTubeVideoCard
Catalog card component for entity views.

**Props**:
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

#### getYouTubeUrls(videoId: string): { watch: string, embed: string, short: string }
Converts a video ID to various URL formats.

#### extractYouTubeTimestamp(url: string): number | null
Extracts timestamp from YouTube URL if present.

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
├── config.ts                     # Configuration management
└── index.ts                      # Main entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## License

Apache-2.0

## Support

For issues and questions:
- Create an issue in the repository
- Check the Red Hat Developer Hub documentation
- Contact the Red Hat Developer Hub team
- Review the troubleshooting section above

## Changelog

### v0.1.0
- Initial release
- Full-page video player
- Catalog card component
- URL parsing utilities
- Basic configuration options
- Dynamic plugin support
- Kubernetes deployment configurations