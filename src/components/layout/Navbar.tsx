import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ChevronDown,
  LogOut,
  Menu,
  MoonStar,
  Search,
  SunMedium,
  UserCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { label: 'Home', href: '#' },
  { label: 'Courses', href: '#courses' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Pricing', href: '#pricing' },
];

const Navbar = () => {
  const { user, clearSession, hydrated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('tuitionlms-theme');
    const preferredTheme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(preferredTheme);
    document.documentElement.classList.toggle('dark', preferredTheme === 'dark');
    document.documentElement.classList.toggle('light', preferredTheme === 'light');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setProfileOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!profileMenuRef.current) {
      return;
    }

    gsap.fromTo(
      profileMenuRef.current,
      { y: -12, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power3.out' }
    );
  }, [profileOpen]);

  useEffect(() => {
    if (!mobileMenuRef.current) {
      return;
    }

    gsap.fromTo(
      mobileMenuRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
    );
  }, [mobileOpen]);

  const initials = useMemo(() => {
    if (!user?.name) {
      return 'TL';
    }

    return user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.name]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
    window.localStorage.setItem('tuitionlms-theme', nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-primary)] transition hover:scale-105 hover:bg-[rgba(139,92,246,0.14)] md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href="#" className="group flex items-center gap-3 text-[var(--text-primary)] no-underline">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-[#8B5CF6] to-fuchsia-500 text-lg font-semibold shadow-[0_20px_50px_rgba(139,92,246,0.35)] transition-transform duration-300 group-hover:scale-105">
              TL
            </div>
            <div className="leading-tight">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Tuition LMS
              </p>
              <h1 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-semibold text-[var(--text-primary)]">
                Learn faster. Teach better.
              </h1>
            </div>
          </a>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="navbar-link relative text-sm font-medium transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#8B5CF6] after:transition-all hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[rgba(139,92,246,0.12)] md:flex"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-primary)] transition duration-300 hover:scale-105 hover:bg-[#8B5CF6]/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>

          <div className="relative" data-profile-menu>
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="group flex items-center gap-3 rounded-[1.1rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] px-2 py-2 text-left text-[var(--text-primary)] transition hover:scale-[1.01] hover:bg-[rgba(139,92,246,0.12)]"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8B5CF6] to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
                {hydrated && isLoggedIn ? (
                  user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )
                ) : (
                  <UserCircle2 className="h-6 w-6" />
                )}
              </div>

              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  {isLoggedIn ? 'Profile' : 'Sign in'}
                </p>
                <p className="font-['Bricolage_Grotesque',sans-serif] text-sm font-semibold text-[var(--text-primary)]">
                  {isLoggedIn ? user?.name : 'Login / Register'}
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-[var(--text-muted)] sm:block" />
            </button>

            {profileOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                >
                  <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8B5CF6] to-fuchsia-500 text-sm font-semibold text-white">
                        {hydrated && isLoggedIn ? (
                          user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            initials
                          )
                        ) : (
                          <UserCircle2 className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-['Bricolage_Grotesque',sans-serif] text-base font-semibold text-[var(--text-primary)]">
                          {isLoggedIn ? user?.name : 'Sign in to continue'}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">{isLoggedIn ? user?.email : 'Use your account to unlock the dashboard'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <a
                      href="#"
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[rgba(139,92,246,0.12)] hover:text-[var(--text-primary)]"
                    >
                      <span>My Profile</span>
                      <UserCircle2 className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={clearSession}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[rgba(139,92,246,0.12)] hover:text-[var(--text-primary)]"
                    >
                      <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="border-t border-[var(--surface-border)] bg-[var(--surface-strong)] px-4 pb-4 md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-3 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="navbar-link-mobile flex items-center justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-3 transition hover:bg-[rgba(139,92,246,0.12)]"
                >
                  <span>{item.label}</span>
                  <span className="text-[#8B5CF6]">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
    </header>
  );
};

export default Navbar;
