import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Loader2,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Users2,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { enrollmentService } from '../services/enrollment.service';

const fallbackThumb = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070';

const Dashboard = () => {
  const { user, hydrated } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (hydrated && !user) {
      navigate('/login');
    }
  }, [hydrated, navigate, user]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await enrollmentService.myEnrollments();
        const records = Array.isArray(response)
          ? response
          : response?.enrollments ?? response?.data ?? [];

        setEnrollments(records);
      } catch {
        setError('Unable to load your enrollments right now.');
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
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [loading, enrollments]);

  const lessonsByEnrollment = (enrollment: any) =>
    enrollment?.course?.sections?.reduce((count: number, section: any) => count + (section?.lessons?.length || 0), 0) || 0;

  const normalizedEnrollments = useMemo(() => {
    return enrollments.map((enrollment) => ({
      ...enrollment,
      progress: enrollment?.progress ?? enrollment?.progressPercent ?? enrollment?.courseProgress ?? 0,
      course: enrollment?.course || {},
      status: enrollment?.status || 'ACTIVE',
    }));
  }, [enrollments]);

  const stats = useMemo(() => {
    const total = normalizedEnrollments.length;
    const completed = normalizedEnrollments.filter((item) => Number(item.progress) >= 100 || item.status === 'COMPLETED').length;
    const active = Math.max(total - completed, 0);
    const avgProgress = total
      ? Math.round(normalizedEnrollments.reduce((sum, item) => sum + Number(item.progress || 0), 0) / total)
      : 0;
    const totalLessons = normalizedEnrollments.reduce((sum, item) => sum + lessonsByEnrollment(item), 0);

    return [
      { label: 'Active Courses', value: String(active), hint: 'Courses in progress', icon: BookOpen, color: '#22d3ee' },
      { label: 'Completed', value: String(completed), hint: 'Finished learning paths', icon: CheckCircle2, color: '#34d399' },
      { label: 'Lesson Count', value: String(totalLessons), hint: 'Lessons unlocked', icon: Layers3, color: '#f472b6' },
      { label: 'Average Progress', value: `${avgProgress}%`, hint: 'Across your enrollments', icon: TrendingUp, color: '#fbbf24' },
    ];
  }, [normalizedEnrollments]);

  const featuredEnrollment = normalizedEnrollments[0];
  const recentActivity = useMemo(
    () => [
      { title: 'Enrollment synced', detail: 'Your course access is live in the student panel.' },
      { title: 'Learning streak ready', detail: 'Pick up where you left off from the latest lesson.' },
      { title: 'Certificate path active', detail: 'Complete lessons to unlock certificates.' },
    ],
    []
  );

  if (!hydrated || !user) {
    return null;
  }

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

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-[-6rem] top-[12rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-amber-300/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section data-dashboard-reveal className="overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                <BadgeCheck className="h-4 w-4" />
                Student control room
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                Your enrolled courses, progress, and learning activity are now connected to the live backend. This dashboard is built to feel as polished and structured as the admin panel, but focused on the student workflow.
              </p>
            </div>

            <div className="grid gap-3 rounded-[2rem] border border-[var(--surface-border)] bg-[#09111f]/80 p-5 sm:grid-cols-2 lg:min-w-[360px] lg:grid-cols-1">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/60">Current mode</p>
                    <h3 className="mt-1 text-sm font-black text-white">Learning with live enrollment</h3>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-400/10 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-fuchsia-300" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-100/60">Account status</p>
                    <h3 className="mt-1 text-sm font-black text-white">Ready for certificates</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-dashboard-reveal className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article key={stat.label} className="group relative overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[color:var(--accent)]/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_45%)]" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">{stat.label}</p>
                    <div className="mt-2 text-4xl font-black tracking-tighter text-[var(--text-primary)]">{stat.value}</div>
                    <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">{stat.hint}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]/80" style={{ color: stat.color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {error && (
          <section data-dashboard-reveal className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </section>
        )}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
          <main className="space-y-6">
            <section data-dashboard-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Live enrollments</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">Your courses</h2>
                </div>
                <Link to="/courses" className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-secondary)] transition-transform hover:-translate-y-0.5 hover:text-[var(--text-primary)]">
                  Browse courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-5">
                {normalizedEnrollments.length ? normalizedEnrollments.map((enrollment) => {
                  const lessons = lessonsByEnrollment(enrollment);
                  const progress = Math.max(0, Math.min(100, Number(enrollment.progress || 0)));
                  const isComplete = progress >= 100 || enrollment.status === 'COMPLETED';

                  return (
                    <article key={enrollment.id} className="grid gap-5 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-5">
                      <div className="relative overflow-hidden rounded-[1.5rem] min-h-[180px]">
                        <img
                          src={enrollment.course?.thumbnail || fallbackThumb}
                          alt={enrollment.course?.title || 'Enrolled course'}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur-xl">
                          {isComplete ? 'Completed' : 'Active'}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-5">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                              {enrollment.course?.category?.name || 'Course'}
                            </span>
                            <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">
                              {enrollment.status || 'ACTIVE'}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">{enrollment.course?.title || 'Untitled Course'}</h3>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">
                              by {enrollment.course?.instructor?.name || 'Tuition LMS'}
                            </p>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Progress</p>
                              <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{progress}%</p>
                            </div>
                            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Lessons</p>
                              <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{lessons}</p>
                            </div>
                            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Instructor</p>
                              <p className="mt-2 truncate text-lg font-black text-[var(--text-primary)]">{enrollment.course?.instructor?.name || 'Team'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                            <span>Learning progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <button className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.16)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
                          <PlayCircle className="h-4 w-4" />
                          Continue learning
                        </button>
                      </div>
                    </article>
                  );
                }) : (
                  <div className="rounded-[2rem] border border-dashed border-[var(--surface-border)] bg-[var(--surface-soft)]/40 p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-2xl font-black tracking-tight text-[var(--text-primary)]">No enrollments yet</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      Enroll in a course to see your progress, lesson count, and certificate path here.
                    </p>
                    <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] transition-transform hover:-translate-y-0.5">
                      Explore courses
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section data-dashboard-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Learning compass</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">Today’s focus</h2>
                </div>
                <BarChart3 className="h-5 w-5 text-cyan-300" />
              </div>

              {featuredEnrollment ? (
                <div className="mt-6 space-y-4 rounded-[1.6rem] border border-cyan-300/15 bg-cyan-400/10 p-5">
                  <img src={featuredEnrollment.course?.thumbnail || fallbackThumb} alt={featuredEnrollment.course?.title || 'Featured course'} className="h-40 w-full rounded-[1.25rem] object-cover" />
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">{featuredEnrollment.course?.title}</h3>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    Resume from your latest progress and keep the momentum going. This course is the first live enrollment tied to your account.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Progress</p>
                      <p className="mt-2 text-3xl font-black text-white">{Math.max(0, Math.min(100, Number(featuredEnrollment.progress || 0)))}%</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Lessons</p>
                      <p className="mt-2 text-3xl font-black text-white">{lessonsByEnrollment(featuredEnrollment)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.6rem] border border-dashed border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-5 text-sm leading-6 text-[var(--text-secondary)]">
                  Your first enrollment will appear here as soon as you complete checkout.
                </div>
              )}
            </section>

            <section data-dashboard-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Recent activity</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">Learning log</h2>
                </div>
                <Clock3 className="h-5 w-5 text-fuchsia-300" />
              </div>

              <div className="mt-5 space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.title} className="rounded-[1.4rem] border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#d946ef)] text-[#050816] shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[var(--text-primary)]">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section data-dashboard-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-strong)] to-[rgba(34,211,238,0.05)] p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#d946ef)] text-[#050816] shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--text-primary)]">Need more courses?</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Browse the catalog to add more live enrollments and build out your learning dashboard.
              </p>
              <Link to="/courses" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] transition-transform hover:-translate-y-0.5">
                Browse catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
