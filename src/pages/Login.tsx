import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, ChevronRight } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { setSession, user } = useAuthStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const leftGlowRef = useRef<HTMLDivElement>(null);
  const rightGlowRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  /* Pro Western Vibe GSAP Animations */
  useEffect(() => {
    const tl = gsap.timeline();

    /* Glow animations */
    if (leftGlowRef.current) {
      gsap.to(leftGlowRef.current, {
        y: 20,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (rightGlowRef.current) {
      gsap.to(rightGlowRef.current, {
        y: -20,
        opacity: 0.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    /* Title entrance - stagger characters */
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('span');
      tl.fromTo(
        chars,
        { y: 50, opacity: 0, rotation: -5 },
        { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.08 },
        0
      );
    }

    /* Form entrance with scale and blur */
    if (formRef.current) {
      tl.fromTo(
        formRef.current,
        { y: 60, opacity: 0, scale: 0.92, filter: 'blur(10px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.1)' },
        0.2
      );
    }

    /* Email field entrance */
    if (emailRef.current) {
      tl.fromTo(
        emailRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.4
      );
    }

    /* Password field entrance */
    if (passwordRef.current) {
      tl.fromTo(
        passwordRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.55
      );
    }

    /* Button entrance */
    if (buttonRef.current) {
      tl.fromTo(
        buttonRef.current,
        { y: 30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' },
        0.7
      );
    }

    return () => tl.kill();
  }, []);

  /* Mouse tracking for interactive glow */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        gsap.to(glowRef.current, {
          x: x - 50,
          y: y - 50,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setSession(response.access_token, response.user);

      /* Success animation before redirect */
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.4,
          ease: 'back.in(1.5)',
          onComplete: () => navigate('/dashboard'),
        });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);

      /* Error shake animation */
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 3,
          yoyo: true,
          ease: 'power2.inOut',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (ref?.current?.querySelector('input')) {
      gsap.to(ref.current, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleInputBlur = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (ref?.current) {
      gsap.to(ref.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden"
    >
      {/* Animated gradient background glows */}
      <div
        ref={leftGlowRef}
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        ref={rightGlowRef}
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-cyan-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Interactive mouse glow */}
      <div
        ref={glowRef}
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none top-0 left-0"
        style={{ zIndex: 0 }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Title */}
          <div ref={titleRef} className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 leading-tight">
              <span>Welcome</span>{' '}
              <span>Back</span>
            </h1>
            <p className="text-slate-400 text-lg">Sign in to your TuitionLMS account</p>
          </div>

          {/* Form Card */}
          <div
            ref={formRef}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Card glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none rounded-3xl" />

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium animate-in fade-in slide-in-from-top-4">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email Field */}
              <div
                ref={emailRef}
                onFocus={() => handleInputFocus(emailRef)}
                onBlur={() => handleInputBlur(emailRef)}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="relative w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition duration-300 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div
                ref={passwordRef}
                onFocus={() => handleInputFocus(passwordRef)}
                onBlur={() => handleInputBlur(passwordRef)}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="relative w-full pl-12 pr-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition duration-300 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition duration-300 hover:scale-110"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg bg-white/10 border border-white/20 cursor-pointer checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 checked:border-transparent transition"
                  />
                  <span className="text-slate-400 group-hover:text-slate-300 transition">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-slate-400 hover:text-blue-400 transition duration-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                ref={buttonRef}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative z-10">
              <div className="relative flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                <span className="px-3 text-slate-500 text-sm font-medium">or</span>
                <div className="flex-1 h-px bg-gradient-to-l from-white/10 to-transparent" />
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/register"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition duration-300 text-center block group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex items-center justify-center gap-2">
                Create Account
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition duration-300" />
              </div>
            </Link>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-300 transition duration-300 text-sm font-medium flex items-center justify-center gap-1 group"
            >
              <span className="group-hover:-translate-x-1 transition duration-300">←</span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
