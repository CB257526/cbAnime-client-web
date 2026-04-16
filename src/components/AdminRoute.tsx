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

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const user = authStorage.getUser();
      
      if (!user) {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          authStorage.saveUser(response.data);
          setIsAdmin(response.data.role === 'ADMIN');
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(user.role === 'ADMIN');
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d] mx-auto mb-4"></div>
          <p className="text-white/60">验证权限中...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
