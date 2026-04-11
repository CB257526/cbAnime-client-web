import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { authStorage } from '../../utils/authStorage';
import { UserDTO } from '../../types/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await authApi.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.message || '获取用户信息失败');
        }
      } catch {
        setError('获取用户信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      authStorage.clearAll();
      navigate('/login');
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0: return '保密';
      case 1: return '男';
      case 2: return '女';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#ff6b9d]/30 border-t-[#ff6b9d] animate-spin" />
          <p className="text-white/50">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="bg-[#12121a] rounded-2xl border border-white/10 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ff4757]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ff4757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">加载失败</h2>
          <p className="text-white/50 text-sm mb-6">{error || '用户信息不存在'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium rounded-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-bold text-white">个人中心</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          <div className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-br from-[#ff6b9d]/20 to-[#ffa726]/20">
              <div className="absolute -bottom-12 left-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ff6b9d] to-[#ffa726] p-0.5">
                    <div className="w-full h-full rounded-2xl bg-[#12121a] flex items-center justify-center">
                      <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] bg-clip-text text-transparent">
                        {user.nickname?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">{user.nickname}</h2>
                <p className="text-white/50 text-sm">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0a0a0f] rounded-xl p-4 text-center">
                  <p className="text-white/30 text-xs mb-1">性别</p>
                  <p className="text-white font-medium">{getGenderText(user.gender)}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-4 text-center">
                  <p className="text-white/30 text-xs mb-1">生日</p>
                  <p className="text-white font-medium">{user.birthday || '未设置'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-[#ff4757]/10 hover:bg-[#ff4757]/20 border border-[#ff4757]/30 text-[#ff4757] font-medium rounded-xl transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
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