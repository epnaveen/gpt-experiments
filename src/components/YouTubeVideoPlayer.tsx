import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { YouTubeVideoProps } from '../types';

export const YouTubeVideoPlayer: React.FC<YouTubeVideoProps> = ({
  videoId,
  videoUrl,
  title,
  description,
  width = '100%',
  height = 400,
  options = {},
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  // Default options
  const defaultOptions = {
    showControls: true,
    autoplay: false,
    muted: false,
    ...options,
  };

  // Extract video ID from URL if not provided directly
  const finalVideoId = videoId || (videoUrl ? extractVideoIdFromUrl(videoUrl) : null);

  useEffect(() => {
    if (!finalVideoId) {
      setError('No valid video ID or URL provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create YouTube iframe
    const iframe = iframeRef.current;
    if (iframe) {
      const embedUrl = buildYouTubeEmbedUrl(finalVideoId, defaultOptions);
      iframe.src = embedUrl;
      
      iframe.onload = () => {
        setLoading(false);
        setPlayerReady(true);
      };

      iframe.onerror = () => {
        setError('Failed to load video');
        setLoading(false);
      };
    }
  }, [finalVideoId, defaultOptions]);

  if (!finalVideoId) {
    return (
      <Alert severity="warning">
        Please provide a valid YouTube video ID or URL.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width, height }}>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="textSecondary">
            Loading video...
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: loading ? 'none' : 'block',
        }}
      >
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          style={{
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          title={title || `YouTube video ${finalVideoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>

      {(title || description) && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          {title && (
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

// Helper function to extract video ID from various YouTube URL formats
function extractVideoIdFromUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Helper function to build YouTube embed URL with options
function buildYouTubeEmbedUrl(videoId: string, options: any): string {
  const baseUrl = 'https://www.youtube.com/embed/';
  const params = new URLSearchParams();

  if (options.autoplay) params.append('autoplay', '1');
  if (options.muted) params.append('mute', '1');
  if (!options.showControls) params.append('controls', '0');
  
  // Additional parameters for better experience
  params.append('rel', '0'); // Don't show related videos
  params.append('modestbranding', '1'); // Hide YouTube logo
  params.append('showinfo', '0'); // Hide video info

  const queryString = params.toString();
  return `${baseUrl}${videoId}${queryString ? `?${queryString}` : ''}`;
}