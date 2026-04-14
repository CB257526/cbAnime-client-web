import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { authStorage } from '../../utils/authStorage';
import { UserFavoriteDTO } from '../../types/anime';

export function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<UserFavoriteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await animeApi.getFavoriteList();
        if (response.success && response.data) {
          setFavorites(response.data);
        } else {
          setError(response.message || '获取收藏列表失败');
        }
      } catch {
        setError('获取收藏列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleDeleteFavorite = async (metadataId: number) => {
    try {
      const response = await animeApi.deleteFavorite(metadataId);
      if (response.success) {
        setFavorites(prev => prev.filter(f => f.metadataId !== metadataId));
      }
    } catch {
      console.error('删除收藏失败');
    }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-lg font-bold text-white">我的收藏</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        ) : favorites.length === 0 ? (
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ff6b9d]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ff6b9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">暂无收藏</h2>
            <p className="text-white/50 text-sm mb-6">还没有收藏任何动漫，快去发现喜欢的作品吧</p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium rounded-xl inline-block"
            >
              浏览首页
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="group relative">
                <Link to={`/anime/${favorite.metadataId}`}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a2e]">
                    <img
                      src={favorite.animeCover}
                      alt={favorite.animeNameCn || favorite.animeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white text-sm font-medium truncate">
                        {favorite.animeNameCn || favorite.animeName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#ffa726] text-xs">
                          ⭐ {favorite.score}
                        </span>
                        <span className="text-white/50 text-xs">
                          {favorite.episodes}集
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleDeleteFavorite(favorite.metadataId)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff4757]/80"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {favorite.note && (
                  <p className="text-white/50 text-xs mt-2 truncate">{favorite.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}