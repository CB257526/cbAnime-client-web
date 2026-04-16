---
name: "danmaku-player"
description: "Guide for implementing real-time danmaku (bullet comments) player using Canvas. Invoke when building video players with danmaku support or debugging rendering/performance issues."
---

# 弹幕播放器开发指南

基于 Canvas 的高性能弹幕播放器实现，参考 Bilibili 弹幕系统。包含完整的技术方案、性能优化和常见陷阱。

## 核心架构

### 1. 技术选型

**使用 Canvas 2D 渲染（推荐）**
```typescript
// ✅ 正确：Canvas 渲染，60fps 流畅
const canvas = canvasRef.current;
const ctx = canvas?.getContext('2d');
animationRef.current = requestAnimationFrame(renderDanmaku);
```

**避免使用 DOM 渲染**
```typescript
// ❌ 错误：大量 DOM 节点导致卡顿
{danmakuList.map(d => <div key={d.id}>{d.text}</div>)}
```

**原因**：
- Canvas 单 DOM 节点，GPU 加速
- DOM 方案每个弹幕一个节点，重渲染开销大
- Canvas 支持批量渲染，性能优异

### 2. 组件结构

```typescript
interface DanmakuPlayerProps {
  videoRef: React.RefObject<VideoPlayerRef | null>;
  width: number;
  height: number;
  isPaused: boolean;
  videoId: number;
  episodeIndex: number;
}

// 关键 Refs
const danmakuListRef = useRef<DanmakuMessageDTO[]>([]);  // 弹幕列表
const activeDanmakuRef = useRef<Array<{...}>>([]);       // 活跃弹幕
const tracksRef = useRef<DanmakuTrack[]>([]);            // 轨道管理
const animationRef = useRef<number | null>(null);        // 动画帧
```

### 3. 播放器集成

**VideoPlayer 必须暴露 videoRef**
```typescript
export interface VideoPlayerRef {
  getCurrentTime: () => number;
  getVideoElement: () => HTMLVideoElement | null;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ ... }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useImperativeHandle(ref, () => ({
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      getVideoElement: () => videoRef.current,
    }));
    
    // ...
  }
);
```

## 核心实现

### 1. 弹幕加载（独立不阻塞）

```typescript
useEffect(() => {
  const loadDanmaku = async () => {
    try {
      const response = await animeApi.getDanmakuList(videoId, episodeIndex);
      if (response.success && response.data) {
        danmakuListRef.current = response.data.danmakuList || [];
      }
    } catch (err) {
      console.error('加载弹幕失败:', err);
    }
  };
  
  loadDanmaku();
}, [videoId, episodeIndex]);
```

**关键点**：
- ✅ 弹幕层自己加载数据
- ✅ 不通过父组件传递弹幕列表
- ✅ 避免父子组件状态同步导致的重渲染

### 2. 弹幕渲染循环

```typescript
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
  
  // 1. 检测新弹幕（每 0.3 秒）
  if (currentTime !== lastTimeRef.current && !isPaused) {
    lastTimeRef.current = currentTime;
    
    const newDanmaku = danmakuListRef.current.filter(d => {
      if (Math.abs(d.timePosition - currentTime) >= 0.3) return false;
      // 防止重复显示
      const key = `${d.id}-${d.timePosition}`;
      if (danmakuPoolRef.current.has(key as any)) return false;
      return true;
    });
    
    // 2. 分配轨道
    newDanmaku.forEach(d => {
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
      
      // 更新轨道占用时间
      tracksRef.current[trackIndex] = {
        y,
        endTime: currentTime + (width + textWidth + DANMAKU_PADDING) / speed,
      };
      
      // 添加到活跃列表
      activeDanmakuRef.current.push({
        danmaku: d,
        x,
        y,
        speed,
        width: textWidth,
      });
    });
  }
  
  // 3. 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 4. 更新位置
  activeDanmakuRef.current = activeDanmakuRef.current.filter(item => {
    if (isPaused) return true;
    item.x -= item.speed * 0.016; // 60fps 换算
    return item.x > -item.width - DANMAKU_PADDING;
  });
  
  // 5. 绘制弹幕
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
```

