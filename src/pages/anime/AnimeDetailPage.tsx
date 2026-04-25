import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeDetailDTO, PlaySourceDTO, EpisodeDTO, DanmakuMessageDTO, TaskStatusDTO } from '../../types/anime';
import { VideoPlayer, VideoPlayerRef } from '../../components/VideoPlayer';
import { DanmakuPlayer } from '../../components/DanmakuPlayer';
import { DanmakuInput } from '../../components/DanmakuInput';
import { authStorage } from '../../utils/authStorage';
import { SakuraPetals } from '../../components/SakuraPetals';

function getEpisodeUrl(episode: EpisodeDTO): string {
  return episode.m3u8Url || episode.mp4Url || '';
}

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animeDetail, setAnimeDetail] = useState<AnimeDetailDTO | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<PlaySourceDTO | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => authStorage.isAuthenticated());
  const [resumeSeconds, setResumeSeconds] = useState(0);
  const lastSaveTimeRef = useRef<number>(0);
  const hasSavedProgressRef = useRef<boolean>(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const [taskStatuses, setTaskStatuses] = useState<TaskStatusDTO[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const allDone = totalTasks > 0 && completedTasks >= totalTasks;
  const successCount = taskStatuses.filter(t => t.status === 'success').length;
  const failedCount = taskStatuses.filter(t => t.status === 'failed').length;
  const loadingCount = taskStatuses.filter(t => t.status === 'loading').length;

  useEffect(() => { setIsLoggedIn(authStorage.isAuthenticated()); }, []);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      if (!id) return;
      try {
        setDetailLoading(true); setDetailError(null);
        const response = await animeApi.getAnimePlay(Number(id));
        if (response.success && response.data) setAnimeDetail(response.data);
        else setDetailError(response.message || '获取动漫信息失败');
      } catch { setDetailError('网络错误，请检查网络连接'); }
      finally { setDetailLoading(false); }
    };
    fetchAnimeDetail();
  }, [id]);

  useEffect(() => {
    const fetchPlaySources = async () => {
      if (!id || !animeDetail) return;
      try {
        setTotalTasks(0); setCompletedTasks(0); setTaskStatuses([]); setSelectedSource(null);
        const searchResp = await animeApi.autoPlaySearch(Number(id), animeDetail.nameCn || animeDetail.name);
        if (!searchResp.success || !searchResp.data || searchResp.data.length === 0) {
          return;
        }
        const tasks = searchResp.data;
        setTotalTasks(tasks.length);
        setTaskStatuses(tasks.map(t => ({ ...t, status: 'loading' as const })));

        const taskPromises = tasks.map(async (task, index) => {
          try {
            const result = await animeApi.autoPlayTask(task.taskId);
            if (result.success && result.data) {
              const src = result.data;
              setTaskStatuses(prev => prev.map((s, i) => i === index ? { ...s, status: 'success', source: src } : s));
              setSelectedSource(prev => {
                if (!prev) return src;
                return prev;
              });
              setSelectedEpisodeIndex(prev => prev || 0);
            } else {
              setTaskStatuses(prev => prev.map((s, i) => i === index ? { ...s, status: 'failed' } : s));
            }
          } catch {
            setTaskStatuses(prev => prev.map((s, i) => i === index ? { ...s, status: 'failed' } : s));
          }
          setCompletedTasks(prev => prev + 1);
        });

        await Promise.all(taskPromises);
      } catch { console.error('获取播放源失败'); }
    };
    fetchPlaySources();
  }, [id, animeDetail]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!id || !isLoggedIn) return;
      try { const response = await animeApi.checkFavorite(Number(id)); if (response.success && response.data !== undefined) setIsFavorite(response.data); }
      catch { console.error('检查收藏状态失败:'); }
    };
    checkFavoriteStatus();
  }, [id, isLoggedIn]);

  useEffect(() => {
    const loadWatchProgress = async () => {
      if (!id || !selectedSource || selectedEpisodeIndex < 0 || !isLoggedIn) return;
      try {
        const response = await animeApi.getWatchProgress(Number(id), selectedEpisodeIndex);
        if (response.success && response.data) setResumeSeconds(response.data.progressSeconds || 0);
      } catch { console.error('加载观看进度失败:'); }
    };
    loadWatchProgress();
  }, [id, selectedEpisodeIndex, selectedSource, isLoggedIn]);

  useEffect(() => {
    if (selectedSource && selectedSource.episodes.length > 0 && selectedEpisodeIndex >= selectedSource.episodes.length) {
      setSelectedEpisodeIndex(0);
    }
  }, [selectedSource]);

  const saveWatchProgress = useCallback(async (progressSeconds: number) => {
    if (!id || selectedEpisodeIndex < 0 || !isLoggedIn || !selectedSource) return;
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 30000 && hasSavedProgressRef.current) return;
    lastSaveTimeRef.current = now; hasSavedProgressRef.current = true;
    try {
      await animeApi.updateWatchHistory({ metadataId: Number(id), episodeIndex: selectedEpisodeIndex, sourceKey: selectedSource.sourceKey, progressSeconds: Math.floor(progressSeconds) });
    } catch { console.error('保存观看进度失败:'); }
  }, [id, selectedEpisodeIndex, selectedSource, isLoggedIn]);

  const handleFavoriteToggle = async () => {
    if (!id || !isLoggedIn) { navigate('/login'); return; }
    try {
      setFavoriteLoading(true);
      if (isFavorite) { const response = await animeApi.deleteFavorite(Number(id)); if (response.success) setIsFavorite(false); }
      else { const response = await animeApi.addFavorite({ metadataId: Number(id) }); if (response.success) setIsFavorite(true); }
    } catch { console.error('收藏操作失败:'); }
    finally { setFavoriteLoading(false); }
  };

  const handleProgressUpdate = (seconds: number) => { saveWatchProgress(seconds); };
  const handleSourceChange = (source: PlaySourceDTO) => { setSelectedSource(source); setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisodeIndex(0); };
  const handleEpisodeSelect = (index: number) => { setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisodeIndex(index); };

  const handlePrevEpisode = () => {
    if (!selectedSource || selectedEpisodeIndex <= 0) return;
    setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisodeIndex(selectedEpisodeIndex - 1);
  };

  const handleNextEpisode = () => {
    if (!selectedSource || selectedEpisodeIndex >= selectedSource.episodes.length - 1) return;
    setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisodeIndex(selectedEpisodeIndex + 1);
  };

  const handleDanmakuSendSuccess = useCallback((_danmaku: DanmakuMessageDTO) => {}, []);
  const handleVideoPause = useCallback((paused: boolean) => { setIsPaused(paused); }, []);
  const handleVideoSizeChange = useCallback((width: number, height: number) => { setVideoSize({ width, height }); }, []);
  const handleVideoTimeUpdate = useCallback((_time: number) => {}, []);

  if (detailLoading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /><p className="text-gray-400 text-sm">加载中...</p></div></div>);
  if (detailError || !animeDetail) return (<div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="card p-8 text-center max-w-md w-full"><div className="text-5xl mb-4">😔</div><h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2><p className="text-gray-400 text-sm mb-6">{detailError || '动漫不存在'}</p><button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl hover:bg-[#ff5070] transition-colors">返回上一页</button></div></div>);

  const selectedEpisode = selectedSource && selectedSource.episodes[selectedEpisodeIndex] ? selectedSource.episodes[selectedEpisodeIndex] : null;
  const currentEpisodeUrl = selectedEpisode ? getEpisodeUrl(selectedEpisode) : '';
  const hasPrev = selectedEpisodeIndex > 0;
  const hasNext = selectedSource ? selectedEpisodeIndex < selectedSource.episodes.length - 1 : false;

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover' }} />

      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl relative z-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#ff6b8a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate max-w-xs">{animeDetail.nameCn}</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-1 bg-[#ff6b8a]/10 text-[#ff6b8a] text-xs rounded-full"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>{animeDetail.score}</span>
            <button onClick={handleFavoriteToggle} disabled={favoriteLoading} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-[#ff6b8a] text-white' : 'bg-white/60 text-gray-400 hover:text-[#ff6b8a]'}`}><svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              {selectedSource ? (
                <>
                  <div ref={videoContainerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    <VideoPlayer ref={videoPlayerRef} src={currentEpisodeUrl} poster={animeDetail.imagesLarge} startTime={resumeSeconds} onProgressUpdate={handleProgressUpdate} onPauseChange={handleVideoPause} onSizeChange={handleVideoSizeChange} onTimeUpdate={handleVideoTimeUpdate} />
                    {videoSize.width > 0 && (<DanmakuPlayer videoRef={videoPlayerRef} width={videoSize.width} height={videoSize.height} isPaused={isPaused} videoId={Number(id)} episodeIndex={selectedEpisodeIndex} />)}
                  </div>
                  <div className="mt-3"><DanmakuInput videoId={Number(id)} episodeIndex={selectedEpisodeIndex} videoRef={videoPlayerRef} onSendSuccess={handleDanmakuSendSuccess} /></div>
                  {selectedSource.episodes.length > 1 && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button onClick={handlePrevEpisode} disabled={!hasPrev} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${hasPrev ? 'bg-white/60 text-gray-700 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]' : 'bg-white/30 text-gray-300 cursor-not-allowed'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg><span>上一集</span></button>
                      <div className="flex-1 text-center"><span className="text-gray-600 text-sm">{selectedEpisode?.episodeName || '选择集数'}</span><span className="text-gray-400 text-sm mx-2">{selectedEpisodeIndex + 1} / {selectedSource.episodes.length}</span></div>
                      <button onClick={handleNextEpisode} disabled={!hasNext} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${hasNext ? 'bg-white/60 text-gray-700 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]' : 'bg-white/30 text-gray-300 cursor-not-allowed'}`}><span>下一集</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                    <div className="w-14 h-14 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin mb-3" />
                    <p className="text-gray-500 text-sm">正在获取播放资源...</p>
                  </div>
                  <img src={animeDetail.imagesLarge} alt={animeDetail.nameCn} className="w-full h-full object-cover opacity-30" />
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div><h1 className="text-xl font-bold text-gray-800">{animeDetail.nameCn}</h1>{animeDetail.name !== animeDetail.nameCn && <p className="text-gray-400 text-sm">{animeDetail.name}</p>}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {animeDetail.tags.map((tag, index) => (<span key={index} className="px-3 py-1 bg-[#ff6b8a]/10 text-[#ff6b8a] text-xs rounded-full">{tag}</span>))}
              </div>
              {animeDetail.summary && (<div className="border-t border-[#ff6b8a]/10 pt-4"><h3 className="text-gray-500 text-xs font-semibold mb-2">简介</h3><p className="text-gray-600 text-sm leading-relaxed">{animeDetail.summary}</p></div>)}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#ff6b8a]/10">
                <div><span className="text-gray-400 text-xs">开播日期</span><p className="text-gray-700 text-sm mt-0.5">{animeDetail.airDate || '未知'}</p></div>
                <div><span className="text-gray-400 text-xs">平台</span><p className="text-gray-700 text-sm mt-0.5">{animeDetail.platform || '未知'}</p></div>
                <div><span className="text-gray-400 text-xs">制作公司</span><p className="text-gray-700 text-sm mt-0.5">{animeDetail.studio || '未知'}</p></div>
                <div><span className="text-gray-400 text-xs">总集数</span><p className="text-gray-700 text-sm mt-0.5">{animeDetail.episodes || '未知'}</p></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                播放源
                {totalTasks > 0 && !allDone && (<span className="text-[#ff6b8a] text-xs font-normal">({successCount}成功 {loadingCount}请求中 {failedCount}失败)</span>)}
                {allDone && (<span className="text-gray-400 text-xs font-normal">({successCount}个有效)</span>)}
              </h3>

              {/* Progress bar while loading */}
              {totalTasks > 0 && !allDone && (
                <div className="mb-3 p-2.5 bg-[#ff6b8a]/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b8a] animate-pulse" />
                    <span className="text-xs text-gray-500 font-medium">正在获取资源...</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff6b8a] to-[#ffb6c1] rounded-full transition-all duration-500" style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }} />
                  </div>
                </div>
              )}

              {/* Source list - always show, updated in real-time */}
              {taskStatuses.length > 0 ? (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {taskStatuses.map((task, index) => (
                    <div key={index} className={`p-2.5 rounded-xl transition-all border ${
                      selectedSource?.sourceKey === task.source?.sourceKey
                        ? 'bg-[#ff6b8a]/10 border-[#ff6b8a]/30'
                        : task.status === 'success' && task.source?.success && task.source.episodes.length > 0
                          ? 'bg-white/60 border-transparent hover:bg-white/80 cursor-pointer'
                          : 'bg-white/30 border-transparent'
                    }`}
                    onClick={() => {
                      if (task.source && task.source.success && task.source.episodes.length > 0) {
                        handleSourceChange(task.source);
                      }
                    }}>
                      <div className="flex items-center gap-2.5">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {task.iconUrl ? (
                            <img src={task.iconUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{task.sourceName.charAt(0)}</span>
                          )}
                        </div>
                        {/* Name & Status */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-700 truncate">{task.sourceName}</span>
                            {selectedSource?.sourceKey === task.source?.sourceKey && (
                              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#ff6b8a]" />
                            )}
                          </div>
                          {task.status === 'success' && task.source?.success && task.source.episodes.length > 0 && (
                            <span className="text-xs text-green-500">{task.source.episodes.length}集</span>
                          )}
                        </div>
                        {/* Status badge */}
                        <div className="flex-shrink-0">
                          {task.status === 'loading' ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                              <span className="text-[10px] text-yellow-500">请求中</span>
                            </div>
                          ) : task.status === 'success' && task.source?.success && task.source.episodes.length > 0 ? (
                            <div className="px-2 py-0.5 bg-green-50 rounded-full">
                              <span className="text-[10px] text-green-500">可用</span>
                            </div>
                          ) : task.status === 'success' ? (
                            <div className="px-2 py-0.5 bg-yellow-50 rounded-full">
                              <span className="text-[10px] text-yellow-500">无数据</span>
                            </div>
                          ) : (
                            <div className="px-2 py-0.5 bg-red-50 rounded-full">
                              <span className="text-[10px] text-red-400">失败</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Episode tags for selected or hovered */}
                      {task.status === 'success' && task.source?.success && task.source.episodes.length > 0 && selectedSource?.sourceKey === task.source.sourceKey && (
                        <div className="mt-2 pt-2 border-t border-[#ff6b8a]/10">
                          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                            {task.source.episodes.map((ep, epIdx) => (
                              <button key={epIdx} onClick={(e) => { e.stopPropagation(); handleEpisodeSelect(epIdx); }}
                                className={`px-2 py-1 text-[11px] rounded-lg transition-all ${selectedEpisodeIndex === epIdx ? 'bg-[#ff6b8a] text-white font-medium' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>
                                {ep.episodeName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full border-4 border-[#ff6b8a]/20 border-t-[#ff6b8a] animate-spin" />
                    <p className="text-xs text-gray-400">搜索数据源中...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
