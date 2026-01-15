import { Config } from '@backstage/config';

export interface YouTubeVideoConfig {
  defaultVideoId?: string;
  allowCustomUrls: boolean;
  showControls: boolean;
  autoplay: boolean;
  muted: boolean;
  maxWidth: string;
  defaultHeight: number;
  enableTimestamps: boolean;
  showRelatedVideos: boolean;
  modestBranding: boolean;
}

export function getYouTubeVideoConfig(config: Config): YouTubeVideoConfig {
  return {
    defaultVideoId: config.getOptionalString('youtube.defaultVideoId'),
    allowCustomUrls: config.getOptionalBoolean('youtube.allowCustomUrls') ?? true,
    showControls: config.getOptionalBoolean('youtube.showControls') ?? true,
    autoplay: config.getOptionalBoolean('youtube.autoplay') ?? false,
    muted: config.getOptionalBoolean('youtube.muted') ?? false,
    maxWidth: config.getOptionalString('youtube.maxWidth') ?? '1200px',
    defaultHeight: config.getOptionalNumber('youtube.defaultHeight') ?? 400,
    enableTimestamps: config.getOptionalBoolean('youtube.enableTimestamps') ?? true,
    showRelatedVideos: config.getOptionalBoolean('youtube.showRelatedVideos') ?? false,
    modestBranding: config.getOptionalBoolean('youtube.modestBranding') ?? true,
  };
}

export function getYouTubeVideoConfigFromEnv(): Partial<YouTubeVideoConfig> {
  return {
    defaultVideoId: process.env.YOUTUBE_DEFAULT_VIDEO_ID,
    allowCustomUrls: process.env.YOUTUBE_ALLOW_CUSTOM_URLS !== 'false',
    showControls: process.env.YOUTUBE_SHOW_CONTROLS !== 'false',
    autoplay: process.env.YOUTUBE_AUTOPLAY === 'true',
    muted: process.env.YOUTUBE_MUTED === 'true',
    maxWidth: process.env.YOUTUBE_MAX_WIDTH || '1200px',
    defaultHeight: parseInt(process.env.YOUTUBE_DEFAULT_HEIGHT || '400', 10),
    enableTimestamps: process.env.YOUTUBE_ENABLE_TIMESTAMPS !== 'false',
    showRelatedVideos: process.env.YOUTUBE_SHOW_RELATED_VIDEOS === 'true',
    modestBranding: process.env.YOUTUBE_MODEST_BRANDING !== 'false',
  };
}

export function mergeConfigs(
  baseConfig: YouTubeVideoConfig,
  envConfig: Partial<YouTubeVideoConfig>,
  userConfig?: Partial<YouTubeVideoConfig>
): YouTubeVideoConfig {
  return {
    ...baseConfig,
    ...envConfig,
    ...userConfig,
  };
}

export const DEFAULT_CONFIG: YouTubeVideoConfig = {
  allowCustomUrls: true,
  showControls: true,
  autoplay: false,
  muted: false,
  maxWidth: '1200px',
  defaultHeight: 400,
  enableTimestamps: true,
  showRelatedVideos: false,
  modestBranding: true,
};