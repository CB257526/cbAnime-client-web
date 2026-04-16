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

  useEffect(() => {
    loadRecommendList();
  }, []);

  const loadRecommendList = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getRecommendList();
      if (response.success && response.data) {
        setRecommendList(response.data);
      }
    } catch (error) {
      console.error('Failed to load recommend list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!animeIdsInput.trim()) {
      alert('请输入动漫 ID 列表');
      return;
    }

    const animeIds = animeIdsInput
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (animeIds.length === 0) {
      alert('请输入有效的动漫 ID');
      return;
    }

    setSaving(true);
    try {
      const response = await adminApi.setRecommendList({
        animeIds,
        position,
      });

      if (response.success) {
        alert('推荐列表更新成功');
        setAnimeIdsInput('');
        loadRecommendList();
      } else {
        alert(response.message || '更新失败');
      }
    } catch (error) {
      const axiosError = error as AxiosError<Result>;
      alert(axiosError.response?.data?.message || '更新失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">推荐管理</h1>
          <p className="text-white/60">管理首页推荐的动漫列表</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Recommendations */}
        <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">当前推荐列表</h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
            </div>
          ) : recommendList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/40">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p>暂无推荐动漫</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {recommendList.map((anime) => (
                <div
                  key={anime.id}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <img
                    src={anime.imagesLarge}
                    alt={anime.nameCn}
                    className="w-16 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWE3YyIvPjwvc3ZnPg==';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{anime.nameCn}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#ffa726]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {anime.score.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{anime.platform}</span>
                      <span>•</span>
                      <span>{anime.airDate}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">ID: {anime.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Recommendations */}
        <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">添加推荐</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                推荐位置
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff6b9d]/50 transition-colors"
              >
                <option value="home_banner">首页轮播</option>
                <option value="home_hot">首页热门</option>
                <option value="home_new">首页新番</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                动漫 ID 列表
              </label>
              <textarea
                value={animeIdsInput}
                onChange={(e) => setAnimeIdsInput(e.target.value)}
                placeholder="请输入动漫 ID，用逗号分隔，例如：2042,1234,5678"
                rows={8}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ff6b9d]/50 transition-colors font-mono text-sm"
              />
              <p className="text-xs text-white/40 mt-2">
                提示：动漫 ID 为 Bangumi 平台的 ID，可以在动漫详情页 URL 中找到
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium hover:shadow-lg hover:shadow-[#ff6b9d]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {saving ? '保存中...' : '保存推荐列表'}
            </button>

            <div className="bg-[#0a0a0f] rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">使用说明</h4>
              <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
                <li>输入要推荐的动漫 ID 列表，多个 ID 用逗号分隔</li>
                <li>选择推荐位置标识（首页轮播、热门、新番等）</li>
                <li>点击保存后，推荐数据将存入 Redis 缓存</li>
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
