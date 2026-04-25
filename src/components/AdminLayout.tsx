import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authStorage } from '../utils/authStorage';
import { authApi } from '../api/auth';
import { SakuraPetals } from '../components/SakuraPetals';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', label: '仪表盘', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/feedback', label: '反馈管理', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/admin/recommend', label: '推荐管理', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  const handleLogout = async () => {
    try { await authApi.logout(); } catch (error) { console.error('Logout error:', error); }
    finally { authStorage.clearAll(); navigate('/login'); }
  };

  const isActive = (path: string) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex relative" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      <aside className={`fixed left-0 top-0 h-full glass border-r border-[#ff6b8a]/10 transition-all duration-300 z-50 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        <div className="flex items-center justify-between h-14 px-3 border-b border-[#ff6b8a]/10">
          {sidebarOpen && <h1 className="text-lg font-extrabold text-[#ff6b8a]">🌸 Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#ff6b8a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        <nav className="p-2.5 space-y-0.5">
          {menuItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${isActive(item.path) ? 'bg-[#ff6b8a]/10 text-[#ff6b8a] font-semibold' : 'text-gray-500 hover:bg-[#ff6b8a]/5 hover:text-[#ff6b8a]'}`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-2.5 border-t border-[#ff6b8a]/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#ff4757] hover:bg-[#ff4757]/10 transition-all duration-300 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {sidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </aside>
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        <header className="h-14 glass border-b border-[#ff6b8a]/10 flex items-center justify-between px-5 sticky top-0 z-40">
          <h2 className="text-base font-semibold text-gray-800">{menuItems.find(item => isActive(item.path))?.label || '管理后台'}</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b8a] to-[#ff8fa3] flex items-center justify-center text-white font-semibold text-sm shadow">{authStorage.getUser()?.nickname?.charAt(0).toUpperCase() || 'A'}</div>
            <span className="text-gray-600 text-sm">{authStorage.getUser()?.nickname || '管理员'}</span>
          </div>
        </header>
        <main className="p-5 relative z-10"><Outlet /></main>
      </div>
    </div>
  );
}
