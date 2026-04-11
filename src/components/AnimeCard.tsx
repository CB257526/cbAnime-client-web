import { useNavigate } from 'react-router-dom';
import { AnimeHomeDTO } from '../types/anime';

interface AnimeCardProps {
  anime: AnimeHomeDTO;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/anime/${anime.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#12121a] border border-white/5 transition-all duration-300 group-hover:border-[#ff6b9d]/30 group-hover:shadow-lg group-hover:shadow-[#ff6b9d]/5">
        <img
          src={anime.imagesLarge}
          alt={anime.nameCn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%2312121a" width="300" height="400"/%3E%3Ctext fill="%23ff6b9d" font-family="system-ui" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em" opacity="0.5"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white text-xs font-bold rounded-lg shadow-lg shadow-[#ff6b9d]/30">
            {anime.score}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="px-2 py-0.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              {anime.platform}
            </span>
            <span>{anime.airDate}</span>
          </div>
        </div>
      </div>
      <h4 className="mt-3 text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors duration-300">
        {anime.nameCn}
      </h4>
    </div>
  );
}

interface AnimeGridProps {
  title: string;
  animeList: AnimeHomeDTO[];
  loading?: boolean;
}

export function AnimeGrid({ title, animeList, loading }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#ff6b9d]/30 to-transparent" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-[#12121a] rounded-xl border border-white/5" />
              <div className="mt-3 h-4 bg-[#12121a] rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (animeList.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#ff6b9d]/30 to-transparent" />
        </div>
        <div className="bg-[#12121a]/50 rounded-xl border border-white/5 p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#ff6b9d]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#ff6b9d]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <p className="text-white/30 text-sm">暂无数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ff6b9d]/30 to-transparent" />
        <span className="text-xs text-white/30">{animeList.length} 部</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}