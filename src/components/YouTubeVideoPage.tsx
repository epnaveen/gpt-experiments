import React, { useState, useMemo } from 'react';
import {
  Page,
  Header,
  Content,
  HeaderLabel,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { YouTubeVideoPlayer } from './YouTubeVideoPlayer';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';

export const YouTubeVideoPage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  const handleVideoSubmit = () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const extractedId = extractYouTubeVideoId(videoUrl);
    if (extractedId) {
      setVideoId(extractedId);
      setError('');
    } else {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
    if (error) setError('');
  };

  const pageTitle = videoId ? 'YouTube Video Player' : 'YouTube Video URL Input';

  return (
    <Page themeId="tool">
      <Header title={pageTitle}>
        <HeaderLabel title="YouTube Video Plugin" />
        <HeaderLabel title="v0.1.0" />
      </Header>
      <Content>
        <ContentHeader title={pageTitle}>
          <SupportButton>
            This plugin allows you to watch YouTube videos directly within Red Hat Developer Hub.
            Enter a YouTube URL below to get started.
          </SupportButton>
        </ContentHeader>

        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
          {!videoId ? (
            <Card>
              <CardHeader title="Enter YouTube Video URL" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Paste a YouTube video URL below to watch the video on this page.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="YouTube Video URL"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={handleUrlChange}
                    error={!!error}
                    helperText={error || 'Enter a valid YouTube video URL'}
                    variant="outlined"
                    size="medium"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVideoSubmit}
                    disabled={!videoUrl.trim()}
                    sx={{ minWidth: 120, height: 56 }}
                  >
                    Watch Video
                  </Button>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                  Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Now Playing</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setVideoId('');
                    setVideoUrl('');
                  }}
                >
                  Choose Different Video
                </Button>
              </Box>
              
              <YouTubeVideoPlayer
                videoId={videoId}
                width="100%"
                height={600}
                options={{
                  showControls: true,
                  autoplay: false,
                  muted: false,
                }}
              />
            </Box>
          )}
        </Box>
      </Content>
    </Page>
  );
};