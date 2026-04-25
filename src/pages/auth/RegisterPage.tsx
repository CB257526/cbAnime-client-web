import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { AxiosError } from 'axios';
import { Result } from '../../types/auth';
import { SakuraPetals } from '../../components/SakuraPetals';

export function RegisterPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaCooldown, setCaptchaCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCaptcha = async () => {
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setCaptchaLoading(true);
    setError('');
    try {
      await authApi.sendCaptcha({ email });
      setCaptchaCooldown(60);
      const timer = setInterval(() => {
        setCaptchaCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const axiosError = err as AxiosError<Result>;
      setError(axiosError.response?.data?.message || '发送验证码失败');
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname || !email || !password || !confirmPassword || !captchaCode) {
      setError('请填写所有字段');
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setError('密码长度应为6-20位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(nickname)) {
      setError('用户名应为3-20位字母、数字或下划线');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        nickname,
        email,
        password,
        captchaCode,
      });
      if (response.success) {
        alert('注册成功，请登录');
        navigate('/login');
      } else {
        setError(response.message || '注册失败');
      }
    } catch (err) {
      const axiosError = err as AxiosError<Result>;
      setError(axiosError.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffe0e8 100%)' }}>
      <SakuraPetals />
      
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(/bg-sakura.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🌸</span>
            <h1 className="text-3xl font-extrabold text-[#ff6b8a]">
              Anime<span className="text-xs text-gray-400 font-medium ml-1">Koi</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">加入二次元社区，开始你的旅程</p>
        </div>

        <div className="relative card p-6 animate-slide-up">
          <form onSubmit={handleSubmit} className="relative space-y-4">
            {error && (
              <div className="animate-shake">
                <div className="bg-[#ff6b8a]/10 border border-[#ff6b8a]/30 rounded-xl px-4 py-3 text-sm text-[#ff6b8a] flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">用户名</label>
              <div className="relative group">
                <div className="relative flex items-center bg-white/80 rounded-xl border border-[#ff6b8a]/20 group-focus-within:border-[#ff6b8a]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full px-3 py-3 bg-transparent text-gray-800 placeholder-gray-300 focus:outline-none text-sm" placeholder="3-20位字母、数字或下划线" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">邮箱地址</label>
              <div className="relative group">
                <div className="relative flex items-center bg-white/80 rounded-xl border border-[#ff6b8a]/20 group-focus-within:border-[#ff6b8a]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-3 bg-transparent text-gray-800 placeholder-gray-300 focus:outline-none text-sm" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">密码</label>
                <div className="relative group">
                  <div className="relative flex items-center bg-white/80 rounded-xl border border-[#ff6b8a]/20 group-focus-within:border-[#ff6b8a]/50 transition-all duration-300">
                    <svg className="w-5 h-5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-3 bg-transparent text-gray-800 placeholder-gray-300 focus:outline-none text-sm" placeholder="6-20位密码" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">确认密码</label>
                <div className="relative group">
                  <div className="relative flex items-center bg-white/80 rounded-xl border border-[#ff6b8a]/20 group-focus-within:border-[#ff6b8a]/50 transition-all duration-300">
                    <svg className="w-5 h-5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-3 bg-transparent text-gray-800 placeholder-gray-300 focus:outline-none text-sm" placeholder="再次输入" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">验证码</label>
              <div className="relative group">
                <div className="relative flex items-center bg-white/80 rounded-xl border border-[#ff6b8a]/20 group-focus-within:border-[#ff6b8a]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <input type="text" value={captchaCode} onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())} className="w-24 px-3 py-3 bg-transparent text-gray-800 placeholder-gray-300 focus:outline-none text-sm" placeholder="验证码" maxLength={6} />
                  <button type="button" onClick={handleSendCaptcha} disabled={captchaLoading || captchaCooldown > 0} className="mr-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-[#ff6b8a] to-[#ff8fa3] text-white hover:shadow-lg hover:shadow-[#ff6b8a]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                    {captchaLoading ? '...' : captchaCooldown > 0 ? `${captchaCooldown}s` : '获取'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b8a] to-[#ff8fa3] rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-300" />
              <div className="relative flex items-center justify-center py-3 bg-gradient-to-r from-[#ff6b8a] to-[#ff8fa3] rounded-xl text-white font-semibold text-sm">
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                ) : '创建账号'}
              </div>
            </button>
          </form>

          <div className="relative mt-5 pt-4 border-t border-[#ff6b8a]/10 text-center">
            <p className="text-sm text-gray-500">已有账号？{' '}<Link to="/login" className="text-[#ff6b8a] hover:text-[#ff5070] font-medium transition-colors">立即登录</Link></p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">© 2024 Anime Koi · 二次元爱好者的聚集地</p>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out 0.2s both; }
        .animate-shake { animation: shake 0.3s ease-out; }
      `}</style>
    </div>
  );
}
