import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

export interface VideoPlayerRef {
  getCurrentTime: () => number;
  getVideoElement: () => HTMLVideoElement | null;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  startTime?: number;
  onProgressUpdate?: (seconds: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onSizeChange?: (width: number, height: number) => void;
  onTimeUpdate?: (time: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, poster, startTime = 0, onProgressUpdate, onPauseChange, onSizeChange, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const progressIntervalRef = useRef<number | null>(null);
    const loadingTimeoutRef = useRef<number | null>(null);

    const onSizeChangeRef = useRef(onSizeChange);
    const onPauseChangeRef = useRef(onPauseChange);
    const onProgressUpdateRef = useRef(onProgressUpdate);
    const onTimeUpdateRef = useRef(onTimeUpdate);

    useEffect(() => {
      onSizeChangeRef.current = onSizeChange;
    }, [onSizeChange]);

    useEffect(() => {
      onPauseChangeRef.current = onPauseChange;
    }, [onPauseChange]);

    useEffect(() => {
      onProgressUpdateRef.current = onProgressUpdate;
    }, [onProgressUpdate]);

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      getVideoElement: () => videoRef.current,
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !src) return;

      const updateSize = () => {
        if (video && onSizeChangeRef.current) {
          onSizeChangeRef.current(video.offsetWidth, video.offsetHeight);
        }
      };

      const handleTimeUpdate = () => {
        if (video && onTimeUpdateRef.current) {
          onTimeUpdateRef.current(video.currentTime);
        }
      };

      const handlePause = () => {
        if (onPauseChangeRef.current) onPauseChangeRef.current(true);
      };

      const handlePlay = () => {
        if (onPauseChangeRef.current) onPauseChangeRef.current(false);
      };

      const cleanup = () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        if (loadingTimeoutRef.current) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('play', handlePlay);
        window.removeEventListener('resize', updateSize);
      };

      window.addEventListener('resize', updateSize);
      updateSize();

      setIsLoading(true);
      setError(null);

      cleanup();

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('pause', handlePause);
      video.addEventListener('play', handlePlay);

      if (startTime > 0 && video) {
        video.currentTime = startTime;
      }

      if (src.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });

          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            if (startTime > 0) {
              video.currentTime = startTime;
            }
            video.play().catch(() => {});
            updateSize();
          });

          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError('网络错误，请检查网络连接');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError('媒体错误，正在恢复...');
                  hls.recoverMediaError();
                  break;
                default:
                  setError('播放错误，请尝试刷新页面');
                  cleanup();
                  break;
              }
            }
          });

          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            if (startTime > 0) {
              video.currentTime = startTime;
            }
            video.play().catch(() => {});
            updateSize();
          });
        } else {
          setError('您的浏览器不支持 HLS 播放');
        }
      } else {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          if (startTime > 0) {
            video.currentTime = startTime;
          }
          video.play().catch(() => {});
          updateSize();
        });
      }

      video.addEventListener('waiting', () => {
        if (loadingTimeoutRef.current) return;
        loadingTimeoutRef.current = window.setTimeout(() => {
          setIsLoading(true);
          loadingTimeoutRef.current = null;
        }, 300);
      });
      video.addEventListener('playing', () => {
        if (loadingTimeoutRef.current) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsLoading(false);
      });
      video.addEventListener('error', () => setError('视频加载失败'));

      if (onProgressUpdateRef.current) {
        progressIntervalRef.current = window.setInterval(() => {
          if (video && !video.paused && !video.ended) {
            onProgressUpdateRef.current!(video.currentTime);
          }
        }, 10000);
      }

      return cleanup;
    }, [src, startTime]);

    return (
      <div className="relative w-full bg-black rounded-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#ff6b9d]/30 border-t-[#ff6b9d] rounded-full animate-spin" />
              <span className="text-white/70 text-sm">加载中...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          controls
          className="w-full aspect-video"
          poster={poster}
          playsInline
          crossOrigin="anonymous"
          preload="metadata"
        />
      </div>
    );
  }
);
