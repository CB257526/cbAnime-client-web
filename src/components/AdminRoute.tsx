import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../utils/authStorage';
import { authApi } from '../api/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { checkAdminStatus(); }, []);

  const checkAdminStatus = async () => {
    try {
      const user = authStorage.getUser();
      if (!user) {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) { authStorage.saveUser(response.data); setIsAdmin(response.data.role === 'ADMIN'); }
        else { setIsAdmin(false); }
      } else { setIsAdmin(user.role === 'ADMIN'); }
    } catch { console.error('Failed to check admin status:'); setIsAdmin(false); }
    finally { setLoading(false); }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}><div className="text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /><p className="text-gray-400 text-sm">验证权限中...</p></div></div>);
  if (!isAdmin) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
