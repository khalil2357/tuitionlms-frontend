import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { BookOpen, Award, CheckCircle, Clock, PlayCircle, BarChart3, GraduationCap } from 'lucide-react';

// Dummy data based on Prisma Schema
const mockStats = [
  { label: 'Active Courses', value: '4', icon: BookOpen, color: '#8B5CF6' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: '#10B981' },
  { label: 'Certificates', value: '3', icon: Award, color: '#F59E0B' },
  { label: 'Total Hours', value: '48h', icon: Clock, color: '#3B82F6' },
];

const mockEnrollments = [
  { id: '1', course: { title: 'Advanced React Patterns', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80', instructor: { name: 'Dan Abramov' } }, progress: 65, status: 'ACTIVE' },
  { id: '2', course: { title: 'Node.js Microservices', thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&q=80', instructor: { name: 'Ryan Dahl' } }, progress: 32, status: 'ACTIVE' },
  { id: '3', course: { title: 'UI/UX Design Masterclass', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', instructor: { name: 'Sarah Drasner' } }, progress: 100, status: 'COMPLETED' },
];

const mockQuizzes = [
  { id: '1', quiz: { title: 'React Hooks Quiz' }, score: 90, passed: true },
  { id: '2', quiz: { title: 'Express Middleware' }, score: 85, passed: true },
  { id: '3', quiz: { title: 'CSS Grid & Flexbox' }, score: 65, passed: false },
];

const Dashboard = () => {
  const { user, hydrated } = useAuthStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (hydrated && !user) {
      navigate('/login');
    }
  }, [hydrated, user, navigate]);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.children;
      gsap.fromTo(
        elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  if (!hydrated || !user) return null;

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8" ref={containerRef}>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Here's what's happening with your learning journey.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[rgba(139,92,246,0.1)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-all hover:bg-[rgba(139,92,246,0.2)]">
          <BookOpen className="h-4 w-4" />
          Browse New Courses
        </button>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150" style={{ background: stat.color }} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)]" style={{ color: stat.color }}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Enrollments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Enrollments</h2>
            <button className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">View All</button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mockEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] transition-all hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-strong)] to-transparent" />
                  <div className="absolute bottom-3 left-4 rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-primary)] backdrop-blur-md">
                    {enrollment.status}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-1 text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{enrollment.course.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">by {enrollment.course.instructor.name}</p>
                  
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs font-medium">
                      <span className="text-[var(--text-secondary)]">Progress</span>
                      <span className="text-[var(--accent)]">{enrollment.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#ec4899] transition-all duration-1000 ease-out"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface-soft)] py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--accent)] hover:text-white">
                    <PlayCircle className="h-4 w-4" />
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quizzes & Activities */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Quizzes</h2>
              <BarChart3 className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            
            <div className="space-y-4">
              {mockQuizzes.map((result) => (
                <div key={result.id} className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${result.passed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {result.passed ? <CheckCircle className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{result.quiz.title}</p>
                      <p className={`text-xs ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{result.score}</span>
                    <span className="text-xs text-[var(--text-muted)]">/100</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full text-center text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors">
              View All Results
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-strong)] to-[rgba(139,92,246,0.05)] p-6">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[linear-gradient(135deg,#8B5CF6,#ec4899)] flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Earn your next certificate</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You are 80% through the UI/UX Design Masterclass. Finish the final project to claim your certificate!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
