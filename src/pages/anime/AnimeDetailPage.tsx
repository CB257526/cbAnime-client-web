import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeDetailDTO, PlaySourceDTO, EpisodeDTO, DanmakuMessageDTO } from '../../types/anime';
import { VideoPlayer, VideoPlayerRef } from '../../components/VideoPlayer';
import { DanmakuPlayer } from '../../components/DanmakuPlayer';
import { DanmakuInput } from '../../components/DanmakuInput';
import { authStorage } from '../../utils/authStorage';
import { SakuraPetals } from '../../components/SakuraPetals';

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animeDetail, setAnimeDetail] = useState<AnimeDetailDTO | null>(null);
  const [playSources, setPlaySources] = useState<PlaySourceDTO[]>([]);
  const [detailLoading, setDetailLoading] = useState(true);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<PlaySourceDTO | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeDTO | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
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
      if (!id) return;
      try {
        setSourcesLoading(true); setSourcesError(null);
        const response = await animeApi.getAnimeSources(Number(id));
        if (response.success && response.data) {
          setPlaySources(response.data);
          const validSources = response.data.filter(s => s.success && s.episodes.length > 0);
          if (validSources.length > 0) { setSelectedSource(validSources[0]); if (validSources[0].episodes.length > 0) setSelectedEpisode(validSources[0].episodes[0]); }
        } else setSourcesError(response.message || '获取播放源失败');
      } catch { setSourcesError('网络错误，请检查网络连接'); }
      finally { setSourcesLoading(false); }
    };
    fetchPlaySources();
  }, [id]);

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
      if (!id || !selectedEpisode || !isLoggedIn) return;
      try {
        const episodeIndex = selectedSource?.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode.m3u8Url) ?? 0;
        const response = await animeApi.getWatchProgress(Number(id), episodeIndex);
        if (response.success && response.data) setResumeSeconds(response.data.progressSeconds || 0);
      } catch { console.error('加载观看进度失败:'); }
    };
    loadWatchProgress();
  }, [id, selectedEpisode, selectedSource, isLoggedIn]);

  useEffect(() => {
    if (selectedSource && selectedSource.episodes.length > 0) {
      const currentIndex = selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode?.m3u8Url);
      if (currentIndex === -1) setSelectedEpisode(selectedSource.episodes[0]);
    }
  }, [selectedSource]);

  const saveWatchProgress = useCallback(async (progressSeconds: number) => {
    if (!id || !selectedEpisode || !isLoggedIn || !selectedSource) return;
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 30000 && hasSavedProgressRef.current) return;
    lastSaveTimeRef.current = now; hasSavedProgressRef.current = true;
    try {
      const episodeIndex = selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode.m3u8Url);
      await animeApi.updateWatchHistory({ metadataId: Number(id), episodeIndex, sourceKey: selectedSource.sourceKey, progressSeconds: Math.floor(progressSeconds) });
    } catch { console.error('保存观看进度失败:'); }
  }, [id, selectedEpisode, selectedSource, isLoggedIn]);

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
  const handleSourceChange = (source: PlaySourceDTO) => { setSelectedSource(source); setShowSourceDropdown(false); setResumeSeconds(0); hasSavedProgressRef.current = false; if (source.episodes.length > 0) setSelectedEpisode(source.episodes[0]); };
  const handleEpisodeSelect = (episode: EpisodeDTO) => { setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisode(episode); };

  const handlePrevEpisode = () => {
    if (!selectedSource || !selectedEpisode) return;
    const currentIndex = selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode.m3u8Url);
    if (currentIndex > 0) { setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisode(selectedSource.episodes[currentIndex - 1]); }
  };

  const handleNextEpisode = () => {
    if (!selectedSource || !selectedEpisode) return;
    const currentIndex = selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode.m3u8Url);
    if (currentIndex < selectedSource.episodes.length - 1) { setResumeSeconds(0); hasSavedProgressRef.current = false; setSelectedEpisode(selectedSource.episodes[currentIndex + 1]); }
  };

  const handleDanmakuSendSuccess = useCallback((_danmaku: DanmakuMessageDTO) => {}, []);
  const handleVideoPause = useCallback((paused: boolean) => { setIsPaused(paused); }, []);
  const handleVideoSizeChange = useCallback((width: number, height: number) => { setVideoSize({ width, height }); }, []);
  const handleVideoTimeUpdate = useCallback((_time: number) => {}, []);

  if (detailLoading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /><p className="text-gray-400 text-sm">加载中...</p></div></div>);
  if (detailError || !animeDetail) return (<div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="card p-8 text-center max-w-md w-full"><div className="text-5xl mb-4">😔</div><h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2><p className="text-gray-400 text-sm mb-6">{detailError || '动漫不存在'}</p><button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl hover:bg-[#ff5070] transition-colors">返回上一页</button></div></div>);

  const validSources = playSources.filter(s => s.success && s.episodes.length > 0);
  const currentEpisodeIndex = selectedSource ? selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode?.m3u8Url) : -1;
  const hasPrev = currentEpisodeIndex > 0;
  const hasNext = selectedSource ? currentEpisodeIndex < selectedSource.episodes.length - 1 : false;

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
              {sourcesLoading ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10"><div className="w-12 h-12 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin mb-3" /><span className="text-white text-sm">正在获取播放链接...</span><span className="text-white/60 text-xs mt-1">预计需要1分钟左右</span></div>
                  <img src={animeDetail.imagesLarge} alt={animeDetail.nameCn} className="w-full h-full object-cover opacity-30" />
                </div>
              ) : sourcesError || validSources.length === 0 ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10"><div className="text-4xl mb-3">😔</div><p className="text-white text-sm">{sourcesError || '暂无播放源'}</p></div>
                  <img src={animeDetail.imagesLarge} alt={animeDetail.nameCn} className="w-full h-full object-cover opacity-30" />
                </div>
              ) : (
                <>
                  <div ref={videoContainerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    <VideoPlayer ref={videoPlayerRef} src={selectedEpisode?.m3u8Url || ''} poster={animeDetail.imagesLarge} startTime={resumeSeconds} onProgressUpdate={handleProgressUpdate} onPauseChange={handleVideoPause} onSizeChange={handleVideoSizeChange} onTimeUpdate={handleVideoTimeUpdate} />
                    {videoSize.width > 0 && (<DanmakuPlayer videoRef={videoPlayerRef} width={videoSize.width} height={videoSize.height} isPaused={isPaused} videoId={Number(id)} episodeIndex={selectedSource?.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode?.m3u8Url) ?? 0} />)}
                  </div>
                  <div className="mt-3"><DanmakuInput videoId={Number(id)} episodeIndex={selectedSource?.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode?.m3u8Url) ?? 0} videoRef={videoPlayerRef} onSendSuccess={handleDanmakuSendSuccess} /></div>
                  {selectedSource && selectedSource.episodes.length > 1 && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button onClick={handlePrevEpisode} disabled={!hasPrev} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${hasPrev ? 'bg-white/60 text-gray-700 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]' : 'bg-white/30 text-gray-300 cursor-not-allowed'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg><span>上一集</span></button>
                      <div className="flex-1 text-center"><span className="text-gray-600 text-sm">{selectedEpisode?.episodeName || '选择集数'}</span><span className="text-gray-400 text-sm mx-2">{currentEpisodeIndex + 1} / {selectedSource.episodes.length}</span></div>
                      <button onClick={handleNextEpisode} disabled={!hasNext} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${hasNext ? 'bg-white/60 text-gray-700 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]' : 'bg-white/30 text-gray-300 cursor-not-allowed'}`}><span>下一集</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                  )}
                </>
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
                {sourcesLoading ? (<span className="text-gray-400 text-xs font-normal">(加载中...)</span>) : (<span className="text-gray-400 text-xs font-normal">({validSources.length}个有效)</span>)}
              </h3>
              {sourcesLoading ? (
                <div className="flex items-center justify-center py-6"><div className="w-8 h-8 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /></div>
              ) : (
                <>
                  <div className="relative mb-3">
                    <button onClick={() => setShowSourceDropdown(!showSourceDropdown)} disabled={validSources.length === 0} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${validSources.length === 0 ? 'bg-white/30 text-gray-300 cursor-not-allowed' : 'bg-white/60 hover:bg-[#ff6b8a]/10 text-gray-700'}`}>
                      <span>{selectedSource?.sourceName || '选择播放源'}</span>
                      {validSources.length > 0 && (<svg className={`w-4 h-4 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>)}
                    </button>
                    {showSourceDropdown && validSources.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#ff6b8a]/20 overflow-hidden z-10 shadow-lg">
                        {validSources.map((source) => (<button key={source.sourceKey} onClick={() => handleSourceChange(source)} className={`w-full px-3 py-2.5 text-left text-sm transition-all ${selectedSource?.sourceKey === source.sourceKey ? 'bg-[#ff6b8a]/10 text-[#ff6b8a] font-semibold' : 'text-gray-600 hover:bg-[#ff6b8a]/5'}`}>{source.sourceName}</button>))}
                      </div>
                    )}
                  </div>
                  {selectedSource && selectedSource.episodes.length > 0 && (
                    <div>
                      <h4 className="text-gray-400 text-xs font-semibold mb-2">选集</h4>
                      <div className="grid grid-cols-4 gap-1.5 max-h-[500px] overflow-y-auto pr-1">
                        {selectedSource.episodes.map((episode, index) => (<button key={index} onClick={() => handleEpisodeSelect(episode)} className={`px-2 py-2 text-xs rounded-lg transition-all truncate ${selectedEpisode?.m3u8Url === episode.m3u8Url ? 'bg-[#ff6b8a] text-white font-medium' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>{episode.episodeName}</button>))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
