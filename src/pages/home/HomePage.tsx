import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { animeApi } from '../../api/anime';
import { authStorage } from '../../utils/authStorage';
import { BannerCarousel } from '../../components/BannerCarousel';
import { AnimeGrid } from '../../components/AnimeCard';
import { AnimeHomeDTO } from '../../types/anime';

export function HomePage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<AnimeHomeDTO[]>([]);
  const [popularList, setPopularList] = useState<AnimeHomeDTO[]>([]);
  const [latestList, setLatestList] = useState<AnimeHomeDTO[]>([]);
  const [recommendList, setRecommendList] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNickname, setUserNickname] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = authStorage.getUser();
    if (user) {
      setUserNickname(user.nickname);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [bannerRes, popularRes, latestRes, recommendRes] = await Promise.all([
          animeApi.getAdminRecommendList(),
          animeApi.getPopularList(12),
          animeApi.getLatestList(12),
          animeApi.getRecommendList(12),
        ]);

        if (bannerRes.success && bannerRes.data) {
          setBanners(bannerRes.data);
        }
        if (popularRes.success && popularRes.data) {
          setPopularList(popularRes.data);
        }
        if (latestRes.success && latestRes.data) {
          setLatestList(latestRes.data);
        }
        if (recommendRes.success && recommendRes.data) {
          setRecommendList(recommendRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      authStorage.clearAll();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-white">CB </span>
                <span className="text-gradient bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] bg-clip-text text-transparent">Anime</span>
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-sm text-white relative group">
                  <span className="relative z-10">首页</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                  动漫列表
                </a>
                <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                  排行榜
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b9d]/20 to-[#ffa726]/20 border border-[#ff6b9d]/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-gradient bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] bg-clip-text text-transparent">
                      {userNickname ? userNickname[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b9d]/20 to-[#ffa726]/20 blur-lg opacity-50" />
                </div>
                <span className="text-sm text-white/70 hidden sm:block">{userNickname}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12 animate-fade-in">
          <BannerCarousel banners={banners} autoPlayInterval={5000} />
        </section>

        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <AnimeGrid title="热门推荐" animeList={popularList} loading={loading} />
        </section>

        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <AnimeGrid title="最新上架" animeList={latestList} loading={loading} />
        </section>

        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <AnimeGrid title="编辑推荐" animeList={recommendList} loading={loading} />
        </section>
      </main>

      <footer className="bg-[#12121a]/50 border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-white/30">
            © 2024 <span className="text-gradient bg-gradient-to-r from-[#ff6b9d]/50 to-[#ffa726]/50 bg-clip-text text-transparent">CB Anime</span> · 二次元爱好者的聚集地
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out both; }
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}