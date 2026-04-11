import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeDetailDTO, PlaySourceDTO, EpisodeDTO } from '../../types/anime';
import { VideoPlayer } from '../../components/VideoPlayer';

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

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      if (!id) return;
      try {
        setDetailLoading(true);
        setDetailError(null);
        const response = await animeApi.getAnimePlay(Number(id));
        if (response.success && response.data) {
          setAnimeDetail(response.data);
        } else {
          setDetailError(response.message || '获取动漫信息失败');
        }
      } catch (err) {
        setDetailError('网络错误，请检查网络连接');
      } finally {
        setDetailLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  useEffect(() => {
    const fetchPlaySources = async () => {
      if (!id) return;
      try {
        setSourcesLoading(true);
        setSourcesError(null);
        const response = await animeApi.getAnimeSources(Number(id));
        if (response.success && response.data) {
          setPlaySources(response.data);
          const validSources = response.data.filter(s => s.success && s.episodes.length > 0);
          if (validSources.length > 0) {
            setSelectedSource(validSources[0]);
            if (validSources[0].episodes.length > 0) {
              setSelectedEpisode(validSources[0].episodes[0]);
            }
          }
        } else {
          setSourcesError(response.message || '获取播放源失败');
        }
      } catch (err) {
        setSourcesError('网络错误，请检查网络连接');
      } finally {
        setSourcesLoading(false);
      }
    };

    fetchPlaySources();
  }, [id]);

  useEffect(() => {
    if (selectedSource && selectedSource.episodes.length > 0) {
      const currentIndex = selectedSource.episodes.findIndex(
        ep => ep.m3u8Url === selectedEpisode?.m3u8Url
      );
      if (currentIndex === -1) {
        setSelectedEpisode(selectedSource.episodes[0]);
      }
    }
  }, [selectedSource]);

  const handleSourceChange = (source: PlaySourceDTO) => {
    setSelectedSource(source);
    setShowSourceDropdown(false);
    if (source.episodes.length > 0) {
      setSelectedEpisode(source.episodes[0]);
    }
  };

  const handleEpisodeSelect = (episode: EpisodeDTO) => {
    setSelectedEpisode(episode);
  };

  const handlePrevEpisode = () => {
    if (!selectedSource || !selectedEpisode) return;
    const currentIndex = selectedSource.episodes.findIndex(
      ep => ep.m3u8Url === selectedEpisode.m3u8Url
    );
    if (currentIndex > 0) {
      setSelectedEpisode(selectedSource.episodes[currentIndex - 1]);
    }
  };

  const handleNextEpisode = () => {
    if (!selectedSource || !selectedEpisode) return;
    const currentIndex = selectedSource.episodes.findIndex(
      ep => ep.m3u8Url === selectedEpisode.m3u8Url
    );
    if (currentIndex < selectedSource.episodes.length - 1) {
      setSelectedEpisode(selectedSource.episodes[currentIndex + 1]);
    }
  };

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#ff6b9d]/30 border-t-[#ff6b9d] rounded-full animate-spin" />
          <span className="text-white/60 text-sm">加载中...</span>
        </div>
      </div>
    );
  }

  if (detailError || !animeDetail) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-medium mb-1">{detailError || '动漫不存在'}</p>
            <button
              onClick={() => navigate(-1)}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validSources = playSources.filter(s => s.success && s.episodes.length > 0);
  const currentEpisodeIndex = selectedSource
    ? selectedSource.episodes.findIndex(ep => ep.m3u8Url === selectedEpisode?.m3u8Url)
    : -1;
  const hasPrev = currentEpisodeIndex > 0;
  const hasNext = selectedSource ? currentEpisodeIndex < selectedSource.episodes.length - 1 : false;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">返回</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              {sourcesLoading ? (
                <div className="relative w-full aspect-video bg-[#12121a] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    <div className="w-14 h-14 border-4 border-[#ff6b9d]/30 border-t-[#ff6b9d] rounded-full animate-spin mb-4" />
                    <span className="text-white/70 text-sm">正在获取播放链接...</span>
                    <span className="text-white/40 text-xs mt-1">预计需要1分钟左右</span>
                  </div>
                  <img
                    src={animeDetail.imagesLarge}
                    alt={animeDetail.nameCn}
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>
              ) : sourcesError || validSources.length === 0 ? (
                <div className="relative w-full aspect-video bg-[#12121a] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm">{sourcesError || '暂无播放源'}</p>
                  </div>
                  <img
                    src={animeDetail.imagesLarge}
                    alt={animeDetail.nameCn}
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>
              ) : (
                <>
                  <VideoPlayer
                    src={selectedEpisode?.m3u8Url || ''}
                    poster={animeDetail.imagesLarge}
                  />

                  {selectedSource && selectedSource.episodes.length > 1 && (
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <button
                        onClick={handlePrevEpisode}
                        disabled={!hasPrev}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          hasPrev
                            ? 'bg-[#1a1a2e] hover:bg-[#252540] text-white'
                            : 'bg-[#1a1a2e]/50 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm">上一集</span>
                      </button>

                      <div className="flex-1 text-center">
                        <span className="text-white/60 text-sm">
                          {selectedEpisode?.episodeName || '选择集数'}
                        </span>
                        <span className="text-white/30 text-sm mx-2">
                          {currentEpisodeIndex + 1} / {selectedSource.episodes.length}
                        </span>
                      </div>

                      <button
                        onClick={handleNextEpisode}
                        disabled={!hasNext}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          hasNext
                            ? 'bg-[#1a1a2e] hover:bg-[#252540] text-white'
                            : 'bg-[#1a1a2e]/50 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-sm">下一集</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-[#12121a] rounded-xl border border-white/5 p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{animeDetail.nameCn}</h1>
                  {animeDetail.name !== animeDetail.nameCn && (
                    <p className="text-white/50 text-sm">{animeDetail.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] rounded-lg text-white text-sm font-bold shadow-lg shadow-[#ff6b9d]/20">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {animeDetail.score}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {animeDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1a1a2e] text-white/70 text-xs rounded-full border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {animeDetail.summary && (
                <div className="border-t border-white/5 pt-4">
                  <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2">简介</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{animeDetail.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                <div>
                  <span className="text-white/50 text-xs">开播日期</span>
                  <p className="text-white text-sm mt-0.5">{animeDetail.airDate || '未知'}</p>
                </div>
                <div>
                  <span className="text-white/50 text-xs">平台</span>
                  <p className="text-white text-sm mt-0.5">{animeDetail.platform || '未知'}</p>
                </div>
                <div>
                  <span className="text-white/50 text-xs">制作公司</span>
                  <p className="text-white text-sm mt-0.5">{animeDetail.studio || '未知'}</p>
                </div>
                <div>
                  <span className="text-white/50 text-xs">总集数</span>
                  <p className="text-white text-sm mt-0.5">{animeDetail.episodes || '未知'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#12121a] rounded-xl border border-white/5 p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff6b9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                播放源
                {sourcesLoading ? (
                  <span className="text-white/30 text-xs font-normal">(加载中...)</span>
                ) : (
                  <span className="text-white/30 text-xs font-normal">({validSources.length}个有效)</span>
                )}
              </h3>

              {sourcesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#ff6b9d]/30 border-t-[#ff6b9d] rounded-full animate-spin" />
                    <span className="text-white/50 text-xs">正在获取播放源...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <button
                      onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      disabled={validSources.length === 0}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                        validSources.length === 0
                          ? 'bg-[#1a1a2e]/50 text-white/30 cursor-not-allowed'
                          : 'bg-[#1a1a2e] hover:bg-[#252540] text-white'
                      }`}
                    >
                      <span>{selectedSource?.sourceName || '选择播放源'}</span>
                      {validSources.length > 0 && (
                        <svg
                          className={`w-4 h-4 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {showSourceDropdown && validSources.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] rounded-lg border border-white/5 overflow-hidden z-10 shadow-xl">
                        {validSources.map((source) => (
                          <button
                            key={source.sourceKey}
                            onClick={() => handleSourceChange(source)}
                            className={`w-full px-4 py-3 text-left text-sm transition-all ${
                              selectedSource?.sourceKey === source.sourceKey
                                ? 'bg-[#ff6b9d]/20 text-[#ff6b9d]'
                                : 'text-white/70 hover:bg-[#252540] hover:text-white'
                            }`}
                          >
                            {source.sourceName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedSource && selectedSource.episodes.length > 0 && (
                    <div>
                      <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3">选集</h4>
                      <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {selectedSource.episodes.map((episode, index) => (
                          <button
                            key={index}
                            onClick={() => handleEpisodeSelect(episode)}
                            className={`px-2 py-2 text-xs rounded-lg transition-all truncate ${
                              selectedEpisode?.m3u8Url === episode.m3u8Url
                                ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium shadow-lg shadow-[#ff6b9d]/20'
                                : 'bg-[#1a1a2e] text-white/60 hover:bg-[#252540] hover:text-white'
                            }`}
                          >
                            {episode.episodeName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}