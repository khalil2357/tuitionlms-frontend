import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, BadgeCheck, CheckCircle2, CreditCard, Landmark, Loader2, Lock, Sparkles } from 'lucide-react';
import { courseService } from '../services/course.service';
import { enrollmentService } from '../services/enrollment.service';
import { useAuthStore } from '../store/useAuthStore';

type PaymentMode = 'offline' | 'online';

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, hydrated } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('offline');
  const [error, setError] = useState('');

  useEffect(() => {
    if (hydrated && !user) {
      navigate('/login', { state: { returnTo: `/checkout/${slug}` } });
    }
  }, [hydrated, navigate, slug, user]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (slug) {
          const data = await courseService.getCourseBySlug(slug);
          setCourse(data);
        }
      } catch {
        setError('Unable to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (course) {
      gsap.fromTo(
        '[data-checkout-reveal]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'expo.out' }
      );
    }
  }, [course]);

  const includes = useMemo(() => [
    'Lifetime access to this course',
    'Immediate dashboard enrollment for offline mode',
    'Certificate and progress tracking',
    'Online payments coming later',
  ], []);

  const handleEnroll = async () => {
    if (!course || !user) return;

    if (paymentMode === 'online') {
      setError('Online payment will be available later. Please choose offline enrollment for now.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await enrollmentService.enroll(course.id);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Enrollment failed.';

      if (String(message).toLowerCase().includes('already enrolled')) {
        navigate('/dashboard', { replace: true });
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--page-bg)]">
        <div className="h-12 w-12 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-6 py-14 sm:px-10 lg:px-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-6rem] left-[-6rem] h-80 w-80 rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute top-[15rem] right-[-5rem] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <div data-checkout-reveal className="flex items-center justify-between gap-4">
          <Link to={`/courses/${course.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)]/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-secondary)] backdrop-blur-xl transition-transform hover:-translate-x-1 hover:text-[var(--text-primary)]">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Course
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100 backdrop-blur-xl md:flex">
            <Sparkles className="h-4 w-4" />
            Offline enrollment ready
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <section data-checkout-reveal className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                  <BadgeCheck className="h-4 w-4" />
                  Secure course enrollment
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] sm:text-5xl">
                  Checkout for {course.title}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                  Select offline enrollment to instantly join the course and move to your dashboard. Online payment is planned for later and is shown here as a future option.
                </p>
              </div>

              <div className="rounded-[2rem] border border-cyan-300/15 bg-[#0b1220]/75 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/55">Course Price</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-4xl font-black tracking-tighter text-white">{course.price > 0 ? `৳${course.price}` : 'Free'}</span>
                  {course.discountPrice && <span className="pb-1 text-sm font-bold text-[var(--text-muted)] line-through">৳{course.discountPrice}</span>}
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                  <Landmark className="h-4 w-4" />
                  Offline enrollment: instant
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMode('offline')}
                className={`rounded-[1.6rem] border p-5 text-left transition-all ${paymentMode === 'offline' ? 'border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-[var(--surface-border)] bg-[var(--surface-soft)]/50 hover:border-cyan-300/20'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/55">Offline</p>
                    <h3 className="mt-2 text-lg font-black text-[var(--text-primary)]">Enroll now</h3>
                  </div>
                  <Landmark className="h-5 w-5 text-cyan-300" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Perfect for manual payments, cash collection, or offline confirmation. You’ll be enrolled immediately and redirected to your dashboard.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('online')}
                className={`rounded-[1.6rem] border p-5 text-left transition-all ${paymentMode === 'online' ? 'border-fuchsia-300/30 bg-fuchsia-400/10 shadow-[0_0_30px_rgba(217,70,239,0.1)]' : 'border-[var(--surface-border)] bg-[var(--surface-soft)]/50 hover:border-fuchsia-300/20'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-100/55">Online</p>
                    <h3 className="mt-2 text-lg font-black text-[var(--text-primary)]">Coming later</h3>
                  </div>
                  <CreditCard className="h-5 w-5 text-fuchsia-300" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Online payment support will arrive later. This option is visible so users understand the future checkout path.
                </p>
              </button>
            </div>

            <div className="mt-8 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-5">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">
                <Lock className="h-4 w-4 text-emerald-300" />
                What you get
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {includes.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/60 px-4 py-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside data-checkout-reveal className="space-y-6">
            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 shadow-2xl backdrop-blur-2xl">
              <div className="relative h-56 overflow-hidden">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Student-ready course</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{course.title}</h2>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Instructor</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{course.instructor?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Lessons</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{course.sections?.reduce((count: number, section: any) => count + section.lessons.length, 0)} lessons</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Language</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{course.language || 'English'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-cyan-300/15 bg-[#0b1220]/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-cyan-300" />
                <div>
                  <h3 className="text-sm font-black text-[var(--text-primary)]">Secure enrollment</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">Offline enrollment only for now</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEnroll}
                disabled={submitting || paymentMode === 'online'}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[1.4rem] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.22)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enroll Now'}
              </button>

              {paymentMode === 'online' && (
                <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                  Online payment is not enabled yet. Please choose offline enrollment to complete the course registration now.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
