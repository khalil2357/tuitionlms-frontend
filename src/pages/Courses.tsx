import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Search, 
  BookOpen, 
  Star, 
  Layers,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { courseService } from '../services/course.service';

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          courseService.getCourses({ limit: 100 }),
          courseService.getCategories()
        ]);
        setCourses(coursesRes.data);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power4.out',
          clearProps: 'all'
        }
      );
    }
  }, [loading, selectedCategory, search]);

  const updateLiquidCursor = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const activateLiquidCursor = (event: React.MouseEvent<HTMLAnchorElement>) => {
    updateLiquidCursor(event);
    event.currentTarget.style.setProperty('--liquid-opacity', '1');
  };

  const deactivateLiquidCursor = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--liquid-opacity', '0');
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={containerRef} className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest animate-pulse">
          <TrendingUp className="h-3 w-3" />
          Intellectual Advancement
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[0.9] text-[var(--text-primary)]">
          Master Any Skill <br />
          <span className="text-[var(--accent)]">Without Limits.</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg font-medium leading-relaxed max-w-xl">
          High-fidelity digital curriculums designed by industry architects. 
          Synchronous learning meets asynchronous execution.
        </p>
      </div>

      {/* Modern Filter Bar */}
      <div className="sticky top-24 z-40 p-2 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)]/80 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4 transition-all hover:border-[var(--accent)]/30">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search curricula nodes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none px-14 py-4 text-sm font-bold focus:ring-0 placeholder:text-[var(--text-muted)]"
          />
        </div>
        
        <div className="h-10 w-px bg-[var(--surface-border)] hidden md:block" />

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 px-4 max-w-full no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === 'all' 
              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
            }`}
          >
            All Curricula
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.id 
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[420px] rounded-[2.5rem] bg-[var(--surface-soft)] animate-pulse border border-[var(--surface-border)]" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link 
              to={`/courses/${course.slug}`} 
              key={course.id}
              onMouseMove={updateLiquidCursor}
              onMouseEnter={activateLiquidCursor}
              onMouseLeave={deactivateLiquidCursor}
              style={{
                ['--mouse-x' as any]: '50%',
                ['--mouse-y' as any]: '50%',
                ['--liquid-opacity' as any]: 0,
              }}
              className="liquid-hover course-card group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl transition-all hover:-translate-y-2 hover:border-cyan-300/40 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]"
            >
              <div
                className="absolute inset-0 opacity-[var(--liquid-opacity)] transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.45), transparent 26%), radial-gradient(circle at calc(var(--mouse-x) + 70px) calc(var(--mouse-y) + 50px), rgba(217,70,239,0.22), transparent 22%), radial-gradient(circle at calc(var(--mouse-x) - 40px) calc(var(--mouse-y) - 30px), rgba(251,191,36,0.16), transparent 18%)',
                  filter: 'blur(18px)',
                  mixBlendMode: 'screen',
                }}
              />
              <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.06),rgba(217,70,239,0.05),rgba(251,191,36,0.04))]" />
                <div className="absolute -inset-px rounded-[2.5rem] border border-cyan-300/20 shadow-[inset_0_0_40px_rgba(34,211,238,0.12)]" />
              </div>

              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.12),transparent_18%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-cyan-300/20 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                    {course.category?.name || 'Academic'}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-cyan-300/15 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-white">4.9 (2k+)</span>
                   </div>
                   <div className="text-xl font-black text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight line-clamp-2 transition-colors group-hover:text-cyan-200">
                    {course.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-[11px] font-bold leading-relaxed line-clamp-2">
                    {course.shortDescription || 'Advance your technical capabilities with this professional-grade curriculum.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--surface-border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--surface-soft)] border border-cyan-300/15 flex items-center justify-center overflow-hidden shadow-[0_0_18px_rgba(34,211,238,0.08)]">
                      {course.instructor?.avatar ? (
                        <img src={course.instructor.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-black">{course.instructor?.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[var(--text-primary)]">{course.instructor?.name}</p>
                      <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Instructor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <Layers className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase">{course._count?.sections || 0} Nodes</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Arrow Overlay */}
              <div className="absolute bottom-8 right-8 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-amber-300 text-[#050816] flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.22)]">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-20 rounded-[3rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-[var(--surface-soft)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
            <BookOpen className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-extrabold">No curricula nodes found.</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">Try refining your search or selecting a different academic classification.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:underline">Clear all filters</button>
        </div>
      )}

      {/* Newsletter / CTA */}
      <div className="relative p-12 sm:p-20 rounded-[4rem] bg-[var(--accent)] overflow-hidden shadow-2xl shadow-[var(--accent-glow)]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-8">
          <Award className="h-12 w-12 text-white/40" />
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.95] tracking-tighter">
            Join the Next Generation <br /> of Global Talent.
          </h2>
          <p className="text-white/80 text-lg font-medium">
            Get early access to professional nodes and architectural updates delivered directly to your neural network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4 text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all"
            />
            <button className="px-10 py-4 bg-white text-[var(--accent)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Initialize
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Courses;
