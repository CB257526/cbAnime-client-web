import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { authStorage } from '../../utils/authStorage';
import { UserWatchHistoryDTO } from '../../types/anime';

export function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<UserWatchHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await animeApi.getWatchHistoryList();
        if (response.success && response.data) {
          setHistory(response.data);
        } else {
          setError(response.message || '获取观看记录失败');
        }
      } catch {
        setError('获取观看记录失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleDeleteHistory = async (metadataId: number, episodeIndex: number) => {
    try {
      const response = await animeApi.deleteWatchHistory(metadataId, episodeIndex);
      if (response.success) {
        setHistory(prev => prev.filter(h => !(h.metadataId === metadataId && h.episodeIndex === episodeIndex)));
      }
    } catch {
      console.error('删除记录失败');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('确定要清空所有观看记录吗？')) return;
    try {
      const response = await animeApi.clearWatchHistory();
      if (response.success) {
        setHistory([]);
      }
    } catch {
      console.error('清空记录失败');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#ff6b9d]/30 border-t-[#ff6b9d] animate-spin" />
          <p className="text-white/50">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-bold text-white">观看记录</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm text-[#ff4757] hover:bg-[#ff4757]/10 rounded-lg transition-colors"
            >
              清空全部
            </button>
          </div>
        )}

        {error ? (
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ff4757]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#ff4757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">加载失败</h2>
            <p className="text-white/50 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium rounded-xl"
            >
              重试
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ff6b9d]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ff6b9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">暂无观看记录</h2>
            <p className="text-white/50 text-sm mb-6">还没有观看任何动漫，快去发现喜欢的作品吧</p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium rounded-xl inline-block"
            >
              浏览首页
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={`${item.metadataId}-${item.episodeIndex}`}
                className="bg-[#12121a] rounded-xl border border-white/5 p-4 flex gap-4 hover:bg-[#1a1a2e] transition-colors group"
              >
                <Link to={`/anime/${item.metadataId}`} className="flex-shrink-0">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#1a1a2e]">
                    <img
                      src={item.animeCover}
                      alt={item.animeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/anime/${item.metadataId}`}>
                    <h3 className="text-white font-medium truncate hover:text-[#ff6b9d] transition-colors">
                      {item.animeName}
                    </h3>
                  </Link>
                  <p className="text-white/50 text-sm mt-1">
                    看到第{item.episodeIndex + 1}集
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                    <span>观看时长：{formatDuration(item.watchDuration)}</span>
                    <span>{formatTime(item.lastWatchTime)}</span>
                  </div>
                  {item.progressSeconds > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff6b9d] to-[#ffa726]"
                          style={{ width: `${Math.min((item.progressSeconds / (item.watchDuration || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/30">
                        {formatDuration(item.progressSeconds)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteHistory(item.metadataId, item.episodeIndex)}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff4757]/20"
                >
                  <svg className="w-4 h-4 text-white/30 hover:text-[#ff4757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}