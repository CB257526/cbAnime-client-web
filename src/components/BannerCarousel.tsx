import { useEffect, useState, useCallback } from 'react';
import { AnimeHomeDTO } from '../types/anime';

interface BannerCarouselProps {
  banners: AnimeHomeDTO[];
  autoPlayInterval?: number;
}

export function BannerCarousel({ banners, autoPlayInterval = 5000 }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval, nextSlide]);

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-[#12121a] border border-white/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ff6b9d]/10 to-[#ffa726]/10 border border-[#ff6b9d]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ff6b9d]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
            </svg>
          </div>
          <p className="text-white/30 text-sm">暂无推荐内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] group">
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ${
              index === currentIndex ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-4'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={banner.imagesLarge}
                alt={banner.nameCn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420"%3E%3Crect fill="%2312121a" width="800" height="420"/%3E%3Ctext fill="%23ff6b9d" font-family="system-ui" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em" opacity="0.5"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div className="max-w-xl">
                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                      {banner.nameCn}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white text-sm font-bold rounded-full shadow-lg shadow-[#ff6b9d]/30">
                        {banner.score} 分
                      </span>
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-sm rounded-full border border-white/20">
                        {banner.platform}
                      </span>
                      <span className="text-white/60 text-sm">
                        {banner.airDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 border border-white/10 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 border border-white/10 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726]' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}