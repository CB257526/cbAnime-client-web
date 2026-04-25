import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeHomeDTO } from '../../types/anime';
import { SakuraPetals } from '../../components/SakuraPetals';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) performSearch(query);
  }, [query]);

  const performSearch = async (keyword: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await animeApi.searchAnime(keyword);
      if (response.success && response.data) setResults(response.data.records);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchParams({ q: keyword });
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      <div className="fixed inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover' }} />

      <header className="sticky top-0 z-50 glass mx-3 mt-2 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center gap-4 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🌸</span>
            <span className="text-xl font-extrabold text-[#ff6b8a] hidden sm:inline">Anime</span>
          </Link>
          <div className="flex-1 max-w-lg flex items-center bg-white/60 rounded-full px-4 py-2 border border-[#ff6b8a]/20 focus-within:border-[#ff6b8a]/50 focus-within:bg-white/80 transition-all">
            <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" defaultValue={query} placeholder="搜索番剧、角色、作者..." className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value); }} />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 py-6 relative z-10">
        {query && (
          <div className="mb-6 fade-up">
            <h1 className="text-xl font-bold text-gray-800 mb-1">搜索结果: <span className="text-[#ff6b8a]">"{query}"</span></h1>
            {searched && !loading && <p className="text-gray-400 text-sm">找到 {results.length} 部动漫</p>}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="space-y-2"><div className="skeleton aspect-[3/4] rounded-xl" /><div className="skeleton h-3 w-3/4 rounded" /></div>))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="card p-12 text-center fade-up">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">未找到相关动漫</h3>
            <p className="text-gray-400 text-sm mb-6">试试其他关键词</p>
            <div className="max-w-md mx-auto flex items-center bg-white/80 rounded-full px-4 py-2 border border-[#ff6b8a]/20">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="搜索番剧..." className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value); }} />
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="card p-4 fade-up">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {results.map(anime => (
                <Link key={anime.id} to={`/anime/${anime.id}`} className="anime-card block">
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={anime.imagesLarge} alt={anime.nameCn} className="card-img w-full aspect-[3/4] object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b8a] text-white text-xs font-bold rounded-md shadow">{anime.score.toFixed(1)}</div>
                  </div>
                  <div className="mt-2"><p className="text-sm font-medium text-gray-800 truncate">{anime.nameCn}</p><p className="text-xs text-gray-400 mt-0.5">{anime.airDate}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20 fade-up">
            <div className="text-6xl mb-4 float">🌸</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">搜索动漫</h3>
            <p className="text-gray-400 text-sm mb-6">输入关键词开始搜索</p>
            <div className="max-w-md mx-auto flex items-center bg-white/80 rounded-full px-4 py-2 border border-[#ff6b8a]/20">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="搜索番剧、角色、作者..." className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value); }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
