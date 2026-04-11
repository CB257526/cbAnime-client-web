import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (keyword: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({ onSearch, size = 'md' }: SearchBarProps) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      if (onSearch) {
        onSearch(keyword.trim());
      }
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b9d]/50 to-[#ffa726]/50 rounded-xl blur opacity-0 group-focus-within:opacity-40 transition duration-300" />
        <div className="relative flex items-center bg-[#12121a] rounded-xl border border-white/10 group-focus-within:border-[#ff6b9d]/50 transition-all duration-300">
          <svg
            className={`${iconSizes[size]} ml-4 text-white/30 flex-shrink-0`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索动漫名称..."
            className={`w-full bg-transparent text-white placeholder-white/30 focus:outline-none ${sizeClasses[size]}`}
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="mr-3 p-1 text-white/30 hover:text-white/60 transition-colors"
            >
              <svg className={`${iconSizes[size]} `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className={`mr-1 px-4 py-1.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#ff6b9d]/25 transition-all duration-300 ${size === 'sm' ? 'px-3 py-1 text-xs' : ''}`}
          >
            搜索
          </button>
        </div>
      </div>
    </form>
  );
}