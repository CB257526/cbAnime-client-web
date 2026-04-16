import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { authStorage } from '../../utils/authStorage';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    pendingFeedback: 0,
    processingFeedback: 0,
    completedFeedback: 0,
    recommendCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [feedbackRes, recommendRes] = await Promise.all([
        adminApi.getFeedbackList({ pageNum: 1, pageSize: 1 }),
        adminApi.getRecommendList(),
      ]);

      if (feedbackRes.success && feedbackRes.data) {
        setStats(prev => ({
          ...prev,
          totalFeedback: feedbackRes.data!.total,
          pendingFeedback: feedbackRes.data!.list.filter(f => f.status === 'pending').length,
          processingFeedback: feedbackRes.data!.list.filter(f => f.status === 'processing').length,
          completedFeedback: feedbackRes.data!.list.filter(f => f.status === 'completed').length,
        }));
      }

      if (recommendRes.success && recommendRes.data) {
        setStats(prev => ({
          ...prev,
          recommendCount: recommendRes.data!.length,
        }));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '总反馈数',
      value: stats.totalFeedback,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'from-[#ff6b9d] to-[#ff8a8a]',
    },
    {
      title: '待处理',
      value: stats.pendingFeedback,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-[#ffa726] to-[#ffb74d]',
    },
    {
      title: '处理中',
      value: stats.processingFeedback,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'from-[#42a5f5] to-[#64b5f6]',
    },
    {
      title: '已完成',
      value: stats.completedFeedback,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-[#66bb6a] to-[#81c784]',
    },
    {
      title: '推荐动漫',
      value: stats.recommendCount,
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      color: 'from-[#ab47bc] to-[#ba68c8]',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">欢迎回来，{authStorage.getUser()?.nickname || '管理员'}</h1>
        <p className="text-white/60">管理后台仪表盘 - 实时掌握平台动态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="relative group bg-[#12121a] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-white/60 text-sm font-medium mb-2">{card.title}</h3>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">快捷操作</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/feedback'}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <svg className="w-5 h-5 text-[#ff6b9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>处理用户反馈</span>
            </button>
            <button
              onClick={() => window.location.href = '/admin/recommend'}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <svg className="w-5 h-5 text-[#ffa726]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>管理推荐列表</span>
            </button>
          </div>
        </div>

        <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">系统信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">当前用户</span>
              <span className="text-white">{authStorage.getUser()?.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">用户角色</span>
              <span className="text-[#ff6b9d]">{authStorage.getUser()?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">用户 ID</span>
              <span className="text-white">{authStorage.getUser()?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
