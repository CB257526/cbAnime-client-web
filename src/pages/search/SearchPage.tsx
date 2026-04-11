import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { animeApi } from '../../api/anime';
import { AnimeGrid } from '../../components/AnimeCard';
import { SearchBar } from '../../components/SearchBar';
import { AnimeHomeDTO } from '../../types/anime';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<AnimeHomeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (keyword: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await animeApi.searchAnime(keyword);
      if (response.success && response.data) {
        setResults(response.data.records);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchParams({ q: keyword });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">返回</span>
            </button>

            <div className="flex-1 max-w-2xl">
              <SearchBar size="sm" onSearch={handleSearch} />
            </div>

            <div className="hidden sm:block w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query && (
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">
              搜索结果: <span className="text-gradient bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] bg-clip-text text-transparent">"{query}"</span>
            </h1>
            {searched && !loading && (
              <p className="text-white/50 text-sm">
                找到 {results.length} 部动漫
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">搜索中...</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-[#12121a] rounded-xl border border-white/5" />
                  <div className="mt-3 h-4 bg-[#12121a] rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="bg-[#12121a]/50 rounded-xl border border-white/5 p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ff6b9d]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#ff6b9d]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">未找到相关动漫</h3>
            <p className="text-white/40 text-sm mb-6">试试其他关键词</p>
            <div className="max-w-md mx-auto">
              <SearchBar size="md" onSearch={handleSearch} />
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <AnimeGrid title="" animeList={results} loading={false} />
        )}

        {!searched && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#ff6b9d]/20 to-[#ffa726]/20 border border-[#ff6b9d]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ff6b9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">搜索动漫</h3>
            <p className="text-white/40 text-sm mb-8">输入关键词开始搜索</p>
            <div className="max-w-md mx-auto">
              <SearchBar size="lg" onSearch={handleSearch} />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}