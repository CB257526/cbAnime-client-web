import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { authStorage } from '../../utils/authStorage';
import { UserDTO } from '../../types/auth';
import { SakuraPetals } from '../../components/SakuraPetals';

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) { navigate('/login'); return; }
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await authApi.getProfile();
        if (response.success && response.data) setUser(response.data);
        else setError(response.message || '获取用户信息失败');
      } catch { setError('获取用户信息失败，请稍后重试'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    finally { authStorage.clearAll(); navigate('/login'); }
  };

  const getGenderText = (gender: number) => gender === 0 ? '保密' : gender === 1 ? '男' : gender === 2 ? '女' : '未知';

  if (loading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /><p className="text-gray-400 text-sm">加载中...</p></div></div>);
  if (error || !user) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <div className="card p-8 text-center max-w-md w-full">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">加载失败</h2>
        <p className="text-gray-400 text-sm mb-6">{error || '用户信息不存在'}</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="flex-1 py-2.5 bg-white/80 text-gray-600 font-medium rounded-xl hover:bg-white transition-colors border border-gray-200">返回首页</button>
          <button onClick={() => { authStorage.clearAll(); navigate('/login'); }} className="flex-1 py-2.5 bg-[#ff6b8a] text-white font-medium rounded-xl hover:bg-[#ff5070] transition-colors">重新登录</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      <div className="fixed inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover' }} />

      <header className="sticky top-0 z-50 glass mx-3 mt-2 mb-4 px-5 py-2.5 rounded-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-[#ff6b8a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>返回</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">个人中心</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 pb-8 relative z-10">
        <div className="card overflow-hidden fade-up">
          <div className="relative h-32 bg-gradient-to-br from-[#ff6b8a]/30 to-[#ffb6c1]/30">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6b8a] to-[#ff8fa3] p-0.5 shadow-lg shadow-[#ff6b8a]/20">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#ff6b8a]">{user.nickname?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-14 pb-6 px-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">{user.nickname}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/60 rounded-xl p-3 text-center border border-[#ff6b8a]/10">
                <p className="text-gray-400 text-xs mb-1">性别</p><p className="text-gray-700 font-medium">{getGenderText(user.gender)}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-3 text-center border border-[#ff6b8a]/10">
                <p className="text-gray-400 text-xs mb-1">生日</p><p className="text-gray-700 font-medium">{user.birthday || '未设置'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/profile/favorites" className="flex-1 py-2.5 text-center bg-[#ff6b8a]/10 text-[#ff6b8a] font-medium rounded-xl hover:bg-[#ff6b8a]/20 transition-colors text-sm">我的收藏</Link>
              <Link to="/profile/history" className="flex-1 py-2.5 text-center bg-[#ff6b8a]/10 text-[#ff6b8a] font-medium rounded-xl hover:bg-[#ff6b8a]/20 transition-colors text-sm">观看记录</Link>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full mt-4 py-3 bg-[#ff4757]/10 hover:bg-[#ff4757]/20 border border-[#ff4757]/30 text-[#ff4757] font-medium rounded-xl transition-colors text-sm">退出登录</button>
      </main>
    </div>
  );
}
