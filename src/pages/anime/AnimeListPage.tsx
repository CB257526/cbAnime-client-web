import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeHomeDTO } from '../../types/anime';
import { SakuraPetals } from '../../components/SakuraPetals';

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

export function AnimeListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [list, setList] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [platformType, setPlatformType] = useState<'tv' | '剧场版'>('tv');
  const [sortBy, setSortBy] = useState<'score' | 'airDate' | 'episodes'>('score');
  const pageSize = 36;

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === '剧场版') {
      setPlatformType('剧场版');
    } else {
      setPlatformType('tv');
    }
  }, [searchParams]);

  const fetchData = useCallback(async (pg: number) => {
    setLoading(true);
    try {
      const response = await animeApi.getAnimeByPlatform({
        platform: platformType,
        pageNum: pg,
        pageSize,
        orderBy: sortBy,
        sortDirection: 'desc',
      });
      if (response.success && response.data) {
        setList(response.data.records || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.pages || 1);
      }
    } catch {
      console.error('获取动漫列表失败');
    }
    setLoading(false);
  }, [platformType, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchData(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed inset-0 bg-gradient-to-br from-[#fff5f7]/80 via-[#ffe8ed]/70 to-[#ffe0e8]/80 pointer-events-none z-0" />
      <SakuraPetals />

      {/* Header */}
      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-[#ff6b8a] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-lg font-bold text-gray-800">{platformType === 'tv' ? '番剧' : '剧场版'}</h1>
          </div>
          <span className="text-xs text-gray-400">共 {total} 部作品</span>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 pb-8 relative z-10">
        {/* Filter Bar */}
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">类型：</span>
              <button onClick={() => { setPlatformType('tv'); setSearchParams({ type: 'tv' }); }} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${platformType === 'tv' ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>番剧</button>
              <button onClick={() => { setPlatformType('剧场版'); setSearchParams({ type: '剧场版' }); }} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${platformType === '剧场版' ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>剧场版</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">排序：</span>
              {[
                { key: 'score' as const, label: '评分' },
                { key: 'airDate' as const, label: '上映时间' },
                { key: 'episodes' as const, label: '集数' },
              ].map(item => (
                <button key={item.key} onClick={() => setSortBy(item.key)} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${sortBy === item.key ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>{item.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton aspect-[3/4] rounded-xl" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📺</div>
            <p className="text-gray-400 text-sm">暂无{platformType === 'tv' ? '番剧' : '剧场版'}数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {list.map(anime => (<AnimeCard key={anime.id} anime={anime} />))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => handlePageChange(1)} disabled={page === 1} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${page === 1 ? 'bg-white/30 text-gray-300 cursor-not-allowed' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>首页</button>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${page === 1 ? 'bg-white/30 text-gray-300 cursor-not-allowed' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>上一页</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-8 h-8 text-xs rounded-lg transition-all ${page === pageNum ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>{pageNum}</button>
              );
            })}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${page === totalPages ? 'bg-white/30 text-gray-300 cursor-not-allowed' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>下一页</button>
            <button onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${page === totalPages ? 'bg-white/30 text-gray-300 cursor-not-allowed' : 'bg-white/60 text-gray-600 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'}`}>末页</button>
          </div>
        )}
      </main>
    </div>
  );
}
