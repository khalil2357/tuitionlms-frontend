import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Layers,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const stats = [
  { value: '25k+', label: 'Active learners' },
  { value: '1,200+', label: 'Video lessons' },
  { value: '98%', label: 'Completion rate' },
  { value: '4.9', label: 'Average rating' },
];

const features = [
  { icon: BookOpen, title: 'Structured Courses', desc: 'Modular lessons with quizzes, assignments, and progress tracking built right in.' },
  { icon: PlayCircle, title: 'Live & Recorded', desc: 'Join live sessions or learn at your own pace with on-demand video content.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track learner engagement, completion rates, and performance at a glance.' },
  { icon: ShieldCheck, title: 'Secure Platform', desc: 'Enterprise-grade auth, encrypted data, and role-based access controls.' },
  { icon: Users, title: 'Community', desc: 'Discussion forums, peer reviews, and collaborative study groups.' },
  { icon: Award, title: 'Certificates', desc: 'Auto-generated certificates of completion to showcase achievements.' },
];

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up in seconds and set up your learner or instructor profile.' },
  { num: '02', title: 'Browse & enroll', desc: 'Explore curated courses and enroll with a single click.' },
  { num: '03', title: 'Learn & grow', desc: 'Watch lessons, complete assignments, and earn certificates.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'UX Designer', quote: 'Tuition LMS transformed how I upskill. The interface is incredibly intuitive.', rating: 5 },
  { name: 'James Okafor', role: 'Software Engineer', quote: 'Best learning platform I\'ve used. The progress tracking keeps me motivated.', rating: 5 },
  { name: 'Maria Santos', role: 'Data Analyst', quote: 'Clean design, great content. I completed three certifications in two months.', rating: 5 },
];

/* ═══════════════════════════════════════════════════════════════ */
const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero entrance */
      gsap.fromTo('[data-hero-badge]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 });
      gsap.fromTo('[data-hero-h1]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.35 });
      gsap.fromTo('[data-hero-p]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 });
      gsap.fromTo('[data-hero-btns]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.65 });

      /* Stats counter entrance */
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        });
      }

      /* Features grid */
      if (featRef.current) {
        gsap.fromTo(featRef.current.querySelectorAll('[data-feat]'), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: featRef.current, start: 'top 82%' },
        });
      }

      /* Steps */
      if (stepsRef.current) {
        gsap.fromTo(stepsRef.current.querySelectorAll('[data-step]'), { x: -30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: stepsRef.current, start: 'top 82%' },
        });
      }

      /* Testimonials */
      if (testRef.current) {
        gsap.fromTo(testRef.current.querySelectorAll('[data-test]'), { y: 30, opacity: 0, scale: 0.97 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: testRef.current, start: 'top 82%' },
        });
      }

      /* CTA */
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  /* Hover helpers */
  const hIn = (e: React.MouseEvent) => gsap.to(e.currentTarget, { y: -4, scale: 1.02, duration: 0.25, ease: 'power2.out' });
  const hOut = (e: React.MouseEvent) => gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });

  return (
    <>
      {/* ════════════════════ HERO ════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)' }} />
          <div className="absolute -right-32 top-48 h-[400px] w-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%)' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div data-hero-badge className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-5 py-2 text-sm text-[var(--text-secondary)] backdrop-blur" style={{ opacity: 0 }}>
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              The modern learning platform
            </div>

            {/* Headline */}
            <h1 data-hero-h1 className="font-['Bricolage_Grotesque',sans-serif] text-5xl font-bold leading-[1.1] text-[var(--text-primary)] sm:text-6xl lg:text-7xl" style={{ opacity: 0 }}>
              Learn without{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                limits
              </span>
              .{' '}
              <br className="hidden sm:block" />
              Teach with{' '}
              <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#8B5CF6] bg-clip-text text-transparent">
                confidence
              </span>
              .
            </h1>

            {/* Sub */}
            <p data-hero-p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]" style={{ opacity: 0 }}>
              A premium LMS built for students who want structured learning paths, instructors who need powerful tools, and admins who demand visibility.
            </p>

            {/* CTAs */}
            <div data-hero-btns className="mt-10 flex flex-wrap items-center justify-center gap-4" style={{ opacity: 0 }}>
              <a
                href="/register"
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: 'power2.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' })}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white no-underline"
                style={{ background: 'linear-gradient(135deg,#8B5CF6 0%,#a855f7 60%,#ec4899 100%)', boxShadow: '0 14px 40px rgba(139,92,246,0.35)' }}
              >
                Start learning free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/courses"
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: 'power2.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' })}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-7 py-3.5 text-sm font-medium text-[var(--text-primary)] no-underline backdrop-blur transition"
              >
                <PlayCircle className="h-4 w-4 text-[var(--accent)]" />
                Watch demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ STATS ════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div ref={statsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <div
              key={s.label}
              onMouseEnter={hIn}
              onMouseLeave={hOut}
              className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-6 text-center backdrop-blur transition"
            >
              <p className="font-['Bricolage_Grotesque',sans-serif] text-3xl font-bold text-[var(--text-primary)]">{s.value}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">Why Tuition LMS</p>
          <h2 className="mt-3 font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            Everything you need to learn and teach
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">A unified platform with tools designed for every stage of the learning journey.</p>
        </div>
        <div ref={featRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <div
              key={f.title}
              data-feat
              onMouseEnter={hIn}
              onMouseLeave={hOut}
              className="group rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-6 backdrop-blur transition"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-[rgba(139,92,246,0.12)]">
                <f.icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-lg font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 55%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">How it works</p>
            <h2 className="mt-3 font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
              Three steps to start learning
            </h2>
          </div>
          <div ref={stepsRef} className="grid gap-6 lg:grid-cols-3">
            {steps.map(s => (
              <div
                key={s.num}
                data-step
                onMouseEnter={hIn}
                onMouseLeave={hOut}
                className="relative rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-7 backdrop-blur transition"
              >
                <span className="font-['Bricolage_Grotesque',sans-serif] text-5xl font-bold text-[rgba(139,92,246,0.15)]">{s.num}</span>
                <h3 className="mt-3 font-['Bricolage_Grotesque',sans-serif] text-xl font-semibold text-[var(--text-primary)]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{s.desc}</p>
                <CheckCircle2 className="absolute right-5 top-5 h-5 w-5 text-[var(--accent)] opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">Testimonials</p>
          <h2 className="mt-3 font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            Loved by learners worldwide
          </h2>
        </div>
        <div ref={testRef} className="grid gap-5 lg:grid-cols-3">
          {testimonials.map(t => (
            <div
              key={t.name}
              data-test
              onMouseEnter={hIn}
              onMouseLeave={hOut}
              className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-6 backdrop-blur transition"
            >
              <div className="mb-3 flex gap-0.5 text-[#fbbf24]">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm leading-6 text-[var(--text-secondary)] italic">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#8B5CF6,#ec4899)' }}>
                  {t.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div
          ref={ctaRef}
          className="relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.12) 100%)', border: '1px solid var(--surface-border)' }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
          <div className="relative">
            <Zap className="mx-auto mb-4 h-8 w-8 text-[var(--accent)]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Ready to start your journey?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--text-secondary)]">
              Join thousands of learners who are building skills, earning certificates, and advancing their careers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/register"
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: 'power2.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' })}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white no-underline"
                style={{ background: 'linear-gradient(135deg,#8B5CF6,#ec4899)', boxShadow: '0 12px 36px rgba(139,92,246,0.35)' }}
              >
                Get started — it's free
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <Layers className="h-4 w-4" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