### 3. 轨道系统（防重叠）

```typescript
interface DanmakuTrack {
  y: number;
  endTime: number;  // 该轨道被占用到的时间
}

const NUM_TRACKS = 12;  // 12 条轨道
const DANMAKU_HEIGHT = 30;  // 每条弹幕高度

// 分配轨道算法
let trackIndex = -1;
for (let i = 0; i < NUM_TRACKS; i++) {
  const track = tracksRef.current[i];
  if (!track || track.endTime < currentTime) {
    trackIndex = i;  // 找到空闲轨道
    break;
  }
}

if (trackIndex === -1) {
  trackIndex = Math.floor(Math.random() * NUM_TRACKS);  // 全部占用则随机
}
```

### 4. 弹幕池管理（防重复）

```typescript
const danmakuPoolRef = useRef<Map<number, DanmakuMessageDTO>>(new Map());

// 检测是否已显示
const key = `${d.id}-${d.timePosition}`;
if (danmakuPoolRef.current.has(key as any)) return false;

// 标记为已显示
danmakuPoolRef.current.set(`${d.id}-${d.timePosition}` as any, d);
```

## 性能优化

### 1. 避免无限循环

**❌ 错误：依赖变化导致循环**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // 检查弹幕
  }, 500);
  return () => clearInterval(interval);
}, [videoRef, videoHeight]);  // videoRef 每次渲染都变！
```

**✅ 正确：使用 Ref 存储变化值**
```typescript
const videoHeightRef = useRef(videoHeight);

useEffect(() => {
  videoHeightRef.current = videoHeight;
}, [videoHeight]);

useEffect(() => {
  const interval = setInterval(() => {
    const vh = videoHeightRef.current;  // 使用 ref
    // 检查弹幕
  }, 500);
  return () => clearInterval(interval);
}, [videoRef]);  // 只依赖 videoRef
```

### 2. 避免阻塞视频

**❌ 错误：弹幕加载阻塞视频**
```typescript
// 父组件加载弹幕
const { danmakuList, loadDanmaku } = useDanmakuList();

useEffect(() => {
  loadDanmaku(videoId, episodeIndex);  // 弹幕没加载完视频不播放
}, [videoId]);
```

**✅ 正确：弹幕独立加载**
```typescript
// 弹幕层自己加载
useEffect(() => {
  const loadDanmaku = async () => {
    // 不影响视频
  };
  loadDanmaku();
}, [videoId, episodeIndex]);
```

### 3. 避免点击穿透问题

**❌ 错误：阻挡视频控制**
```typescript
<canvas style={{ pointerEvents: 'auto' }} />  // 拦截所有点击
```

**✅ 正确：允许点击穿透**
```typescript
<div style={{ pointerEvents: 'none' }}>
  <canvas style={{ pointerEvents: 'none' }} />
</div>
```

### 4. React 状态优化

**❌ 错误：频繁 setState**
```typescript
// 每帧更新状态
useEffect(() => {
  const animate = () => {
    setDanmakuList(prev => [...prev]);  // 触发重渲染
    animationRef.current = requestAnimationFrame(animate);
  };
}, []);
```

**✅ 正确：使用 Ref**
```typescript
// 数据存在 Ref，不触发重渲染
const activeDanmakuRef = useRef<Array<{...}>>([]);

const renderDanmaku = () => {
  // 直接修改 Ref
  activeDanmakuRef.current = filtered;
  // Canvas 绘制，不依赖 React 状态
};
```

## 常见陷阱

### 1. 弹幕不显示

**原因**：
- 弹幕层依赖 `currentTime` props，但父组件没传递
- 弹幕池重复检测逻辑错误
- 轨道全满时没有降级处理

**解决**：
```typescript
// 弹幕层自己获取视频时间
const video = player ? player.getVideoElement() : null;
const currentTime = video.currentTime;

