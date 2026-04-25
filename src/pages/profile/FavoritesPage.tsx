import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { authStorage } from '../../utils/authStorage';
import { UserFavoriteDTO } from '../../types/anime';
import { SakuraPetals } from '../../components/SakuraPetals';

export function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<UserFavoriteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) { navigate('/login'); return; }
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await animeApi.getFavoriteList();
        if (response.success && response.data) setFavorites(response.data);
        else setError(response.message || '获取收藏列表失败');
      } catch { setError('获取收藏列表失败，请稍后重试'); }
      finally { setLoading(false); }
    };
    fetchFavorites();
  }, [navigate]);

  const handleDeleteFavorite = async (metadataId: number) => {
    try {
      const response = await animeApi.deleteFavorite(metadataId);
      if (response.success) setFavorites(prev => prev.filter(f => f.metadataId !== metadataId));
    } catch { console.error('删除收藏失败'); }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /><p className="text-gray-400 text-sm">加载中...</p></div></div>);

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      <div className="fixed inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover' }} />

      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#ff6b8a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>返回</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">我的收藏</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 pb-8 relative z-10">
        {error && (
          <div className="card p-8 text-center fade-up">
            <div className="text-5xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl hover:bg-[#ff5070] transition-colors">重试</button>
          </div>
        )}

        {!error && favorites.length === 0 && (
          <div className="card p-12 text-center fade-up">
            <div className="text-5xl mb-4">💕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">暂无收藏</h2>
            <p className="text-gray-400 text-sm mb-6">还没有收藏任何动漫，快去发现喜欢的作品吧</p>
            <Link to="/" className="px-6 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl inline-block hover:bg-[#ff5070] transition-colors">浏览首页</Link>
          </div>
        )}

        {!error && favorites.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 fade-up">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="group relative">
                <Link to={`/anime/${favorite.metadataId}`}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 anime-card">
                    <img src={favorite.animeCover} alt={favorite.animeNameCn || favorite.animeName} className="w-full h-full object-cover card-img" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b8a] text-white text-xs font-bold rounded-md shadow">{favorite.score.toFixed(1)}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white text-sm font-medium truncate">{favorite.animeNameCn || favorite.animeName}</h3>
                      <p className="text-white/70 text-xs mt-0.5">{favorite.episodes}集</p>
                    </div>
                  </div>
                </Link>
                <button onClick={() => handleDeleteFavorite(favorite.metadataId)} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff4757]">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
