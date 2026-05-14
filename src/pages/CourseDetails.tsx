import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Play, 
  Clock, 
  Users, 
  Globe, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Star,
  CheckCircle2,
  FileText,
  Lock,
  ArrowLeft,
  Share2,
  Heart,
  PlayCircle
} from 'lucide-react';
import { courseService } from '../services/course.service';
import { useAuthStore } from '../store/useAuthStore';

gsap.registerPlugin(ScrollTrigger);

const CourseDetails = () => {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (slug) {
          const data = await courseService.getCourseBySlug(slug);
          setCourse(data);
          if (data.sections?.length > 0) setActiveSection(data.sections[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'expo.out' }
      );

      if (window.innerWidth >= 1024) {
        gsap.to(sidebarRef.current, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 120px',
            end: 'bottom bottom',
            pin: sidebarRef.current,
            pinSpacing: false,
          }
        });
      }
    }
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
      <div className="h-12 w-12 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h2 className="text-4xl font-black">Node Not Found</h2>
      <Link to="/courses" className="px-8 py-3 bg-[var(--accent)] rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Back to Catalog</Link>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[var(--page-bg)] pb-32 overflow-hidden -mt-20">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] lg:h-[70vh] bg-black overflow-hidden">
        <img 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'} 
          className="w-full h-full object-cover opacity-60 scale-110 blur-[2px]" 
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--page-bg)] via-transparent to-black/40" />
        
        <div className="absolute inset-0 flex items-center justify-center">
            <button className="group relative h-24 w-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-2xl">
                    <Play className="h-6 w-6 text-black fill-black ml-1" />
                </div>
                <div className="absolute inset-[-10px] rounded-full border border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700" />
            </button>
        </div>

        <div className="absolute top-48 left-6 sm:left-10 md:left-20 max-w-4xl space-y-6">
           <Link to="/courses" className="inline-flex items-center gap-2 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px] transition-all">
             <ArrowLeft className="h-4 w-4" />
             Catalog Nodes
           </Link>
           <h1 className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
             {course.title}
           </h1>
           <div className="flex flex-wrap items-center gap-6 text-white/80 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                4.9 (2,450 Reviews)
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {course._count?.enrollments || 0} Registered
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                English / Subtitles
              </div>
           </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 md:px-20 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-8xl mx-auto">
        {/* Main Content */}
        <div ref={contentRef} className="lg:col-span-8 space-y-16">
          
          {/* Summary / About */}
          <div className="p-10 rounded-[3rem] bg-[var(--surface-strong)]/60 backdrop-blur-3xl border border-[var(--surface-border)] shadow-2xl space-y-8">
            <h2 className="text-2xl font-black tracking-tight">Curriculum Architectural Intent</h2>
            <div className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed font-medium">
              {course.description || "No detailed architectural specifications provided for this node."}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
               {['Architecture Fundamentals', 'Synchronous Execution', 'High-Fidelity UI', 'Data Integrity'].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--surface-border)]">
                   <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
                   <span className="text-xs font-bold">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black tracking-tight">Technical Curriculum</h2>
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                 {course.sections?.length || 0} Modules • {course.sections?.reduce((a:any, b:any) => a + b.lessons.length, 0)} Nodes
               </div>
            </div>

            <div className="space-y-4">
              {course.sections?.map((section: any) => (
                <div key={section.id} className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden">
                   <button 
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-8 hover:bg-[var(--surface-soft)] transition-all"
                   >
                     <div className="flex items-center gap-6">
                        <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-black">
                           {section.order}
                        </div>
                        <div className="text-left">
                           <h3 className="text-base font-extrabold tracking-tight">{section.title}</h3>
                           <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{section.lessons.length} Learning Nodes</p>
                        </div>
                     </div>
                     {activeSection === section.id ? <ChevronUp className="h-5 w-5 text-[var(--text-muted)]" /> : <ChevronDown className="h-5 w-5 text-[var(--text-muted)]" />}
                   </button>
                   
                   {activeSection === section.id && (
                     <div className="border-t border-[var(--surface-border)] divide-y divide-[var(--surface-border)]">
                        {section.lessons.map((lesson: any) => (
                          <div key={lesson.id} className="group flex items-center justify-between p-6 hover:bg-[var(--surface-soft)]/50 transition-all cursor-pointer">
                             <div className="flex items-center gap-4">
                               <div className="h-8 w-8 rounded-lg bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                                 {lesson.isPreview ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                               </div>
                               <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{lesson.title}</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{lesson.duration}m</span>
                                {lesson.isPreview && <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Preview</span>}
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="p-12 rounded-[3.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 space-y-8">
             <div className="flex flex-col sm:flex-row items-center gap-10">
                <div className="relative">
                  <div className="h-32 w-32 rounded-[2rem] overflow-hidden border-4 border-[var(--surface-border)] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070'} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white border-4 border-[var(--surface-strong)]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-3 text-center sm:text-left flex-1">
                   <h2 className="text-3xl font-black tracking-tighter">{course.instructor?.name}</h2>
                   <p className="text-[var(--accent)] text-sm font-black uppercase tracking-widest">{course.instructor?.headline || 'Senior Platform Architect'}</p>
                   <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                      <div className="text-center">
                         <p className="text-xl font-black">45k+</p>
                         <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Agents</p>
                      </div>
                      <div className="h-8 w-px bg-[var(--surface-border)]" />
                      <div className="text-center">
                         <p className="text-xl font-black">12</p>
                         <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Nodes</p>
                      </div>
                   </div>
                </div>
                <button className="px-8 py-3 rounded-2xl border border-[var(--surface-border)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--surface-soft)] transition-all">Profile</button>
             </div>
          </div>
        </div>

        {/* Floating Sidebar Container */}
        <div className="lg:col-span-4 relative">
          <div ref={sidebarRef} className="space-y-6 pt-4 lg:pt-0">
            <div className="p-8 rounded-[3rem] bg-[var(--surface-strong)] border border-[var(--surface-border)] shadow-2xl space-y-8">
              <div className="space-y-2">
                 <div className="flex items-baseline gap-3">
                   <span className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                     {course.price > 0 ? `$${course.price}` : 'Free'}
                   </span>
                   {course.discountPrice && (
                     <span className="text-lg text-[var(--text-muted)] line-through font-bold">${course.discountPrice}</span>
                   )}
                 </div>
                 <p className="text-xs font-black text-red-500 uppercase tracking-widest">Limited Node Access — 84% Enrolled</p>
              </div>

              <div className="space-y-3">
                <button className="w-full py-5 rounded-[1.5rem] bg-[var(--accent)] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--accent-glow)] hover:scale-105 active:scale-95 transition-all">
                  Initialize Curriculum
                </button>
                <button className="w-full py-5 rounded-[1.5rem] border border-[var(--surface-border)] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[var(--surface-soft)] transition-all">
                  Try Preview Nodes
                </button>
              </div>

              <div className="space-y-6 pt-6 border-t border-[var(--surface-border)]">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Node Includes</h4>
                 <div className="grid grid-cols-1 gap-4">
                   {[
                     { icon: Clock, label: 'Full Lifetime Access' },
                     { icon: FileText, label: '32 Support Documents' },
                     { icon: Award, label: 'Architect Certificate' },
                     { icon: Globe, label: 'Global Synchronization' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 group">
                       <div className="h-8 w-8 rounded-lg bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                         <item.icon className="h-4 w-4" />
                       </div>
                       <span className="text-[11px] font-bold text-[var(--text-secondary)]">{item.label}</span>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--surface-border)]">
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                   <Share2 className="h-4 w-4" /> Share
                 </button>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 transition-colors">
                   <Heart className="h-4 w-4" /> Wishlist
                 </button>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight">30-Day Evaluation Period</h4>
                <p className="text-[10px] font-bold text-[var(--text-muted)]">100% Refundable Neural Investment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Award = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-2 5L12 18l2 2-2-5zm0 0l2-2M12 9l-2 2" />
    <circle cx="12" cy="9" r="6" />
  </svg>
);

export default CourseDetails;
