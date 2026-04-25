import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authStorage } from '../../utils/authStorage';
import { animeApi } from '../../api/anime';
import { AnimeHomeDTO, BangumiCalendarDay, BangumiSubject } from '../../types/anime';
import { SakuraPetals } from '../../components/SakuraPetals';
import { Live2DWidget } from '../../components/Live2DWidget';
import { ImportConfigModal } from '../../components/ImportConfigModal';

function BannerCarousel({ banners }: { banners: AnimeHomeDTO[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[current];

  return (
    <div className="carousel-slide relative overflow-hidden rounded-2xl">
      <img src={banner.imagesLarge} alt={banner.nameCn} className="w-full h-full object-cover" />
      <div className="overlay" />
      <div className="content">
        <div className="inline-block px-3 py-1 bg-[#ff6b8a]/80 text-white text-xs rounded-full mb-3">本周热门推荐</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{banner.nameCn}</h2>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">十年后，世界与其他次元之间的"门"被打开，各类魔物不断出现，人类因此觉醒了特殊能力。</p>
        <div className="flex items-center gap-3">
          <Link to={`/anime/${banner.id}`} className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6b8a] hover:bg-[#ff5070] text-white rounded-full text-sm font-semibold transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" /></svg>
            立即观看
          </Link>
          <button className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm backdrop-blur-sm transition-colors">播放预告</button>
        </div>
      </div>
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setCurrent(prev => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, index) => (
          <button key={index} onClick={() => setCurrent(index)} className={`transition-all duration-300 rounded-full ${index === current ? 'bg-[#ff6b8a] w-8 h-2' : 'bg-white/50 w-2 h-2'}`} />
        ))}
      </div>
    </div>
  );
}

function AnimeCard({ anime }: { anime: AnimeHomeDTO }) {
  return (
    <Link to={`/anime/${anime.id}`} className="anime-card block">
      <div className="relative overflow-hidden rounded-xl">
        <img src={anime.imagesLarge} alt={anime.nameCn} className="card-img w-full aspect-[3/4] object-cover" />
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b8a] text-white text-xs font-bold rounded-md shadow">{anime.score.toFixed(1)}</div>
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 truncate">{anime.nameCn}</p>
        <p className="text-xs text-gray-400 mt-0.5">{anime.airDate}</p>
      </div>
    </Link>
  );
}

