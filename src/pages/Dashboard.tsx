import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuthStore } from '../store/useAuthStore';
import { BarChart3, BookOpen, Award, Users, Zap, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    /* Title entrance */
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0
      );
    }

    /* Cards entrance */
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('[data-card]');
      tl.fromTo(
        cards,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.1)', stagger: 0.1 },
        0.2
      );
    }
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '3', color: 'from-blue-600 to-blue-700' },
    { icon: BarChart3, label: 'Learning Hours', value: '24', color: 'from-purple-600 to-purple-700' },
    { icon: Award, label: 'Certificates', value: '2', color: 'from-pink-600 to-pink-700' },
    { icon: Zap, label: 'Streak', value: '5 days', color: 'from-cyan-600 to-cyan-700' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div ref={titleRef} className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400 text-xl">Here's your learning dashboard</p>
        </div>

        {/* Stats Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                data-card
                className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-2xl`}
              >
                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  </div>
                  <h2 className="text-4xl font-bold text-white mt-4">{stat.value}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses */}
          <div
            data-card
            className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Your Courses</h3>
            <div className="space-y-4">
              {[
                { name: 'React Fundamentals', progress: 65, status: 'In Progress' },
                { name: 'TypeScript Mastery', progress: 40, status: 'In Progress' },
                { name: 'Web Design Basics', progress: 100, status: 'Completed' },
              ].map((course, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-white">{course.name}</h4>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      course.status === 'Completed'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{course.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            data-card
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Quick Links</h3>
            <div className="space-y-3">
              <a href="/courses" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition group">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium group-hover:translate-x-1 transition">Browse Courses</span>
              </a>
              <a href="/instructors" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition group">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium group-hover:translate-x-1 transition">Find Instructors</span>
              </a>
              <a href="/profile" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition group">
                <Clock className="w-5 h-5 text-pink-400" />
                <span className="text-white font-medium group-hover:translate-x-1 transition">My Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
