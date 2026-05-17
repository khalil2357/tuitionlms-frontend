import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (containerRef.current && formRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
      tl.fromTo(
        formRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login({ email, password });
      setSession(data.access_token, data.user);
      navigate(returnTo || '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div 
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-30 pointer-events-none"
        style={{ background: 'var(--accent)' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: '#ec4899' }}
      />

      <div 
        ref={containerRef}
        className="w-full max-w-md relative z-10 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-8 shadow-[0_28px_72px_rgba(0,0,0,0.38)] backdrop-blur-3xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.2rem] text-xl font-bold text-white shadow-[0_6px_22px_rgba(139,92,246,0.45)]"
               style={{ background: 'linear-gradient(135deg,#8B5CF6 0%,#a855f7 55%,#ec4899 100%)' }}>
            TL
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Sign in to your account to continue</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-soft)] py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--accent)] focus:bg-[rgba(139,92,246,0.05)] focus:ring-1 focus:ring-[var(--accent)]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-soft)] py-3 pl-11 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--accent)] focus:bg-[rgba(139,92,246,0.05)] focus:ring-1 focus:ring-[var(--accent)]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-[0_4px_14px_0_var(--accent-glow)]"
            style={{ background: 'linear-gradient(135deg,#8B5CF6 0%,#a855f7 55%,#ec4899 100%)' }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors">
              Create one now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
