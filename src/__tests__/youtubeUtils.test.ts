import {
  extractYouTubeVideoId,
  isValidYouTubeVideoId,
  buildYouTubeEmbedUrl,
  getYouTubeUrls,
  extractYouTubeTimestamp,
} from '../utils/youtubeUtils';

describe('YouTube Utils', () => {
  describe('extractYouTubeVideoId', () => {
    it('should extract video ID from standard watch URLs', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123def45')).toBe('abc123def45');
    });

    it('should extract video ID from short URLs', () => {
      expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYouTubeVideoId('https://youtu.be/abc123def45')).toBe('abc123def45');
    });

    it('should extract video ID from embed URLs', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/abc123def45')).toBe('abc123def45');
    });

    it('should extract video ID from URLs with additional parameters', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?param=value&v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&index=1')).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from URLs with hash fragments', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ#t=30s')).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URLs', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/')).toBeNull();
      expect(extractYouTubeVideoId('https://example.com')).toBeNull();
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('not a url')).toBeNull();
    });

    it('should handle whitespace', () => {
      expect(extractYouTubeVideoId('  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ')).toBe('dQw4w9WgXcQ');
    });
  });

  describe('isValidYouTubeVideoId', () => {
    it('should validate correct video IDs', () => {
      expect(isValidYouTubeVideoId('dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeVideoId('abc123def45')).toBe(true);
      expect(isValidYouTubeVideoId('12345678901')).toBe(true);
      expect(isValidYouTubeVideoId('abc-def_123')).toBe(true);
    });

    it('should reject invalid video IDs', () => {
      expect(isValidYouTubeVideoId('')).toBe(false);
      expect(isValidYouTubeVideoId('short')).toBe(false);
      expect(isValidYouTubeVideoId('toolongvideoid123')).toBe(false);
      expect(isValidYouTubeVideoId('invalid@#$%')).toBe(false);
      expect(isValidYouTubeVideoId('123')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidYouTubeVideoId(null as any)).toBe(false);
      expect(isValidYouTubeVideoId(undefined as any)).toBe(false);
      expect(isValidYouTubeVideoId(123 as any)).toBe(false);
    });
  });

  describe('buildYouTubeEmbedUrl', () => {
    it('should build basic embed URL', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ');
      expect(url).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&showinfo=0&iv_load_policy=3');
    });

    it('should include autoplay parameter when enabled', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ', { autoplay: true });
      expect(url).toContain('autoplay=1');
    });

    it('should include mute parameter when enabled', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ', { muted: true });
      expect(url).toContain('mute=1');
    });

    it('should hide controls when disabled', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ', { showControls: false });
      expect(url).toContain('controls=0');
    });

    it('should include start time parameter', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ', { startTime: 30 });
      expect(url).toContain('start=30');
    });

    it('should include end time parameter', () => {
      const url = buildYouTubeEmbedUrl('dQw4w9WgXcQ', { endTime: 120 });
      expect(url).toContain('end=120');
    });

    it('should throw error for invalid video ID', () => {
      expect(() => buildYouTubeEmbedUrl('invalid')).toThrow('Invalid YouTube video ID');
    });
  });

  describe('getYouTubeUrls', () => {
    it('should return all URL formats', () => {
      const urls = getYouTubeUrls('dQw4w9WgXcQ');
      expect(urls.watch).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(urls.embed).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(urls.short).toBe('https://youtu.be/dQw4w9WgXcQ');
    });

    it('should throw error for invalid video ID', () => {
      expect(() => getYouTubeUrls('invalid')).toThrow('Invalid YouTube video ID');
    });
  });

  describe('extractYouTubeTimestamp', () => {
    it('should extract simple seconds format', () => {
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30')).toBe(30);
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120')).toBe(120);
    });

    it('should extract minutes and seconds format', () => {
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=2m30s')).toBe(150);
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5m45s')).toBe(345);
    });

    it('should extract hours, minutes, and seconds format', () => {
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1h2m30s')).toBe(3750);
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=2h15m45s')).toBe(8145);
    });

    it('should return null when no timestamp is present', () => {
      expect(extractYouTubeTimestamp('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBeNull();
      expect(extractYouTubeTimestamp('https://youtu.be/dQw4w9WgXcQ')).toBeNull();
    });

    it('should handle edge cases', () => {
      expect(extractYouTubeTimestamp('')).toBeNull();
      expect(extractYouTubeTimestamp('not a url')).toBeNull();
    });
  });
});