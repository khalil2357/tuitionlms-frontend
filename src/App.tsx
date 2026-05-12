import Layout from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

function App() {
  const { user, setSession, clearSession } = useAuthStore();

  const loginDemo = () => {
    setSession('demo-token', {
      id: 'demo-user',
      name: 'Ariana Stone',
      email: 'ariana@tuitionlms.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      role: 'student',
    });
  };

  return (
    <Layout>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text-secondary)] shadow-lg backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
            Premium learning platform for students, instructors, and admins
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl font-['Bricolage_Grotesque',sans-serif] text-5xl font-semibold leading-tight text-[var(--text-primary)] sm:text-6xl">
              Learn, launch, and lead with Tuition LMS.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              A modern LMS experience with animated navigation, smart theme switching, profile-aware
              interactions, and a strong learning-first visual system built around{' '}
              <span className="text-[var(--text-primary)]">#8B5CF6</span> and{' '}
              <span className="text-[var(--text-primary)]">#1E1E1E</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={loginDemo}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#8B5CF6] px-6 py-3 font-medium text-white shadow-[0_18px_40px_rgba(139,92,246,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#9d73ff]"
            >
              {user ? 'Switch Demo Profile' : 'Login Demo Profile'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearSession}
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] px-6 py-3 font-medium text-[var(--text-primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(139,92,246,0.12)]"
            >
              Clear Profile
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: GraduationCap, title: 'Student-first', text: 'Focused learning paths and progress visibility.' },
              { icon: ShieldCheck, title: 'Secure', text: 'Backend-ready auth and profile-aware navigation.' },
              { icon: Users, title: 'Responsive', text: 'Mobile-first layouts and modern motion transitions.' },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-[rgba(139,92,246,0.12)]"
              >
                <Icon className="h-5 w-5 text-[#8B5CF6]" />
                <h2 className="mt-4 font-['Bricolage_Grotesque',sans-serif] text-xl font-semibold text-[var(--text-primary)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(139,92,246,0.18),rgba(255,255,255,0.05))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="space-y-4 rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Preview card</p>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8B5CF6] to-fuchsia-500 text-lg font-semibold text-white">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : 'TL'}
              </div>
              <div>
                <p className="font-['Bricolage_Grotesque',sans-serif] text-lg font-semibold text-[var(--text-primary)]">
                  {user ? user.name : 'Welcome back'}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{user ? user.email : 'Sign in to unlock the profile view'}</p>
              </div>
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Theme</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">Dark / Light ready</p>
              </div>
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Motion</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">GSAP animated panels</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-5">
              <PlayCircle className="h-6 w-6 text-[#8B5CF6]" />
              <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Live classes</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Flexible scheduling</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-5">
              <BookOpen className="h-6 w-6 text-[#8B5CF6]" />
              <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Course library</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Structured learning tracks</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Trusted by learners</p>
              <div className="mt-2 flex items-center gap-1 text-[#fbbf24]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">4.9/5</p>
              <p className="text-sm text-[var(--text-secondary)]">From student reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Learn faster', text: 'Guided lessons, quizzes, and progress tracking in one place.' },
            { title: 'Teach smarter', text: 'Instructor ownership, analytics, and streamlined course tools.' },
            { title: 'Admin control', text: 'Approve instructors, monitor activity, and manage the platform.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-6 backdrop-blur"
            >
              <BriefcaseBusiness className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="mt-4 font-['Bricolage_Grotesque',sans-serif] text-2xl font-semibold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" id="courses">
        <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-8 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Important sections</p>
              <h2 className="mt-3 font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold text-[var(--text-primary)]">
                Everything a strong LMS homepage should show.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Students can explore courses, instructors, and outcomes. Teachers can manage content and
              monitor progress. Admins can keep the system healthy from one dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              'Featured programs and categories',
              'Instructor spotlight and social proof',
              'Progress, certificates, and analytics preview',
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default App
