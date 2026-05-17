import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  ArrowUp,
  BookOpen,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  Shield,
  Users,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Link groups ── */
const platform = [
  { label: 'Courses',     href: '/courses',     icon: BookOpen },
  { label: 'Instructors', href: '/instructors', icon: Users },
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Pricing',     href: '/pricing',     icon: GraduationCap },
];

const company = [
  { label: 'About',   href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog',    href: '/blog' },
  { label: 'Press',   href: '/press' },
];

const legal = [
  { label: 'Privacy Policy',    href: '/privacy' },
  { label: 'Terms of Service',  href: '/terms' },
  { label: 'Cookie Settings',   href: '/cookies' },
  { label: 'Accessibility',     href: '/accessibility' },
];

/* ═════════════════════════════════════════════════════════════ */
const Footer = () => {
  const footerRef     = useRef<HTMLElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subTextRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const col1Ref       = useRef<HTMLDivElement>(null);
  const col2Ref       = useRef<HTMLDivElement>(null);
  const col3Ref       = useRef<HTMLDivElement>(null);
  const bottomRef     = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);

  /* ── GSAP scroll-triggered reveals ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Glow orb parallax */
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      }

      /* Badge */
      gsap.fromTo(badgeRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: badgeRef.current, start: 'top 90%' },
        },
      );

      /* Headline */
      gsap.fromTo(headlineRef.current,
        { y: 44, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
          scrollTrigger: { trigger: headlineRef.current, start: 'top 88%' },
        },
      );

      /* Sub-text */
      gsap.fromTo(subTextRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: subTextRef.current, start: 'top 88%' },
        },
      );

      /* CTA strip */
      gsap.fromTo(ctaRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
        },
      );

      /* Link columns stagger */
      gsap.fromTo(
        [col1Ref.current, col2Ref.current, col3Ref.current],
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: col1Ref.current, start: 'top 88%' },
        },
      );

      /* Bottom bar */
      gsap.fromTo(bottomRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' },
        },
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  /* ── Hover helpers ── */
  const hIn  = (e: React.MouseEvent) =>
    gsap.to(e.currentTarget, { x: 4, duration: 0.18, ease: 'power2.out' });
  const hOut = (e: React.MouseEvent) =>
    gsap.to(e.currentTarget, { x: 0, duration: 0.18, ease: 'power2.out' });

  const pillIn  = (e: React.MouseEvent) =>
    gsap.to(e.currentTarget, { scale: 1.05, y: -2, duration: 0.2, ease: 'power2.out' });
  const pillOut = (e: React.MouseEvent) =>
    gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' });

  /* ── Back to top ── */
  const scrollTop = () => {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 0.9, ease: 'expo.inOut' });
  };

  /* ═══════════════ JSX ═══════════════ */
  return (
    <footer
      ref={footerRef}
      className="site-chrome relative overflow-hidden border-t border-[var(--surface-border)] bg-[var(--surface-strong)]"
    >
      {/* ── Background glow orb ── */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: '-160px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)',
        }}
      />

      {/* ── Subtle grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(var(--surface-border) 1px, transparent 1px), linear-gradient(90deg, var(--surface-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">

        {/* ══ Top section: headline + columns ══ */}
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* ── Brand column ── */}
          <div className="space-y-6">
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-1.5 text-xs text-[var(--text-secondary)] backdrop-blur">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#8B5CF6', boxShadow: '0 0 10px rgba(139,92,246,0.9)' }}
              />
              The modern LMS for ambitious learners
            </div>

            {/* Headline */}
            <h2
              ref={headlineRef}
              className="font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold leading-snug text-[var(--text-primary)] sm:text-4xl"
            >
              Build momentum with a smarter learning&nbsp;experience.
            </h2>

            {/* Sub text */}
            <p ref={subTextRef} className="text-sm leading-7 text-[var(--text-secondary)]">
              One unified platform for students, instructors, and administrators — with polished motion, real-time progress, and a design built for the next generation of online education.
            </p>

            {/* CTA buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <a
                href="/register"
                onMouseEnter={pillIn}
                onMouseLeave={pillOut}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white no-underline"
                style={{
                  background: 'linear-gradient(135deg,#8B5CF6 0%,#a855f7 60%,#ec4899 100%)',
                  boxShadow: '0 10px 30px rgba(139,92,246,0.35)',
                }}
              >
                Get started free
              </a>
              <a
                href="/courses"
                onMouseEnter={pillIn}
                onMouseLeave={pillOut}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] no-underline transition"
              >
                Browse courses
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, text: 'Secure & private' },
                { icon: GraduationCap, text: '10k+ learners' },
                { icon: Heart, text: '4.9 / 5 rating' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Platform links ── */}
          <div ref={col1Ref}>
            <p className="mb-5 text-[0.65rem] uppercase tracking-[0.38em] text-[var(--text-muted)]">Platform</p>
            <div className="space-y-2">
              {platform.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={hIn}
                  onMouseLeave={hOut}
                  className="flex items-center gap-2.5 rounded-lg py-1.5 text-sm text-[var(--text-secondary)] no-underline transition hover:text-[var(--text-primary)]"
                >
                  <item.icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Company links ── */}
          <div ref={col2Ref}>
            <p className="mb-5 text-[0.65rem] uppercase tracking-[0.38em] text-[var(--text-muted)]">Company</p>
            <div className="space-y-2">
              {company.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={hIn}
                  onMouseLeave={hOut}
                  className="block rounded-lg py-1.5 text-sm text-[var(--text-secondary)] no-underline transition hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Contact + Legal ── */}
          <div ref={col3Ref} className="space-y-8">
            <div>
              <p className="mb-5 text-[0.65rem] uppercase tracking-[0.38em] text-[var(--text-muted)]">Contact</p>
              <div className="space-y-3">
                <a
                  href="mailto:hello@tuitionlms.com"
                  onMouseEnter={hIn}
                  onMouseLeave={hOut}
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] no-underline transition hover:text-[var(--text-primary)]"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                  hello@tuitionlms.com
                </a>
                <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Remote — Worldwide
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.38em] text-[var(--text-muted)]">Legal</p>
              <div className="space-y-2">
                {legal.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onMouseEnter={hIn}
                    onMouseLeave={hOut}
                    className="block text-xs text-[var(--text-muted)] no-underline transition hover:text-[var(--text-secondary)]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ Divider ══ */}
        <div className="my-12 h-px bg-[var(--surface-border)]" />

        {/* ══ Bottom bar ══ */}
        <div
          ref={bottomRef}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#8B5CF6 0%,#ec4899 100%)' }}
            >
              TL
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              © {new Date().getFullYear()} Tuition LMS. All rights reserved.
            </span>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollTop}
            onMouseEnter={pillIn}
            onMouseLeave={pillOut}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
