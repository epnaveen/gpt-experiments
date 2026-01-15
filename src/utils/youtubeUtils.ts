/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL in any supported format
 * @returns Video ID string or null if invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove any whitespace and trim
  const cleanUrl = url.trim();

  // Supported URL patterns
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    
    // Short URLs: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    
    // Embed URLs: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    
    // Legacy URLs: youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    
    // URLs with additional parameters: youtube.com/watch?param=value&v=VIDEO_ID
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    
    // URLs with hash fragments
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})#.*/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates if a string is a valid YouTube video ID
 * @param videoId - Video ID to validate
 * @returns Boolean indicating if the video ID is valid
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
  if (!videoId || typeof videoId !== 'string') {
    return false;
  }

  // YouTube video IDs are exactly 11 characters long and contain only
  // alphanumeric characters, hyphens, and underscores
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdPattern.test(videoId);
}

/**
 * Builds a YouTube embed URL with optional parameters
 * @param videoId - YouTube video ID
 * @param options - Embed options
 * @returns Complete embed URL
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    muted?: boolean;
    showControls?: boolean;
    startTime?: number;
    endTime?: number;
    modestBranding?: boolean;
    rel?: boolean;
  } = {}
): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  const baseUrl = 'https://www.youtube.com/embed/';
  const params = new URLSearchParams();

  // Set default options
  const {
    autoplay = false,
    muted = false,
    showControls = true,
    startTime = 0,
    endTime = 0,
    modestBranding = true,
    rel = false,
  } = options;

  // Add parameters based on options
  if (autoplay) params.append('autoplay', '1');
  if (muted) params.append('mute', '1');
  if (!showControls) params.append('controls', '0');
  if (startTime > 0) params.append('start', startTime.toString());
  if (endTime > 0) params.append('end', endTime.toString());
  if (modestBranding) params.append('modestbranding', '1');
  if (!rel) params.append('rel', '0');

  // Additional parameters for better experience
  params.append('showinfo', '0'); // Hide video info
  params.append('iv_load_policy', '3'); // Hide video annotations

  const queryString = params.toString();
  return `${baseUrl}${videoId}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Converts a YouTube video ID to various URL formats
 * @param videoId - YouTube video ID
 * @returns Object with different URL formats
 */
export function getYouTubeUrls(videoId: string): {
  watch: string;
  embed: string;
  short: string;
} {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  return {
    watch: `https://www.youtube.com/watch?v=${videoId}`,
    embed: `https://www.youtube.com/embed/${videoId}`,
    short: `https://youtu.be/${videoId}`,
  };
}

/**
 * Extracts timestamp from YouTube URL if present
 * @param url - YouTube URL
 * @returns Timestamp in seconds or null if not present
 */
export function extractYouTubeTimestamp(url: string): number | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Look for t= or time= parameters
  const timePatterns = [
    /[?&]t=(\d+)/,      // t=123
    /[?&]time=(\d+)/,   // time=123
    /[?&]t=(\d+)m(\d+)s/, // t=2m30s
    /[?&]t=(\d+)h(\d+)m(\d+)s/, // t=1h2m30s
  ];

  for (const pattern of timePatterns) {
    const match = url.match(pattern);
    if (match) {
      if (match.length === 2) {
        // Simple seconds format
        return parseInt(match[1], 10);
      } else if (match.length === 3) {
        // Minutes and seconds format
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return minutes * 60 + seconds;
      } else if (match.length === 4) {
        // Hours, minutes, and seconds format
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        return hours * 3600 + minutes * 60 + seconds;
      }
    }
  }

  return null;
}