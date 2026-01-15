import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  PlayArrow,
  ExpandMore,
  ExpandLess,
  OpenInNew,
} from '@mui/icons-material';
import { YouTubeVideoPlayer } from './YouTubeVideoPlayer';
import { YouTubeVideoCardProps } from '../types';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  videoId,
  videoUrl,
  title,
  description,
  entity,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Extract video ID from URL if not provided directly
  const finalVideoId = videoId || (videoUrl ? extractYouTubeVideoId(videoUrl) : null);

  // Get title and description from entity if available
  const displayTitle = title || entity?.metadata?.name || 'YouTube Video';
  const displayDescription = description || entity?.metadata?.description || 'No description available';

  const handlePlayVideo = () => {
    setShowPlayer(true);
    setExpanded(true);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setShowPlayer(false);
    }
  };

  const handleOpenYouTube = () => {
    if (finalVideoId) {
      window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
    } else if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  if (!finalVideoId && !videoUrl) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            No valid YouTube video ID or URL provided
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        title={displayTitle}
        subheader="YouTube Video"
        action={
          <IconButton onClick={handleToggleExpand}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />
      
      <CardContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {displayDescription}
        </Typography>
        
        {finalVideoId && (
          <Chip
            label={`Video ID: ${finalVideoId}`}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<PlayArrow />}
          onClick={handlePlayVideo}
          disabled={!finalVideoId}
        >
          Play Video
        </Button>
        
        <Button
          size="small"
          startIcon={<OpenInNew />}
          onClick={handleOpenYouTube}
        >
          Open on YouTube
        </Button>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {showPlayer && finalVideoId ? (
            <YouTubeVideoPlayer
              videoId={finalVideoId}
              width="100%"
              height={250}
              options={{
                showControls: true,
                autoplay: false,
                muted: true,
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 250,
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Click "Play Video" to watch
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};