// 降级处理
if (trackIndex === -1) {
  trackIndex = Math.floor(Math.random() * NUM_TRACKS);
}
```

### 2. 视频卡顿

**原因**：
- 弹幕加载阻塞主线程
- 频繁 setState 触发重渲染
- useEffect 依赖导致 interval 不断重建

**解决**：
```typescript
// 1. 独立加载
useEffect(() => {
  loadDanmaku();  // 异步不阻塞
}, []);

// 2. 使用 Ref，不 setState
const danmakuListRef = useRef([]);

// 3. 稳定依赖
const intervalRef = useRef<number | null>(null);

useEffect(() => {
  if (intervalRef.current) clearInterval(intervalRef.current);
  intervalRef.current = setInterval(checkDanmaku, 500);
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [videoRef]);  // 只依赖 videoRef
```

### 3. 弹幕重叠

**原因**：轨道管理失效

**解决**：
```typescript
// 严格轨道占用检测
tracksRef.current[trackIndex] = {
  y,
  endTime: currentTime + (width + textWidth + DANMAKU_PADDING) / speed,
};

// 弹幕出屏后释放轨道
activeDanmakuRef.current = activeDanmakuRef.current.filter(item => {
  if (item.x > -item.width - DANMAKU_PADDING) return true;
  // 弹幕出屏，释放轨道（可选）
  return false;
});
```

### 4. 右键菜单无法显示

**原因**：canvas 的 `pointerEvents: 'none'` 导致无法捕获右键事件

**解决**：保留右键支持但允许其他点击穿透
```typescript
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  // 检测点击区域
  const clickedDanmaku = activeDanmakuRef.current.find(item => {
    return mouseX >= item.x && mouseX <= item.x + item.width;
  });
  
  if (clickedDanmaku) {
    // 显示自定义菜单
    setShowContextMenu(true);
  }
};

canvas.addEventListener('contextmenu', handleContextMenu);
```

## 配置参数

```typescript
const NUM_TRACKS = 12;           // 轨道数量
const DANMAKU_HEIGHT = 30;       // 每条弹幕高度（px）
const DANMAKU_PADDING = 50;      // 弹幕间距（px）
const DANMAKU_SPEED = 200;       // 弹幕速度（px/s）
const CHECK_INTERVAL = 500;      // 检查间隔（ms）
const TIME_THRESHOLD = 0.3;      // 时间阈值（s）
```

## 完整示例

### 组件使用

```typescript
// AnimeDetailPage.tsx
const videoPlayerRef = useRef<VideoPlayerRef>(null);
const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
const [isPaused, setIsPaused] = useState(false);

return (
  <div className="relative">
    <VideoPlayer
      ref={videoPlayerRef}
      src={videoSrc}
      onSizeChange={(w, h) => setVideoSize({ width: w, height: h })}
      onPauseChange={(paused) => setIsPaused(paused)}
    />
    {videoSize.width > 0 && (
      <DanmakuPlayer
        videoRef={videoPlayerRef}
        width={videoSize.width}
        height={videoSize.height}
        isPaused={isPaused}
        videoId={videoId}
        episodeIndex={episodeIndex}
      />
    )}
    <DanmakuInput
      videoId={videoId}
      episodeIndex={episodeIndex}
      videoRef={videoPlayerRef}
    />
  </div>
);
```

## 总结

### 关键要点

1. **Canvas 渲染** - 性能最优，60fps 流畅
2. **独立加载** - 弹幕层自己加载数据，不阻塞视频
3. **轨道系统** - 防止弹幕重叠
4. **Ref 管理** - 避免频繁 setState
5. **pointerEvents** - 允许点击穿透
6. **弹幕池** - 防止重复显示

### 性能对比

| 方案 | FPS | DOM 节点 | 内存占用 |
|------|-----|---------|---------|
| Canvas（推荐） | 60 | 1 | 低 |
| DOM 方案 | 15-30 | N（弹幕数） | 高 |

### 适用场景

- ✅ 实时弹幕（直播、视频播放）
- ✅ 大量弹幕（>100 条/分钟）
- ✅ 需要流畅动画
- ❌ 静态评论（使用普通列表）

## 参考资料

- [Bilibili 弹幕技术分享](https://www.bilibili.com)
- [HTML5 Canvas 性能优化](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)
