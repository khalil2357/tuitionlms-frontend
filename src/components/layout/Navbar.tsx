import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MoonStar,
  Search,
  SunMedium,
  UserCircle2,
  Users,
  X,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

/* ── nav items – real routes, no dummy data ── */
const navItems = [
  { label: 'Home',        href: '/',            icon: BookOpen },
  { label: 'Courses',     href: '/courses',     icon: GraduationCap },
  { label: 'Instructors', href: '/instructors', icon: Users },
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
];

/* ═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { user, clearSession, hydrated } = useAuthStore();
  const location = useLocation();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [theme,       setTheme]       = useState<'dark' | 'light'>('dark');

  /* DOM refs */
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const headerRef       = useRef<HTMLElement>(null);
  const profileMenuRef  = useRef<HTMLDivElement>(null);
  const mobileMenuRef   = useRef<HTMLDivElement>(null);
  const searchOverlay   = useRef<HTMLDivElement>(null);
  const searchInput     = useRef<HTMLInputElement>(null);

  /* scroll state ref – avoids stale closure in scroll handler */
  const scrolledRef = useRef(false);
  /* timeline ref – built once */
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isLoggedIn = Boolean(user);

  /* ── initials ── */
  const initials = useMemo(() => {
    if (!user?.name) return 'TL';
    return user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }, [user?.name]);

  /* ── persist theme ── */
  useEffect(() => {
    const stored = localStorage.getItem('tuitionlms-theme');
    const pref   = stored === 'light' ? 'light' : 'dark';
    setTheme(pref);
    document.documentElement.classList.toggle('dark', pref === 'dark');
    document.documentElement.classList.toggle('light', pref === 'light');
  }, []);

  /* ── ONE-TIME entrance animation (mount only) ── */
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -90, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', delay: 0.05 },
    );
  }, []); // empty dep → only on mount, never on nav-item click

  /* ── Build GSAP timeline for pill ↔ full-width ── */
  useEffect(() => {
    if (!wrapperRef.current || !headerRef.current) return;

    tlRef.current = gsap
      .timeline({ paused: true })
      /* wrapper: 1280 px pill  →  full viewport */
      .to(wrapperRef.current, {
        maxWidth: '100vw',
        top:      0,
        paddingLeft:  0,
        paddingRight: 0,
        paddingTop:   0,
        duration: 0.52,
        ease: 'power3.inOut',
      }, 0)
      /* header: 100 px radius  →  0 px */
      .to(headerRef.current, {
        borderRadius: '0px',
        duration: 0.52,
        ease: 'power3.inOut',
      }, 0)
      /* shadow deepens */
      .to(headerRef.current, {
        boxShadow: '0 6px 40px rgba(0,0,0,0.30), 0 1px 0 rgba(139,92,246,0.2)',
        duration: 0.35,
        ease: 'power2.out',
      }, 0.18);

    /* ── Scroll listener ── */
    const onScroll = () => {
      const isDown = window.scrollY > 40;
      if (isDown === scrolledRef.current) return; // no change
      scrolledRef.current = isDown;
      if (isDown) {
        tlRef.current?.play();
      } else {
        tlRef.current?.reverse();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // empty dep → build once

  /* ── Profile dropdown open animation ── */
  useEffect(() => {
    if (profileOpen && profileMenuRef.current) {
      gsap.fromTo(
        profileMenuRef.current,
        { y: -12, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'expo.out' },
      );
    }
  }, [profileOpen]);

  /* ── Mobile menu open animation ── */
  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
      );
    }
  }, [mobileOpen]);

  /* ── Search overlay open animation ── */
  useEffect(() => {
    if (searchOpen && searchOverlay.current) {
      gsap.fromTo(
        searchOverlay.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.28, ease: 'power3.out' },
      );
      setTimeout(() => searchInput.current?.focus(), 50);
    }
  }, [searchOpen]);

  /* ── Click-outside: close profile ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-profile-menu]')) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  /* ── Esc: close search ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Toggle theme ── */
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark',  next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('tuitionlms-theme', next);
    gsap.fromTo('[data-theme-btn]',
      { rotate: -25, scale: 0.75 },
      { rotate: 0, scale: 1, duration: 0.45, ease: 'back.out(2.5)' },
    );
  };

  /* ── Hover helpers ── */
  const hoverIn  = (el: EventTarget) => gsap.to(el, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
  const hoverOut = (el: EventTarget) => gsap.to(el, { scale: 1,    duration: 0.2, ease: 'power2.out' });
  const linkIn   = (el: EventTarget) => gsap.to(el, { y: -2, duration: 0.18, ease: 'power2.out' });
  const linkOut  = (el: EventTarget) => gsap.to(el, { y:  0, duration: 0.18, ease: 'power2.out' });

  /* ════════════════════════════ JSX ═════════════════════════════ */
  return (
    <>
      {/* ── Floating wrapper – pill container ── */}
      <div
        ref={wrapperRef}
        className="fixed left-0 right-0 z-50 mx-auto"
        style={{
          maxWidth:     '1280px',
          top:          '1rem',
          paddingLeft:  '1rem',
          paddingRight: '1rem',
        }}
      >
        <header
          ref={headerRef}
          className="relative border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-2xl"
          style={{
            borderRadius: '100px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(139,92,246,0.1)',
            opacity: 0, /* starts invisible — entrance animation drives it in */
          }}
        >
          {/* inner glow accent */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.09) 0%, transparent 65%)' }}
          />

          <div className="relative flex items-center justify-between gap-4 px-5 py-3">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3 no-underline"
              onMouseEnter={e => linkIn(e.currentTarget)}
              onMouseLeave={e => linkOut(e.currentTarget)}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[1.2rem] text-xs font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg,#8B5CF6 0%,#a855f7 55%,#ec4899 100%)',
                  boxShadow:  '0 6px 22px rgba(139,92,246,0.45)',
                }}
              >
                TL
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-[0.58rem] uppercase tracking-[0.42em] text-[var(--text-muted)]">Platform</p>
                <p className="font-['Bricolage_Grotesque',sans-serif] text-[0.95rem] font-semibold text-[var(--text-primary)]">
                  Tuition LMS
                </p>
              </div>
            </Link>

            {/* ── Desktop nav links ── */}
            <nav className="hidden items-center gap-0.5 md:flex">
              {navItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    onMouseEnter={e => linkIn(e.currentTarget)}
                    onMouseLeave={e => linkOut(e.currentTarget)}
                    className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors no-underline"
                    style={{
                      color:      isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                    }}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2">

              {/* Search button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                onMouseEnter={e => hoverIn(e.currentTarget)}
                onMouseLeave={e => hoverOut(e.currentTarget)}
                className="hidden items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text-secondary)] md:flex"
              >
                <Search className="h-4 w-4" />
                Search
              </button>

              {/* Theme */}
              <button
                data-theme-btn
                type="button"
                onClick={toggleTheme}
                onMouseEnter={e => hoverIn(e.currentTarget)}
                onMouseLeave={e => hoverOut(e.currentTarget)}
                aria-label="Toggle theme"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-primary)]"
              >
                {theme === 'dark'
                  ? <SunMedium className="h-4 w-4" />
                  : <MoonStar  className="h-4 w-4" />
                }
              </button>

              {/* Profile */}
              <div className="relative" data-profile-menu>
                <button
                  type="button"
                  onClick={() => setProfileOpen(v => !v)}
                  onMouseEnter={e => hoverIn(e.currentTarget)}
                  onMouseLeave={e => hoverOut(e.currentTarget)}
                  className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] p-1.5 pr-3"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-[0.7rem] font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#8B5CF6,#ec4899)' }}
                  >
                    {hydrated && isLoggedIn
                      ? user?.avatar
                        ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        : initials
                      : <UserCircle2 className="h-4 w-4" />
                    }
                  </div>
                  <span className="hidden text-xs font-medium text-[var(--text-primary)] sm:block">
                    {isLoggedIn && user ? user.name?.split(' ')[0] : 'Sign in'}
                  </span>
                  <ChevronDown
                    className="hidden h-3.5 w-3.5 text-[var(--text-muted)] sm:block"
                    style={{ transition: 'transform 0.25s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-3 w-68 overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-2 shadow-[0_28px_72px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
                    style={{ minWidth: '260px' }}
                  >
                    {/* User card */}
                    <div className="m-1 rounded-[1.1rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg,#8B5CF6,#ec4899)' }}
                        >
                          {hydrated && isLoggedIn
                            ? user?.avatar
                              ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                              : initials
                            : <UserCircle2 className="h-5 w-5" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                            {isLoggedIn ? user?.name : 'Welcome'}
                          </p>
                          <p className="truncate text-xs text-[var(--text-muted)]">
                            {isLoggedIn ? user?.email : 'Sign in to access your account'}
                          </p>
                          {isLoggedIn && user?.role && (
                            <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-widest text-white"
                              style={{ background: 'var(--accent)' }}>
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="mt-1 space-y-0.5 p-1">
                      {isLoggedIn ? (
                        <>
                          {user?.role === 'ADMIN' && (
                            <DdLink href="/admin" icon={<Shield className="h-4 w-4" />} label="Admin Panel" />
                          )}
                          <DdLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
                          <DdLink href="/profile"   icon={<UserCircle2     className="h-4 w-4" />} label="My Profile" />
                          <DdLink href="/courses"   icon={<BookOpen        className="h-4 w-4" />} label="My Courses" />
                          <div className="mx-2 my-2 h-px bg-[var(--surface-border)]" />
                          <button
                            type="button"
                            onClick={() => { clearSession(); setProfileOpen(false); }}
                            className="flex w-full items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                            onMouseEnter={e => gsap.to(e.currentTarget, { x: 3, duration: 0.15, ease: 'power2.out' })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.15, ease: 'power2.out' })}
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <DdLink href="/login"    icon={<LogIn       className="h-4 w-4" />} label="Sign In" />
                          <DdLink href="/register" icon={<UserCircle2 className="h-4 w-4" />} label="Create Account" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                onMouseEnter={e => hoverIn(e.currentTarget)}
                onMouseLeave={e => hoverOut(e.currentTarget)}
                aria-label="Toggle menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-primary)] md:hidden"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile menu removed from header - now a sidebar below */}
        </header>
      </div>

      {/* ── Mobile Sidebar ── */}
      {mobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[280px] border-l border-[var(--surface-border)] bg-[var(--surface-strong)] p-6 shadow-2xl md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-bold text-[var(--text-primary)]">Menu</span>
              <button 
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-[var(--surface-soft)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[rgba(139,92,246,0.1)] hover:text-[var(--text-primary)] no-underline"
                  style={{
                    color:      location.pathname === '/admin' ? 'var(--accent)' : 'var(--text-secondary)',
                    background: location.pathname === '/admin' ? 'rgba(139,92,246,0.12)' : 'transparent',
                  }}
                >
                  <Shield className="h-5 w-5 text-[var(--accent)]" />
                  Admin Panel
                </Link>
              )}
              {navItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[rgba(139,92,246,0.1)] hover:text-[var(--text-primary)] no-underline"
                    style={{
                      color:      isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                    }}
                  >
                    <item.icon className="h-5 w-5 text-[var(--accent)]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div
            ref={searchOverlay}
            className="w-full max-w-xl overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 p-4">
              <Search className="h-5 w-5 shrink-0 text-[var(--accent)]" />
              <input
                ref={searchInput}
                type="text"
                placeholder="Search courses, instructors, topics…"
                className="flex-1 bg-transparent text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full border border-[var(--surface-border)] p-1.5 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-t border-[var(--surface-border)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
              Press <kbd className="rounded bg-[var(--surface-soft)] px-1.5 py-0.5 text-[0.62rem]">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}

      {/* Page spacer — always 80px tall */}
      <div style={{ height: '80px' }} />
    </>
  );
};

/* ── Dropdown link helper ── */
const DdLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link
    to={href}
    className="flex items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[rgba(139,92,246,0.12)] hover:text-[var(--text-primary)] no-underline"
    onMouseEnter={e => gsap.to(e.currentTarget, { x: 3, duration: 0.15, ease: 'power2.out' })}
    onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.15, ease: 'power2.out' })}
  >
    <span className="text-[var(--accent)]">{icon}</span>
    {label}
  </Link>
);

export default Navbar;
