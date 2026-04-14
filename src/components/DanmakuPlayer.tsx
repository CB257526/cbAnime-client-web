import { useEffect, useRef, useCallback } from 'react';
import { DanmakuMessageDTO } from '../types/anime';
import { VideoPlayerRef } from './VideoPlayer';
import { animeApi } from '../api/anime';
import { authStorage } from '../utils/authStorage';

interface DanmakuPlayerProps {
  videoRef: React.RefObject<VideoPlayerRef | null>;
  width: number;
  height: number;
  isPaused: boolean;
  videoId: number;
  episodeIndex: number;
}

interface DanmakuTrack {
  y: number;
  endTime: number;
}

export function DanmakuPlayer({
  videoRef,
  width,
  height,
  isPaused,
  videoId,
  episodeIndex,
}: DanmakuPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const danmakuListRef = useRef<DanmakuMessageDTO[]>([]);
  const activeDanmakuRef = useRef<Array<{
    danmaku: DanmakuMessageDTO;
    x: number;
    y: number;
    speed: number;
    width: number;
  }>>([]);
  const tracksRef = useRef<DanmakuTrack[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const blockedUsersRef = useRef<Set<number>>(new Set());
  const contextMenuRef = useRef<{ x: number; y: number; danmaku: DanmakuMessageDTO } | null>(null);
  const danmakuPoolRef = useRef<Map<number, DanmakuMessageDTO>>(new Map());

  const NUM_TRACKS = 12;
  const DANMAKU_SPEED = 200;
  const DANMAKU_HEIGHT = 30;
  const DANMAKU_PADDING = 50;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
  }, [width, height]);

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      animeApi.getBlockedList().then((res) => {
        if (res.success && res.data) {
          blockedUsersRef.current = new Set(res.data);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const loadDanmaku = async () => {
      try {
        const response = await animeApi.getDanmakuList(videoId, episodeIndex);
        if (response.success && response.data) {
          const list = response.data.danmakuList || [];
          danmakuListRef.current = list;
          list.forEach(d => danmakuPoolRef.current.set(d.id, d));
        }
      } catch (err) {
        console.error('加载弹幕失败:', err);
      }
    };

    loadDanmaku();
  }, [videoId, episodeIndex]);

  const renderDanmaku = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const player = videoRef.current;
    const video = player ? player.getVideoElement() : null;
    
    if (!canvas || !ctx || !video) {
      animationRef.current = requestAnimationFrame(renderDanmaku);
      return;
    }

    const currentTime = video.currentTime;
    
    if (currentTime !== lastTimeRef.current && !isPaused) {
      lastTimeRef.current = currentTime;

      const newDanmaku = danmakuListRef.current.filter(d => {
        if (blockedUsersRef.current.has(d.userId)) return false;
        if (Math.abs(d.timePosition - currentTime) >= 0.3) return false;
        
        const key = `${d.id}-${d.timePosition}`;
        if (danmakuPoolRef.current.has(key as any)) return false;
        
        return true;
      });

      newDanmaku.forEach(d => {
        const text = d.content;
        const fontSize = 22;
        ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
        const textWidth = ctx.measureText(text).width;
        
        let trackIndex = -1;
        for (let i = 0; i < NUM_TRACKS; i++) {
          const track = tracksRef.current[i];
          if (!track || track.endTime < currentTime) {
            trackIndex = i;
            break;
          }
        }

        if (trackIndex === -1) trackIndex = Math.floor(Math.random() * NUM_TRACKS);
        
        const y = trackIndex * DANMAKU_HEIGHT + 10;
        const x = width;
        const speed = DANMAKU_SPEED * (0.8 + Math.random() * 0.4);

        tracksRef.current[trackIndex] = {
          y,
          endTime: currentTime + (width + textWidth + DANMAKU_PADDING) / speed,
        };

        activeDanmakuRef.current.push({
          danmaku: d,
          x,
          y,
          speed,
          width: textWidth,
        });

        danmakuPoolRef.current.set(`${d.id}-${d.timePosition}` as any, d);
      });
    }

    ctx.clearRect(0, 0, width, height);

    activeDanmakuRef.current = activeDanmakuRef.current.filter(item => {
      if (isPaused) return true;
      item.x -= item.speed * 0.016;
      return item.x > -item.width - DANMAKU_PADDING;
    });

    activeDanmakuRef.current.forEach(item => {
      const { danmaku, x, y } = item;
      
      ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = danmaku.color || '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(danmaku.content, x, y + 18);
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    animationRef.current = requestAnimationFrame(renderDanmaku);
  }, [width, height, isPaused, videoRef]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(renderDanmaku);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [renderDanmaku]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedDanmaku = activeDanmakuRef.current.find(item => {
        return mouseX >= item.x && mouseX <= item.x + item.width &&
               mouseY >= item.y && mouseY <= item.y + DANMAKU_HEIGHT;
      });

      if (clickedDanmaku) {
        contextMenuRef.current = {
          x: e.clientX,
          y: e.clientY,
          danmaku: clickedDanmaku.danmaku,
        };
        canvas.dispatchEvent(new CustomEvent('showContextMenu', { 
          detail: contextMenuRef.current 
        }));
      }
    };

    canvas.addEventListener('contextmenu', handleContextMenu);
    return () => canvas.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
