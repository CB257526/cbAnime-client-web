import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { AxiosError } from 'axios';
import { Result } from '../../types/auth';

interface AnimeRecommendation {
  id: number;
  nameCn: string;
  imagesLarge: string;
  score: number;
  airDate: string;
  platform: string;
}

export function RecommendationManagementPage() {
  const [recommendList, setRecommendList] = useState<AnimeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [animeIdsInput, setAnimeIdsInput] = useState('');
  const [position, setPosition] = useState('home_banner');

  useEffect(() => { loadRecommendList(); }, []);

  const loadRecommendList = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getRecommendList();
      if (response.success && response.data) setRecommendList(response.data);
    } catch { console.error('Failed to load recommend list:'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!animeIdsInput.trim()) { alert('请输入动漫 ID 列表'); return; }
    const animeIds = animeIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (animeIds.length === 0) { alert('请输入有效的动漫 ID'); return; }
    setSaving(true);
    try {
      const response = await adminApi.setRecommendList({ animeIds, position });
      if (response.success) { alert('推荐列表更新成功'); setAnimeIdsInput(''); loadRecommendList(); }
      else { alert(response.message || '更新失败'); }
    } catch (error) { const axiosError = error as AxiosError<Result>; alert(axiosError.response?.data?.message || '更新失败'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-800 mb-1">推荐管理</h1><p className="text-gray-400 text-sm">管理首页推荐的动漫列表</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">当前推荐列表</h3>
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-12 h-12 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /></div>
          ) : recommendList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <p className="text-sm">暂无推荐动漫</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {recommendList.map((anime) => (
                <div key={anime.id} className="flex items-center gap-3 p-2.5 bg-white/50 rounded-xl hover:bg-[#ff6b8a]/5 transition-colors">
                  <img src={anime.imagesLarge} alt={anime.nameCn} className="w-12 h-16 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmY2JjZCIvPjwvc3ZnPg=='; }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 font-medium text-sm truncate">{anime.nameCn}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><svg className="w-3.5 h-3.5 text-[#ffa726]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>{anime.score.toFixed(1)}</span>
                      <span>•</span><span>{anime.platform}</span><span>•</span><span>{anime.airDate}</span>
                    </div>
                    <p className="text-[10px] text-gray-300 mt-0.5">ID: {anime.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">添加推荐</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">推荐位置</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-3 py-2.5 bg-white/60 border border-[#ff6b8a]/20 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#ff6b8a]/50 transition-colors">
                <option value="home_banner">首页轮播</option><option value="home_hot">首页热门</option><option value="home_new">首页新番</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">动漫 ID 列表</label>
              <textarea value={animeIdsInput} onChange={(e) => setAnimeIdsInput(e.target.value)} placeholder="请输入动漫 ID，用逗号分隔，例如：2042,1234,5678" rows={6} className="w-full px-3 py-2.5 bg-white/60 border border-[#ff6b8a]/20 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#ff6b8a]/50 transition-colors font-mono text-sm" />
              <p className="text-[10px] text-gray-400 mt-1">提示：动漫 ID 为 Bangumi 平台的 ID</p>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b8a] to-[#ff8fa3] text-white font-medium hover:shadow-lg hover:shadow-[#ff6b8a]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm">{saving ? '保存中...' : '保存推荐列表'}</button>
            <div className="bg-[#ff6b8a]/5 rounded-xl p-3 border border-[#ff6b8a]/10">
              <h4 className="text-xs font-medium text-gray-600 mb-1.5">使用说明</h4>
              <ul className="text-[10px] text-gray-400 space-y-0.5 list-disc list-inside">
                <li>输入要推荐的动漫 ID 列表，多个 ID 用逗号分隔</li>
                <li>选择推荐位置标识（首页轮播、热门、新番等）</li>
                <li>推荐数据有效期为 7 天，过期后需要重新设置</li>
                <li>新推荐列表会完全覆盖旧的推荐列表</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
