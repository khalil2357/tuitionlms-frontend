import Layout from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react';

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
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 shadow-lg backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
            Premium learning platform UI
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl font-['Bricolage_Grotesque',sans-serif] text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Elegant, animated navigation for Tuition LMS.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/70">
              A modern navbar and footer with GSAP motion, responsive interactions, profile/avatar state,
              and a dual-theme visual system built around <span className="text-white">#8B5CF6</span> and{' '}
              <span className="text-white">#1E1E1E</span>.
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
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Clear Profile
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: GraduationCap, title: 'Student-first', text: 'Avatar and profile state update on login.' },
              { icon: ShieldCheck, title: 'Secure', text: 'Token-aware header integration for backend calls.' },
              { icon: Users, title: 'Responsive', text: 'Desktop and mobile menu states with motion.' },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <Icon className="h-5 w-5 text-[#8B5CF6]" />
                <h2 className="mt-4 font-['Bricolage_Grotesque',sans-serif] text-xl font-semibold text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(139,92,246,0.18),rgba(255,255,255,0.05))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[#111111]/85 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Preview card</p>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8B5CF6] to-fuchsia-500 text-lg font-semibold text-white">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : 'TL'}
              </div>
              <div>
                <p className="font-['Bricolage_Grotesque',sans-serif] text-lg font-semibold text-white">
                  {user ? user.name : 'Guest User'}
                </p>
                <p className="text-sm text-white/60">{user ? user.email : 'Login to reveal the profile state'}</p>
              </div>
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Theme</p>
                <p className="mt-2 text-base font-semibold text-white">Dark / Light ready</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Motion</p>
                <p className="mt-2 text-base font-semibold text-white">GSAP animated panels</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default App
