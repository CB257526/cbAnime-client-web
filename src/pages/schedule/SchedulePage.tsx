import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BangumiCalendarDay } from '../../types/anime';
import { SakuraPetals } from '../../components/SakuraPetals';

const days = ['一', '二', '三', '四', '五', '六', '日'];
const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function SchedulePage() {
  const navigate = useNavigate();
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState<BangumiCalendarDay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://api.bgm.tv/calendar', {
      headers: { 'Accept': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('获取失败');
        return res.json();
      })
      .then((data: BangumiCalendarDay[]) => {
        setCalendarData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('获取新番时间表失败，请检查网络连接');
        setLoading(false);
      });
  }, []);

  const bgmDayIdx = selectedDay + 1;
  const currentDay = calendarData.find((d) => d.weekday.id === bgmDayIdx);
  const items = currentDay?.items || [];

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/bg-sakura.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-[#fff5f7]/80 via-[#ffe8ed]/70 to-[#ffe0e8]/80 pointer-events-none z-0" />
      <SakuraPetals />

      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#ff6b8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-lg font-bold text-gray-800">新番时间表</h1>
          </div>
          <span className="text-xs text-gray-400">数据来自 Bangumi</span>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 pb-8 relative z-10">
        {/* Day Selector */}
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-gray-500 font-semibold flex-shrink-0">选择星期：</span>
            {days.map((day, i) => (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={`px-4 py-2 text-sm rounded-xl transition-all flex-shrink-0 ${
                  i === selectedDay
                    ? 'bg-[#ff6b8a] text-white font-semibold shadow-lg shadow-[#ff6b8a]/30'
                    : i === todayIdx
                      ? 'bg-[#ff6b8a]/10 text-[#ff6b8a] font-medium border border-[#ff6b8a]/20'
                      : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a]'
                }`}
              >
                周{day}
                {i === todayIdx && <span className="ml-1 text-[10px] opacity-70">(今天)</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" />
            <p className="text-gray-400 text-sm">加载中...</p>
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl hover:bg-[#ff5070] transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📺</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">当天暂无番剧</h2>
            <p className="text-gray-400 text-sm">
              {dayNames[selectedDay]}没有新番更新，试试其他日期吧
            </p>
          </div>
        ) : (
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>📅</span>
              {dayNames[selectedDay]}新番列表
              <span className="text-xs text-gray-400 font-normal">（共 {items.length} 部）</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/anime/${item.id}`}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-white/40 hover:bg-[#ff6b8a]/5 border border-transparent hover:border-[#ff6b8a]/20 transition-all"
                >
                  {/* Image */}
                  <div className="w-16 h-22 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.images?.large ? (
                      <img
                        src={item.images.large}
                        alt={item.name_cn || item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#ff6b8a] transition-colors">
                      {item.name_cn || item.name}
                    </p>
                    {item.name_cn && item.name !== item.name_cn && (
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {item.rating?.score != null && item.rating.score > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#ff6b8a]/10 text-[#ff6b8a] text-[10px] rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {item.rating.score.toFixed(1)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {item.collection?.doing || 0}人在看
                      </span>
                      {item.air_date && (
                        <span className="text-[10px] text-gray-400">开播 {item.air_date}</span>
                      )}
                    </div>
                    {item.summary && (
                      <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