function SchedulePanel() {
  const days = ['一', '二', '三', '四', '五', '六', '日'];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState<BangumiCalendarDay[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.bgm.tv/calendar', { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then((data: BangumiCalendarDay[]) => {
        setCalendarData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const bgmDayIdx = selectedDay + 1;
  const currentDay = calendarData.find(d => d.weekday.id === bgmDayIdx);
  const items = currentDay?.items || [];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title"><span>🌸</span>新番时间表</h3>
        <button className="text-[#ff6b8a] text-xs hover:opacity-70">更多 ›</button>
      </div>
      <div className="flex items-center justify-between mb-3">
        {days.map((day, i) => (
          <button key={day} onClick={() => setSelectedDay(i)} className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${i === selectedDay ? 'bg-[#ff6b8a] text-white shadow-lg shadow-[#ff6b8a]/30' : 'text-gray-400 hover:bg-[#ff6b8a]/10'}`}>
            {day}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="flex items-center gap-2"><div className="w-10 h-6 skeleton" /><div className="w-10 h-14 skeleton" /><div className="flex-1"><div className="h-3 skeleton w-24" /><div className="h-2.5 skeleton w-16 mt-1" /></div></div>))}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">📺</div>
          <p className="text-xs text-gray-400">当天暂无番剧</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item: BangumiSubject, i: number) => (
            <Link key={item.id} to={`/anime/${item.id}`} className="schedule-item group p-2 rounded-lg hover:bg-[#ff6b8a]/5 transition-colors">
              <span className="text-xs text-gray-400 w-10 flex-shrink-0">{String(i * 2 + 17).padStart(2, '0')}:00</span>
              <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {item.images?.large ? (
                  <img src={item.images.large} alt={item.name_cn || item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 ml-1">
                <p className="text-xs text-gray-700 truncate group-hover:text-[#ff6b8a] transition-colors">{item.name_cn || item.name}</p>
                <p className="text-[10px] text-gray-400">评分 {item.rating?.score?.toFixed(1) || 'N/A'}</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#ff6b8a]/10 text-[#ff6b8a] rounded-full flex-shrink-0">{item.collection?.doing || 0}人在看</span>
            </Link>
          ))}
        </div>
      )}
      <Link to="/schedule" className="w-full mt-3 py-2 text-xs text-[#ff6b8a] border border-[#ff6b8a]/20 rounded-lg hover:bg-[#ff6b8a]/5 transition-colors block text-center">📅 查看完整时间表 ›</Link>
    </div>
  );
}

function RankingPanel() {
  const [activeTab, setActiveTab] = useState('日榜');
  const [rankingList, setRankingList] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const tabs = ['日榜', '周榜', '月榜', '总榜'];

  useEffect(() => {
    setLoading(true);
    animeApi.getPopularList(7).then(res => {
      if (res.success && res.data) setRankingList(res.data);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title"><span>🌸</span>人气排行榜</h3>
        <button className="text-[#ff6b8a] text-xs hover:opacity-70">更多 ›</button>
      </div>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`tag-btn ${activeTab === tab ? 'active' : ''}`}>{tab}</button>))}
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex items-center gap-2"><div className="w-6 h-6 skeleton rounded" /><div className="w-10 h-14 skeleton" /><div className="flex-1"><div className="h-3 skeleton w-24" /><div className="h-2.5 skeleton w-16 mt-1" /></div><div className="h-3 skeleton w-6" /></div>))}</div>
      ) : (
        <div className="space-y-1">
          {rankingList.slice(0, 7).map((item, index) => (
            <Link key={item.id} to={`/anime/${item.id}`} className="flex items-center gap-2 py-1.5 group">
              <span className={`rank-number ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>{index + 1}</span>
              <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={item.imagesLarge} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 truncate group-hover:text-[#ff6b8a] transition-colors">{item.nameCn}</p>
                <p className="text-[10px] text-gray-400">更新至 第{index + 1}集</p>
              </div>
              <span className="text-[#ff6b8a] font-bold text-xs flex-shrink-0">{item.score.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const navItems = [
  { label: '首页', path: '/', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
  { label: '我的追番', path: '/profile/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: '观看记录', path: '/profile/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: '收藏列表', path: '/profile/favorites', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: '下载管理', path: '/', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<AnimeHomeDTO[]>([]);
  const [popularList, setPopularList] = useState<AnimeHomeDTO[]>([]);
  const [latestList, setLatestList] = useState<AnimeHomeDTO[]>([]);
  const [recommendList, setRecommendList] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('全部');
  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const tags = ['全部', '热血', '奇幻', '恋爱', '治愈', '搞笑'];

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      setIsLoggedIn(true);
    }
    setLoading(true);
    Promise.all([animeApi.getAdminRecommendList(), animeApi.getPopularList(12), animeApi.getLatestList(12), animeApi.getRecommendList(12)]).then(([b, p, l, r]) => {
      if (b.success && b.data) setBanners(b.data);
      if (p.success && p.data) setPopularList(p.data);
      if (l.success && l.data) setLatestList(l.data);
      if (r.success && r.data) setRecommendList(r.data);
      setLoading(false);
    });
  }, [navigate]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed inset-0 bg-gradient-to-br from-[#fff5f7]/80 via-[#ffe8ed]/70 to-[#ffe0e8]/80 pointer-events-none z-0" />
      <SakuraPetals />
      <Live2DWidget />

      {/* Header */}
      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="text-xl font-extrabold text-[#ff6b8a]">Anime</span>
              <span className="text-xs text-gray-400 font-medium">Koi</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-semibold text-[#ff6b8a]">首页</Link>
              <Link to="/anime-list?type=tv" className="text-sm text-gray-500 hover:text-[#ff6b8a] transition-colors">番剧</Link>
              <Link to="/anime-list?type=剧场版" className="text-sm text-gray-500 hover:text-[#ff6b8a] transition-colors">剧场版</Link>
              <Link to="/schedule" className="text-sm text-gray-500 hover:text-[#ff6b8a] transition-colors">新番时间表</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 hover:bg-white/80 text-gray-600 rounded-full text-xs font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="hidden sm:inline">导入配置</span>
            </button>
            <div className="hidden lg:flex items-center bg-white/60 rounded-full px-4 py-2 w-64 border border-[#ff6b8a]/20 focus-within:border-[#ff6b8a]/50 focus-within:bg-white/80 transition-all">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="搜索番剧、角色、作者..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchInput); }}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none" 
              />
            </div>
            <button onClick={() => navigate('/profile/favorites')} className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-gray-500 transition-colors" title="收藏列表">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <button onClick={() => navigate('/profile/history')} className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-gray-500 transition-colors" title="观看记录">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-gray-500 transition-colors" title="通知">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            {isLoggedIn ? (
              <Link to="/profile" className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-[#ff6b8a] hover:bg-[#ff5070] text-white rounded-full text-sm font-semibold transition-colors">
                <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                <span className="hidden sm:inline">个人中心</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-[#ff6b8a] hover:bg-[#ff5070] text-white rounded-full text-sm font-semibold transition-colors">
                <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                <span className="hidden sm:inline">登录 / 注册</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex gap-4 px-3 pb-8 max-w-[1600px] mx-auto relative z-10">
        {/* Left Sidebar */}
        <aside className="w-44 flex-shrink-0 hidden xl:block">
          <div className="card p-2.5 space-y-0.5">
            {navItems.map(item => (
              <Link key={item.label} to={item.path} className={`nav-item ${item.label === '首页' ? 'active' : ''}`}>
                <svg className="w-4.5 h-4.5 flex-shrink-0" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="mt-3 p-3 bg-gradient-to-br from-[#ff6b8a]/10 to-[#ffb6c1]/10 rounded-xl text-center">
                <div className="text-3xl mb-2 float">🌸</div>
                <p className="text-xs text-gray-500 mb-2">登录享受更多精彩内容</p>
                <Link to="/login" className="inline-block px-4 py-1.5 bg-[#ff6b8a] text-white text-xs rounded-full hover:bg-[#ff5070] transition-colors">立即登录</Link>
              </div>
            )}
          </div>
        </aside>

        {/* Bottom Left Character */}
        <div className="fixed bottom-0 left-0 z-10 pointer-events-none hidden xl:block" style={{ width: '320px' }}>
          <img src="/sakura-character.png" alt="" className="w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-5">
          <section className="fade-up"><BannerCarousel banners={banners} /></section>

          <section className="card p-4 fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title"><span>🌸</span>今日推荐</h2>
              <div className="flex items-center gap-1.5">
                {tags.map(tag => (<button key={tag} onClick={() => setActiveTag(tag)} className={`tag-btn ${activeTag === tag ? 'active' : ''}`}>{tag}</button>))}
                <button className="text-[#ff6b8a] text-xs ml-1 hover:opacity-70">更多 ›</button>
              </div>
            </div>
            {loading ? (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="space-y-2"><div className="skeleton aspect-[3/4] rounded-xl" /><div className="skeleton h-3 w-3/4 rounded" /></div>))}</div>) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{popularList.slice(0, 12).map(anime => (<AnimeCard key={anime.id} anime={anime} />))}</div>)}
          </section>

          <section className="card p-4 fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title"><span>🌸</span>新番速递</h2>
              <button className="text-[#ff6b8a] text-xs hover:opacity-70">更多 ›</button>
            </div>
            {loading ? (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="space-y-2"><div className="skeleton aspect-[3/4] rounded-xl" /><div className="skeleton h-3 w-3/4 rounded" /></div>))}</div>) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{latestList.slice(0, 6).map(anime => (<AnimeCard key={anime.id} anime={anime} />))}</div>)}
          </section>

          <section className="card p-4 fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title"><span>🌸</span>编辑推荐</h2>
              <button className="text-[#ff6b8a] text-xs hover:opacity-70">更多 ›</button>
            </div>
            {loading ? (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="space-y-2"><div className="skeleton aspect-[3/4] rounded-xl" /><div className="skeleton h-3 w-3/4 rounded" /></div>))}</div>) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">{recommendList.slice(0, 6).map(anime => (<AnimeCard key={anime.id} anime={anime} />))}</div>)}
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block space-y-4">
          <SchedulePanel />
          <RankingPanel />
        </aside>
      </div>

      {/* Import Config Modal */}
      <ImportConfigModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </div>
  );
}
