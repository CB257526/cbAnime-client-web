import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { authStorage } from '../../utils/authStorage';
import { AxiosError } from 'axios';
import { Result } from '../../types/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password || !captchaCode) {
      setError('请填写所有字段');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ email, password, captchaCode });
      if (response.success && response.data) {
        authStorage.saveTokens(response.data);
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          authStorage.saveUser(userResponse.data);
          if (userResponse.data.role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err) {
      const axiosError = err as AxiosError<Result>;
      setError(axiosError.response?.data?.message || '登录失败，请检查邮箱、密码和验证码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff6b9d]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ffa726]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#ff6b9d]/3 to-transparent rounded-full" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMWE3YyIgc3Ryb2tlLXdpZHRoPSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#ff6b9d]/20 to-[#ffa726]/20 border border-[#ff6b9d]/20 backdrop-blur-sm">
            <svg className="w-10 h-10 text-[#ff6b9d]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            CB <span className="text-gradient bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] bg-clip-text text-transparent">Anime</span>
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">Enter the Gateway</p>
        </div>

        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20 animate-slide-up">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6b9d]/5 via-transparent to-[#ffa726]/5" />

          <form onSubmit={handleSubmit} className="relative space-y-6">
            {error && (
              <div className="animate-shake">
                <div className="bg-[#ff4757]/10 border border-[#ff4757]/30 rounded-xl px-4 py-3 text-sm text-[#ff4757] flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                邮箱地址
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-300" />
                <div className="relative flex items-center bg-[#12121a] rounded-xl border border-white/10 group-focus-within:border-[#ff6b9d]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-transparent text-white placeholder-white/30 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                密码
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-300" />
                <div className="relative flex items-center bg-[#12121a] rounded-xl border border-white/10 group-focus-within:border-[#ff6b9d]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-transparent text-white placeholder-white/30 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                验证码
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-300" />
                <div className="relative flex items-center bg-[#12121a] rounded-xl border border-white/10 group-focus-within:border-[#ff6b9d]/50 transition-all duration-300">
                  <svg className="w-5 h-5 ml-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <input
                    type="text"
                    value={captchaCode}
                    onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                    className="w-32 px-4 py-3.5 bg-transparent text-white placeholder-white/30 focus:outline-none"
                    placeholder="验证码"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleSendCaptcha}
                    disabled={captchaLoading || captchaCooldown > 0}
                    className="mr-1 px-4 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white hover:shadow-lg hover:shadow-[#ff6b9d]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {captchaLoading ? '...' : captchaCooldown > 0 ? `${captchaCooldown}s` : '获取'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative group w-full mt-2"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b9d] via-[#ff6b9d] to-[#ffa726] rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center justify-center py-3.5 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] rounded-xl text-white font-medium tracking-wide">
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                ) : '登录'}
              </div>
            </button>
          </form>

          <div className="relative mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-white/40">
              还没有账号？{' '}
              <Link to="/register" className="text-[#ff6b9d] hover:text-[#ffa726] transition-colors duration-300">
                立即注册
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-8 tracking-widest">
          © 2024 CB Anime · 二次元爱好者的聚集地
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out 0.2s both; }
        .animate-shake { animation: shake 0.3s ease-out; }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to));
        }
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}