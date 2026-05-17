import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, CheckCircle2, Clock3, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { courseService } from '../services/course.service';
import { enrollmentService } from '../services/enrollment.service';
import { useAuthStore } from '../store/useAuthStore';

type Lesson = {
  id: string;
  title: string;
  duration?: number;
  isPreview?: boolean;
  content?: string;
};

const dummyVideoSources: Record<string, string> = {
  'web-development-masterclass': 'https://www.w3schools.com/html/mov_bbb.mp4',
  'react-from-zero': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'ui-ux-design-bootcamp': 'https://www.w3schools.com/html/movie.mp4',
};

const defaultVideoSource = 'https://www.w3schools.com/html/mov_bbb.mp4';

const CoursePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!slug) return;
        const data = await courseService.getCourseBySlug(slug);
        setCourse(data);

        const firstLesson = data?.sections?.flatMap((section: any) => section.lessons || [])?.[0] || null;
        setActiveLesson(firstLesson);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!slug || !user) return;

      try {
        const response = await enrollmentService.myEnrollments();
        const records = Array.isArray(response) ? response : response?.enrollments ?? response?.data ?? [];
        const currentEnrollment = records.find((enrollment: any) => enrollment?.course?.slug === slug);

        if (currentEnrollment) {
          setEnrollmentId(currentEnrollment.id);
          const progress = Number(currentEnrollment.progress ?? currentEnrollment.progressPercent ?? 0);
          const courseLessons = currentEnrollment?.course?.sections?.flatMap((section: any) => section.lessons || []) || [];
          const completedCount = Math.max(0, Math.min(courseLessons.length, Math.round((progress / 100) * courseLessons.length)));
          setCompletedLessonIds(courseLessons.slice(0, completedCount).map((lesson: Lesson) => lesson.id));
        }
      } catch {
        setEnrollmentId(null);
      }
    };

    fetchEnrollment();
  }, [slug, user]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        '[data-player-reveal]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, course]);

  const lessons = useMemo(
    () => course?.sections?.flatMap((section: any) => section.lessons || []) || [],
    [course]
  );

  const progressPercent = lessons.length ? Math.round((completedLessonIds.length / lessons.length) * 100) : 0;
  const activeVideoSource = course ? dummyVideoSources[course.slug] || defaultVideoSource : defaultVideoSource;

  const handleCompleteLesson = async () => {
    if (!currentLesson) return;

    setCompletedLessonIds((current) => {
      if (current.includes(currentLesson.id)) {
        return current;
      }

      const nextCompleted = [...current, currentLesson.id];

      if (enrollmentId) {
        const nextProgress = lessons.length ? Math.round((nextCompleted.length / lessons.length) * 100) : 0;
        setSavingProgress(true);
        enrollmentService.updateProgress(enrollmentId, nextProgress)
          .catch(() => null)
          .finally(() => setSavingProgress(false));
      }

      const currentIndex = lessons.findIndex((lesson: Lesson) => lesson.id === currentLesson.id);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson) {
        setActiveLesson(nextLesson);
      }

      return nextCompleted;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] px-6">
        <div className="rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] shadow-2xl backdrop-blur-xl">
          Loading player...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--page-bg)] px-6 text-center">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Course not found</h1>
        <Link to="/dashboard" className="rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816]">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentLesson = activeLesson || lessons[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-[-6rem] top-[10rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <header data-player-reveal className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 px-5 py-4 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-1">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">{course.title}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
            <ShieldCheck className="h-4 w-4" />
            Minimal player
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.5fr)]">
          <main className="space-y-6">
            <section data-player-reveal className="overflow-hidden rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 shadow-2xl backdrop-blur-2xl">
              <div className="relative aspect-video bg-[#050816]">
                <video
                  key={activeVideoSource}
                  src={activeVideoSource}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur-xl transition-transform hover:scale-[1.02]"
                  onClick={() => currentLesson && setActiveLesson(currentLesson)}
                >
                  Play lesson
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/75">Now playing</p>
                    <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{currentLesson?.title || 'Start the course'}</h2>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] backdrop-blur-xl sm:inline-flex">
                    <Clock3 className="h-4 w-4" />
                    {currentLesson?.duration || 0} min
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
                    {course.language || 'English'}
                  </span>
                  <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)]/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {lessons.length} lessons
                  </span>
                </div>
                <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  A minimal, focused player with just enough structure to keep learning frictionless.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCompleteLesson}
                    disabled={savingProgress || !currentLesson}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete This Lesson
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    Progress tracked: {progressPercent}%
                  </span>
                </div>
              </div>
            </section>

            <section data-player-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Lesson notes</p>
                  <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{currentLesson?.title || 'Select a lesson'}</h3>
                </div>
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                {currentLesson?.content || 'Choose any lesson from the side panel to continue.'}
              </p>
            </section>
          </main>

          <aside className="space-y-6">
            <section data-player-reveal className="rounded-[2.2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/80 p-5 shadow-2xl backdrop-blur-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Lessons</p>
              <div className="mt-4 space-y-3">
                {lessons.length ? (
                  lessons.map((lesson: Lesson) => {
                    const active = activeLesson?.id === lesson.id || (!activeLesson && currentLesson?.id === lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${active ? 'border-cyan-300/30 bg-cyan-400/10' : 'border-[var(--surface-border)] bg-[var(--surface-soft)]/50 hover:border-cyan-300/20'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-[var(--text-primary)]">{lesson.title}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">{lesson.isPreview ? 'Preview' : 'Locked'}</p>
                          </div>
                          <CheckCircle2 className={`h-5 w-5 ${completedLessonIds.includes(lesson.id) ? 'text-emerald-300' : active ? 'text-cyan-300' : 'text-[var(--text-muted)]'}`} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-[var(--surface-border)] bg-[var(--surface-soft)]/50 p-5 text-sm text-[var(--text-secondary)]">
                    No lessons available yet.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
