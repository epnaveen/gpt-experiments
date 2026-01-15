export interface YouTubeVideoPluginOptions {
  defaultVideoId?: string;
  allowCustomUrls?: boolean;
  showControls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
}

export interface YouTubeVideoProps {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  width?: string | number;
  height?: string | number;
  options?: YouTubeVideoPluginOptions;
}

export interface YouTubeVideoCardProps {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  entity?: any;
}