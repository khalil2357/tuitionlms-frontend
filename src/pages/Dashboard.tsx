import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Award, BadgeCheck, BookOpen, GraduationCap, Loader2, PlayCircle, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { enrollmentService } from '../services/enrollment.service';

const Dashboard = () => {
  const { user, hydrated } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (hydrated && !user) {
      navigate('/login');
    }
  }, [hydrated, navigate, user]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;

      try {
        const response = await enrollmentService.myEnrollments();
        const records = Array.isArray(response) ? response : response?.enrollments ?? response?.data ?? [];
        setEnrollments(records);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('[data-dashboard-reveal]'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [loading, enrollments]);

  const normalizedEnrollments = useMemo(
    () =>
      enrollments.map((enrollment) => ({
        ...enrollment,
        progress: enrollment?.progress ?? enrollment?.progressPercent ?? enrollment?.courseProgress ?? 0,
        course: enrollment?.course || {},
      })),
    [enrollments]
  );

  const stats = useMemo(() => {
    const total = normalizedEnrollments.length;
    const completed = normalizedEnrollments.filter((item) => Number(item.progress) >= 100).length;
    const avgProgress = total
      ? Math.round(normalizedEnrollments.reduce((sum, item) => sum + Number(item.progress || 0), 0) / total)
      : 0;

    return [
      { label: 'Active', value: Math.max(total - completed, 0) },
      { label: 'Done', value: completed },
      { label: 'Progress', value: `${avgProgress}%` },
    ];
  }, [normalizedEnrollments]);

  if (!hydrated || !user) return null;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--page-bg)]">
        <div className="flex items-center gap-3 rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
          Loading your dashboard
        </div>
      </div>
    );
  }

  const openPlayer = (slug?: string) => {
    if (slug) {
      navigate(`/player/${slug}`);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-[-6rem] top-[12rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section data-dashboard-reveal className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
              <BadgeCheck className="h-4 w-4" />
              Student dashboard
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] sm:text-5xl lg:text-6xl">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">Your courses and progress are synced here.</p>
            <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[#09111f]/80 px-5 py-4 md:max-w-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Award className="h-5 w-5 text-fuchsia-300" />
                Ready for certificates
              </div>
            </div>
          </div>
        </section>

        <section data-dashboard-reveal className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-5 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">{stat.label}</p>
              <div className="mt-2 text-3xl font-black tracking-tighter text-[var(--text-primary)]">{stat.value}</div>
            </article>
          ))}
        </section>

        <section data-dashboard-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Courses</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">Your enrollments</h2>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-secondary)] transition-transform hover:-translate-y-0.5 hover:text-[var(--text-primary)]">
              Browse
            </Link>
          </div>

          <div className="mt-6 grid gap-5">
            {normalizedEnrollments.length ? (
              normalizedEnrollments.map((enrollment) => {
                const progress = Math.max(0, Math.min(100, Number(enrollment.progress || 0)));

                return (
                  <article key={enrollment.id} className="grid gap-4 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-4 sm:grid-cols-[190px_minmax(0,1fr)] sm:p-5">
                    <div className="relative overflow-hidden rounded-[1.5rem] min-h-[150px]">
                      <img src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'} alt={enrollment.course?.title || 'Course'} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">{enrollment.status || 'Active'}</p>
                        <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{enrollment.course?.title || 'Untitled Course'}</h3>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">by {enrollment.course?.instructor?.name || 'Tuition LMS'}</p>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openPlayer(enrollment.course?.slug)}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.16)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Continue
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[var(--surface-border)] bg-[var(--surface-soft)]/40 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-[var(--text-primary)]">No enrollments yet</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Enroll in a course to see it here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
