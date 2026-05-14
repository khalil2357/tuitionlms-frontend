import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Users,
  BookOpen,
  DollarSign,
  Shield,
  GraduationCap,
  LayoutDashboard,
  Activity,
  FileText,
  CheckSquare,
  Star,
  Award,
  UserCheck,
  Search,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Check,
  X,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowLeft,
  Menu,
  ChevronRight,
  Save,
  Loader2,
  Mail,
  Phone,
  Briefcase,
  Book,
  Globe,
  Settings,
  MoreVertical,
  ChevronDown,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  Tag
} from 'lucide-react';
import { adminService, type DashboardStats } from '../services/admin.service';
import { useAuthStore } from '../store/useAuthStore';

// --- Professional Toast Implementation ---
const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  const addToast = (title: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  return { toasts, addToast };
};

const ToastContainer = ({ toasts }: { toasts: any[] }) => (
  <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
    {toasts.map(toast => (
      <div key={toast.id} className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl animate-in slide-in-from-right-10 duration-300 ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
            'bg-blue-500/10 border-blue-500/20 text-blue-500'
        }`}>
        {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : toast.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        <span className="text-xs font-bold tracking-tight">{toast.title}</span>
      </div>
    ))}
  </div>
);

// --- Generic Modal Component ---
const Modal = ({ isOpen, onClose, title, children, size = 'max-w-xl' }: any) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, { scale: 0.95, opacity: 0, y: 10 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div ref={overlayRef} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div ref={modalRef} className={`relative w-full ${size} bg-[var(--surface-strong)] border border-[var(--surface-border)] rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col`}>
        <div className="p-6 border-b border-[var(--surface-border)] flex items-center justify-between bg-[var(--surface-soft)]/30 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-extrabold text-[var(--text-primary)] font-['Bricolage_Grotesque'] tracking-tight">{title}</h3>
            <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-0.5">Control Interface</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-border)] rounded-full transition-all active:scale-90 bg-[var(--surface-soft)] border border-[var(--surface-border)]">
            <X className="h-4 w-4 text-[var(--text-muted)]" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Form Field Helper ---
const FormField = ({ label, type = "text", value, onChange, placeholder, options, required = false, description }: any) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] flex items-center gap-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
    {type === 'select' ? (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-xl px-4 py-3 text-xs font-bold focus:border-[var(--accent)] outline-none appearance-none cursor-pointer hover:border-[var(--accent)] transition-all"
        required={required}
      >
        <option value="" disabled>{placeholder || 'Select option'}</option>
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-xl px-4 py-3 text-xs font-bold focus:border-[var(--accent)] outline-none min-h-[100px] resize-none hover:border-[var(--accent)] transition-all"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-xl px-4 py-3 text-xs font-bold focus:border-[var(--accent)] outline-none transition-all hover:border-[var(--accent)]"
      />
    )}
  </div>
);

const AdminDashboard = () => {
  const { user, hydrated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toasts, addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<any[]>([]);

  // CRUD States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [modalSize, setModalSize] = useState('max-w-xl');

  useEffect(() => {
    if (hydrated && (!user || user.role !== 'ADMIN')) {
      navigate('/dashboard');
    }
  }, [hydrated, user, navigate]);

  useEffect(() => {
    fetchAllData();
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (!newMode) {
      document.documentElement.classList.add('light');
      localStorage.setItem('admin-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('admin-theme', 'dark');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sData, u, c, s, l, e, q, ques, rev, cert, cats, reqs] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers(),
        adminService.getCourses(),
        adminService.getSections(),
        adminService.getLessons(),
        adminService.getEnrollments(),
        adminService.getQuizzes(),
        adminService.getQuestions(),
        adminService.getReviews(),
        adminService.getCertificates(),
        adminService.getCategories(),
        adminService.getInstructorRequests()
      ]);
      setStats(sData);
      setUsers(u); setCourses(c); setSections(s); setLessons(l); 
      setEnrollments(e); setQuizzes(q); setQuestions(ques); setReviews(rev); 
      setCertificates(cert); setCategories(cats); setInstructorRequests(reqs);
    } catch (err) {
      console.error('Failed to fetch data', err);
      addToast('Data sync failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: string, sectionName: string, item: any = null) => {
    setEditingItem(item);
    setModalTitle(`${item ? 'Modify' : 'Init'} ${sectionName.slice(0, -1)}`);
    setFormData(item || {});
    setModalSize(sectionName === 'Courses' || sectionName === 'Users' ? 'max-w-2xl' : 'max-w-xl');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      switch (activeSection) {
        case 'users':
          const userId = editingItem?.id || formData.id;
          if (editingItem) {
            await adminService.updateUser(userId, formData);
          } else {
            await adminService.createUser(formData);
          }
          break;
        case 'courses':
          editingItem ? await adminService.updateCourse(editingItem.id, formData) : await adminService.createCourse(formData);
          break;
        case 'sections':
          editingItem ? await adminService.updateSection(editingItem.id, formData) : await adminService.createSection(formData);
          break;
        case 'categories':
          editingItem ? await adminService.updateCategory(editingItem.id, formData) : await adminService.createCategory(formData);
          break;
        case 'lessons':
          editingItem ? await adminService.updateLesson(editingItem.id, formData) : await adminService.createLesson(formData);
          break;
        case 'quizzes':
          editingItem ? await adminService.updateQuiz(editingItem.id, formData) : await adminService.createQuiz(formData);
          break;
        case 'questions':
          editingItem ? await adminService.updateQuestion(editingItem.id, formData) : await adminService.createQuestion(formData);
          break;
        case 'enrollments':
          await adminService.manualEnroll(formData);
          break;
        case 'certificates':
          await adminService.createCertificate(formData);
          break;
      }
      addToast('Operation successful');
      setModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Neural failure', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    switch (activeSection) {
      case 'users': return users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
      case 'courses': return courses.filter(c => c.title.toLowerCase().includes(query));
      case 'lessons': return lessons.filter(l => l.title.toLowerCase().includes(query));
      case 'enrollments': return enrollments.filter(e => e.student?.name.toLowerCase().includes(query) || e.course?.title.toLowerCase().includes(query));
      case 'categories': return categories.filter(c => c.name.toLowerCase().includes(query));
      default: return [];
    }
  }, [searchQuery, activeSection, users, courses, lessons, enrollments, categories]);

  if (!hydrated || !user || user.role !== 'ADMIN') return null;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'lessons', label: 'Lessons', icon: Book },
    { id: 'enrollments', label: 'Enrollments', icon: TrendingUp },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'questions', label: 'Questions', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'requests', label: 'Requests', icon: UserCheck },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-['Bricolage_Grotesque'] text-[var(--text-primary)]">
      <ToastContainer toasts={toasts} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden" />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[60] bg-[var(--surface-strong)] border-r border-[var(--surface-border)] transition-all duration-300 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        ${isSidebarOpen ? 'w-64' : 'w-20'}`}>

        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-glow)]">
                <Shield className="h-4 w-4" />
              </div>
              {isSidebarOpen && <span className="font-extrabold text-lg tracking-tight">Tution<span className="text-[var(--accent)]">LMS</span></span>}
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 custom-scrollbar">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group ${activeSection === item.id
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
                  }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${activeSection === item.id ? 'text-white' : 'text-[var(--accent)]'}`} />
                {isSidebarOpen && <span className="text-xs font-bold tracking-tight">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-[var(--surface-border)]">
            <Link to="/" className="flex items-center gap-3 text-[var(--text-muted)] hover:text-red-500 transition-all group">
              <ArrowLeft className="h-4 w-4" />
              {isSidebarOpen && <span className="text-[9px] font-black uppercase tracking-widest">Exit Portal</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>

        {/* Top Navbar */}
        <header className="h-16 bg-[var(--surface-strong)]/50 backdrop-blur-xl border-b border-[var(--surface-border)] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-[var(--surface-soft)] rounded-lg border border-[var(--surface-border)]">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block">
              <p className="text-[var(--text-primary)] font-extrabold text-sm tracking-tight">{user?.name} <span className="text-[var(--text-muted)] font-bold ml-2">({user?.role})</span></p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-xl pl-10 pr-4 py-2 text-xs font-bold w-48 focus:w-64 focus:border-[var(--accent)] outline-none transition-all"
              />
            </div>

            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button onClick={fetchAllData} className={`p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-soft)] transition-all hover:border-[var(--accent)] ${loading ? 'animate-spin' : ''}`}>
              <Activity className="h-4 w-4" />
            </button>

            <div className="h-8 w-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Dynamic Section */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[var(--background)] custom-scrollbar">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Syncing Intelligence</p>
              </div>
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto space-y-12">
              {activeSection === 'overview' && <OverviewSection stats={stats} />}
              {activeSection === 'users' && <UsersSection users={filteredData.length > 0 ? filteredData : users} setUsers={setUsers} onAction={handleOpenModal} addToast={addToast} />}
              {activeSection === 'courses' && <CoursesSection courses={filteredData.length > 0 ? filteredData : courses} setCourses={setCourses} onAction={handleOpenModal} />}
              {activeSection === 'categories' && <CategoriesSection categories={filteredData.length > 0 ? filteredData : categories} setCategories={setCategories} onAction={handleOpenModal} />}
              {activeSection === 'sections' && <SectionsSection sections={sections} setSections={setSections} courses={courses} onAction={handleOpenModal} />}
              {activeSection === 'lessons' && <LessonsSection lessons={filteredData.length > 0 ? filteredData : lessons} setLessons={setLessons} courses={courses} sections={sections} onAction={handleOpenModal} />}
              {activeSection === 'enrollments' && <EnrollmentsSection enrollments={filteredData.length > 0 ? filteredData : enrollments} setEnrollments={setEnrollments} onAction={handleOpenModal} />}
              {activeSection === 'quizzes' && <QuizzesSection quizzes={quizzes} setQuizzes={setQuizzes} courses={courses} onAction={handleOpenModal} />}
              {activeSection === 'questions' && <QuestionsSection questions={questions} setQuestions={setQuestions} quizzes={quizzes} onAction={handleOpenModal} />}
              {activeSection === 'reviews' && <ReviewsSection reviews={reviews} setReviews={setReviews} />}
              {activeSection === 'certificates' && <CertificatesSection certificates={certificates} setCertificates={setCertificates} onAction={handleOpenModal} />}
              {activeSection === 'requests' && <RequestsSection requests={instructorRequests} setRequests={setInstructorRequests} addToast={addToast} />}
            </div>
          )}
        </main>
      </div>

      {/* Advanced Unified Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} size={modalSize}>
        <form onSubmit={handleSave} className="space-y-6">
          {activeSection === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {!editingItem && <FormField label="Custom ID (Optional)" value={formData.id} onChange={(v: any) => setFormData({ ...formData, id: v })} placeholder="Leave blank for auto-gen" />}
              <FormField label="Full Name" value={formData.name} onChange={(v: any) => setFormData({ ...formData, name: v })} required />
              <FormField label="Email" type="email" value={formData.email} onChange={(v: any) => setFormData({ ...formData, email: v })} required />
              {(formData.role === 'INSTRUCTOR' || !editingItem) && (
                <FormField label={editingItem ? "Update Password (Optional)" : "Password"} type="password" value={formData.password} onChange={(v: any) => setFormData({ ...formData, password: v })} required={!editingItem} />
              )}
              <FormField label="Role" type="select" value={formData.role} onChange={(v: any) => setFormData({ ...formData, role: v })}
                options={[{ value: 'STUDENT', label: 'Student' }, { value: 'INSTRUCTOR', label: 'Instructor' }, { value: 'ADMIN', label: 'Admin' }]} />
              <FormField label="Edu Level" type="select" value={formData.educationLevel} onChange={(v: any) => setFormData({ ...formData, educationLevel: v })}
                options={[{ value: 'HIGH_SCHOOL', label: 'High School' }, { value: 'DIPLOMA', label: 'Diploma' }, { value: 'BACHELORS', label: 'Bachelors' }, { value: 'MASTERS', label: 'Masters' }, { value: 'PHD', label: 'PHD' }]} />
              <FormField label="University" value={formData.university} onChange={(v: any) => setFormData({ ...formData, university: v })} />
              <FormField label="Phone" value={formData.phone} onChange={(v: any) => setFormData({ ...formData, phone: v })} />
              <div className="col-span-full">
                <FormField label="Biography" type="textarea" value={formData.bio} onChange={(v: any) => setFormData({ ...formData, bio: v })} />
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-full">
                <FormField label="Title" value={formData.title} onChange={(v: any) => setFormData({...formData, title: v})} required />
              </div>
              <FormField label="Category" type="select" value={formData.categoryId} onChange={(v: any) => setFormData({...formData, categoryId: v})} required 
                options={categories.map(c => ({ value: c.id, label: c.name }))} />
              <FormField label="Price" type="number" value={formData.price} onChange={(v: any) => setFormData({...formData, price: v})} required />
              <FormField label="Level" type="select" value={formData.level} onChange={(v: any) => setFormData({ ...formData, level: v })}
                options={[{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }]} />
              <FormField label="Instructor" type="select" value={formData.instructorId} onChange={(v: any) => setFormData({ ...formData, instructorId: v })}
                options={users.filter(u => u.role === 'INSTRUCTOR').map(u => ({ value: u.id, label: u.name }))} required />
              <FormField label="Status" type="select" value={formData.status} onChange={(v: any) => setFormData({ ...formData, status: v })}
                options={[{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'ARCHIVED', label: 'Archived' }]} />
              <div className="col-span-full">
                <FormField label="Description" type="textarea" value={formData.description} onChange={(v: any) => setFormData({ ...formData, description: v })} required />
              </div>
              <FormField label="Language" value={formData.language} onChange={(v: any) => setFormData({ ...formData, language: v })} />
              <FormField label="Thumbnail URL" value={formData.thumbnail} onChange={(v: any) => setFormData({ ...formData, thumbnail: v })} />
            </div>
          )}

          {activeSection === 'sections' && (
            <div className="space-y-4">
              <FormField label="Section Title" value={formData.title} onChange={(v: any) => setFormData({...formData, title: v})} required />
              <FormField label="Course" type="select" value={formData.courseId} onChange={(v: any) => setFormData({...formData, courseId: v})} required 
                options={courses.map(c => ({ value: c.id, label: c.title }))} />
              <FormField label="Order" type="number" value={formData.order} onChange={(v: any) => setFormData({...formData, order: v})} required />
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-4">
              <FormField label="Name" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} required />
              <FormField label="Icon (Lucide Name)" value={formData.icon} onChange={(v: any) => setFormData({...formData, icon: v})} placeholder="e.g. Code, Database, Layout" />
              <FormField label="Description" value={formData.description} onChange={(v: any) => setFormData({...formData, description: v})} />
            </div>
          )}

          {activeSection === 'lessons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-full">
                <FormField label="Lesson Title" value={formData.title} onChange={(v: any) => setFormData({ ...formData, title: v })} required />
              </div>
              <FormField label="Course" type="select" value={formData.courseId} onChange={(v: any) => setFormData({ ...formData, courseId: v })}
                options={courses.map(c => ({ value: c.id, label: c.title }))} required />
              <FormField label="Section" type="select" value={formData.sectionId} onChange={(v: any) => setFormData({ ...formData, sectionId: v })}
                options={sections.filter(s => s.courseId === formData.courseId).map(s => ({ value: s.id, label: s.title }))} required />
              <FormField label="Order" type="number" value={formData.order} onChange={(v: any) => setFormData({ ...formData, order: v })} required />
              <FormField label="Type" type="select" value={formData.type} onChange={(v: any) => setFormData({ ...formData, type: v })}
                options={[{ value: 'VIDEO', label: 'Video' }, { value: 'ARTICLE', label: 'Article' }, { value: 'PDF', label: 'PDF' }]} />
              <div className="col-span-full">
                <FormField label="Content / URL" type="textarea" value={formData.content} onChange={(v: any) => setFormData({ ...formData, content: v })} />
              </div>
            </div>
          )}

          {activeSection === 'enrollments' && (
            <div className="space-y-4">
              <FormField label="Student" type="select" value={formData.studentId} onChange={(v: any) => setFormData({...formData, studentId: v})} required 
                options={users.filter(u => u.role === 'STUDENT').map(u => ({ value: u.id, label: u.name }))} />
              <FormField label="Course" type="select" value={formData.courseId} onChange={(v: any) => setFormData({...formData, courseId: v})} required 
                options={courses.map(c => ({ value: c.id, label: c.title }))} />
            </div>
          )}

          <div className="pt-6 flex justify-end gap-3 border-t border-[var(--surface-border)]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-[var(--surface-border)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--surface-soft)] transition-all">Abort</button>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-glow)] disabled:opacity-50 transition-all">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Change
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// --- Sub-Components ---

const SectionHeader = ({ title, description, onAdd }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div className="space-y-0.5">
      <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tighter">{title}</h2>
      <p className="text-[var(--text-muted)] text-[10px] font-bold leading-relaxed">{description}</p>
    </div>
    {onAdd && (
      <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-xl shadow-lg shadow-[var(--accent-glow)] text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all active:translate-y-0">
        <Plus className="h-4 w-4" />
        Add {title.slice(0, -1)}
      </button>
    )}
  </div>
);

const OverviewSection = ({ stats }: any) => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <SectionHeader title="Dashboard" description="Aggregated platform pulse and performance metrics." />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard label="Revenue" value={`$${stats?.revenue?.toLocaleString() || 0}`} icon={DollarSign} color="text-green-500" />
      <MetricCard label="Users" value={stats?.totalUsers || 0} icon={Users} color="text-blue-500" />
      <MetricCard label="Enrollments" value={stats?.totalEnrollments || 0} icon={TrendingUp} color="text-purple-500" />
      <MetricCard label="Courses" value={stats?.publishedCourses || 0} icon={BookOpen} color="text-orange-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-10 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl space-y-8">
        <h3 className="text-lg font-extrabold flex items-center gap-3">
          <Layers className="h-5 w-5 text-[var(--accent)]" />
          Entity Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <DistributionBar label="Lessons" value={stats?.totalLessons} max={1000} color="bg-blue-500" />
            <DistributionBar label="Quizzes" value={stats?.totalQuizzes} max={200} color="bg-purple-500" />
          </div>
          <div className="space-y-6">
            <DistributionBar label="Reviews" value={stats?.totalReviews} max={500} color="bg-yellow-500" />
            <DistributionBar label="Certificates" value={stats?.totalCertificates} max={300} color="bg-green-500" />
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl flex flex-col justify-center gap-8">
        <h3 className="text-lg font-extrabold flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
          Node Health
        </h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <StatusChip label="Active Nodes" count={stats?.activeUsers} total={stats?.totalUsers} />
          <StatusChip label="Verified Auth" count={stats?.verifiedInstructors} total={stats?.totalUsers} />
        </div>
      </div>
    </div>
  </div>
);

const UsersSection = ({ users, setUsers, onAction, addToast }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Users" description="Manage platform identities and access levels." onAdd={() => onAction('create', 'Users')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">User Info</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Role / Edu</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">State</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-xs">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold tracking-tight">{u.name}</p>
                      <p className="text-[10px] font-bold text-[var(--text-muted)]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">{u.role}</span>
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter opacity-60">{u.educationLevel || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      await adminService.updateUser(u.id, { isActive: !u.isActive });
                      setUsers(users.map((usr: any) => usr.id === u.id ? { ...usr, isActive: !usr.isActive } : usr));
                      addToast(`Node ${u.isActive ? 'suspended' : 'activated'}`);
                    }} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${u.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </button>
                    {u.role === 'INSTRUCTOR' && (
                      <button onClick={async () => {
                        await adminService.updateUser(u.id, { isVerified: !u.isVerified });
                        setUsers(users.map((usr: any) => usr.id === u.id ? { ...usr, isVerified: !usr.isVerified } : usr));
                      }} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${u.isVerified ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/10'}`}>
                        {u.isVerified ? 'Verified' : 'Pending'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => {
                      console.log('Editing user:', u);
                      onAction('edit', title, u);
                    }} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={async () => {
                      if (confirm('Delete user?')) {
                        await adminService.deleteUser(u.id);
                        setUsers(users.filter((usr: any) => usr.id !== u.id));
                      }
                    }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CoursesSection = ({ courses, setCourses, onAction }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Courses" description="Deploy and manage academic curricula." onAdd={() => onAction('create', 'Courses')} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((c: any) => (
        <div key={c.id} className="p-6 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl group flex flex-col hover:border-[var(--accent)] transition-all duration-300">
          <div className="h-40 rounded-2xl overflow-hidden mb-6 border border-[var(--surface-border)] shadow-md">
            <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">{c.status}</span>
              <span className="text-xs font-extrabold text-[var(--text-primary)]">${c.price}</span>
            </div>
            <h4 className="font-extrabold text-sm line-clamp-1 tracking-tight">{c.title}</h4>
            <div className="flex items-center gap-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.totalStudents}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {c.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--surface-border)] flex justify-end gap-2">
            <button onClick={() => onAction('edit', 'Courses', c)} className="p-2.5 rounded-lg bg-[var(--surface-soft)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
            <button onClick={async () => {
              if (confirm('Delete course?')) {
                await adminService.deleteCourse(c.id);
                setCourses(courses.filter((crs: any) => crs.id !== c.id));
              }
            }} className="p-2.5 rounded-lg bg-[var(--surface-soft)] hover:text-red-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SectionsSection = ({ sections, setSections, onAction }: any) => (
  <div className="space-y-8">
    <SectionHeader title="Sections" description="Structure curricula units." onAdd={() => onAction('create', 'Sections')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <table className="w-full text-left">
        <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
          <tr>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Title</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Parent Course</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Order</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-border)]">
          {sections.map((s: any) => (
            <tr key={s.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
              <td className="px-8 py-5">
                <p className="text-xs font-extrabold tracking-tight">{s.title}</p>
              </td>
              <td className="px-8 py-5">
                <span className="text-[10px] font-bold text-[var(--text-muted)] line-clamp-1">{s.course?.title}</span>
              </td>
              <td className="px-8 py-5">
                <span className="text-xs font-mono font-bold opacity-60">#{s.order}</span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onAction('edit', 'Sections', s)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={async () => {
                    if (confirm('Delete section?')) {
                      await adminService.deleteSection(s.id);
                      setSections(sections.filter((sec: any) => sec.id !== s.id));
                    }
                  }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LessonsSection = ({ lessons, setLessons, onAction }: any) => (
  <div className="space-y-8">
    <SectionHeader title="Lessons" description="Atomic knowledge components." onAdd={() => onAction('create', 'Lessons')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Unit Title</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Course / Section</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Type</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {lessons.map((l: any) => (
              <tr key={l.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
                <td className="px-8 py-5">
                  <p className="text-xs font-extrabold tracking-tight">{l.title}</p>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[var(--text-muted)]">{l.course?.title}</span>
                    <span className="text-[9px] font-black text-[var(--accent)] uppercase">{l.section?.title}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-2 py-0.5 bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-md text-[8px] font-black uppercase text-blue-500">{l.type}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onAction('edit', 'Lessons', l)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={async () => {
                      if (confirm('Delete lesson?')) {
                        await adminService.deleteLesson(l.id);
                        setLessons(lessons.filter((ls: any) => ls.id !== l.id));
                      }
                    }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const EnrollmentsSection = ({ enrollments, setEnrollments, onAction }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Enrollments" description="Manage platform access and progress." onAdd={() => onAction('create', 'Enrollments')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <table className="w-full text-left">
        <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
          <tr>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Student / Course</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Progress</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-border)]">
          {enrollments.map((e: any) => (
            <tr key={e.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
              <td className="px-8 py-5">
                <p className="text-xs font-extrabold tracking-tight">{e.student?.name || 'Legacy Student'}</p>
                <p className="text-[9px] font-bold text-[var(--text-muted)] line-clamp-1">{e.course?.title || 'Course Details Missing'}</p>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 w-24 bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--surface-border)]">
                    <div className="h-full bg-[var(--accent)]" style={{ width: `${e.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black">{e.progress}%</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <select
                  value={e.status}
                  onChange={async (ev) => {
                    const newStatus = ev.target.value;
                    await adminService.updateEnrollmentStatus(e.id, newStatus);
                    setEnrollments(enrollments.map((enr: any) => enr.id === e.id ? { ...enr, status: newStatus } : enr));
                  }}
                  className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-[var(--accent)] outline-none cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DROPPED">Dropped</option>
                </select>
              </td>
              <td className="px-8 py-5 text-right">
                <button onClick={async () => {
                  if (confirm('Revoke enrollment?')) {
                    await adminService.deleteEnrollment(e.id);
                    setEnrollments(enrollments.filter((enr: any) => enr.id !== e.id));
                  }
                }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const QuizzesSection = ({ quizzes, setQuizzes, onAction }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Quizzes" description="Assessment gate management." onAdd={() => onAction('create', 'Quizzes')} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {quizzes.map((q: any) => (
        <div key={q.id} className="p-8 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl flex flex-col gap-6 group hover:border-orange-500 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">{q.title}</h4>
                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{q.course?.title}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (q.isPublished) await adminService.unpublishQuiz(q.id);
                else await adminService.publishQuiz(q.id);
                setQuizzes(quizzes.map((qz: any) => qz.id === q.id ? { ...qz, isPublished: !qz.isPublished } : qz));
              }}
              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${q.isPublished ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}
            >
              {q.isPublished ? 'Live' : 'Draft'}
            </button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--surface-border)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{q.questions?.length || 0} Questions • {q.passingScore}% Pass</span>
            <div className="flex gap-2">
              <button onClick={() => onAction('edit', 'Quizzes', q)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
              <button onClick={async () => {
                if (confirm('Delete quiz?')) {
                  await adminService.deleteQuiz(q.id);
                  setQuizzes(quizzes.filter((qz: any) => qz.id !== q.id));
                }
              }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuestionsSection = ({ questions, setQuestions, onAction }: any) => (
  <div className="space-y-8">
    <SectionHeader title="Questions" description="Verification nodes." onAdd={() => onAction('create', 'Questions')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <table className="w-full text-left">
        <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
          <tr>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Statement</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Quiz</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Points</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-border)]">
          {questions.map((q: any) => (
            <tr key={q.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
              <td className="px-8 py-5">
                <p className="text-xs font-extrabold tracking-tight line-clamp-1">{q.text}</p>
                <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Key: {q.correctAnswer}</span>
              </td>
              <td className="px-8 py-5 text-[9px] font-bold text-[var(--text-muted)]">
                {q.quiz?.title}
              </td>
              <td className="px-8 py-5">
                <span className="text-xs font-mono font-bold text-[var(--accent)]">{q.points}p</span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onAction('edit', 'Questions', q)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={async () => {
                    if (confirm('Delete question?')) {
                      await adminService.deleteQuestion(q.id);
                      setQuestions(questions.filter((que: any) => que.id !== q.id));
                    }
                  }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReviewsSection = ({ reviews, setReviews }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Reviews" description="Manage platform feedback." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((r: any) => (
        <div key={r.id} className="p-8 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl flex flex-col gap-4 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 font-extrabold text-xs">
                {r.user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-tight">{r.user?.name}</p>
                <div className="flex text-yellow-500 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'opacity-20'}`} />)}
                </div>
              </div>
            </div>
            <button onClick={async () => {
              if (confirm('Delete review?')) {
                await adminService.deleteReview(r.id);
                setReviews(reviews.filter((rev: any) => rev.id !== r.id));
              }
            }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
          </div>
          <p className="text-xs text-[var(--text-primary)] font-bold italic line-clamp-2">"{r.comment}"</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">{r.course?.title}</p>
        </div>
      ))}
    </div>
  </div>
);

const CertificatesSection = ({ certificates, setCertificates, onAction }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Certificates" description="Issue digital credentials." onAdd={() => onAction('create', 'Certificates')} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {certificates.map((cert: any) => (
        <div key={cert.id} className="p-8 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl flex flex-col gap-6 group hover:border-purple-500 transition-all duration-300">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-purple-500" />
            <div>
              <h4 className="font-extrabold text-xs tracking-tight">{cert.user?.name}</h4>
              <p className="text-[8px] font-mono font-bold text-[var(--text-muted)]">{cert.certificateNumber}</p>
            </div>
          </div>
          <p className="text-[10px] font-extrabold text-[var(--text-primary)] line-clamp-2">{cert.course?.title || cert.courseName}</p>
          <div className="pt-4 border-t border-[var(--surface-border)] flex justify-end gap-2">
            <button onClick={() => window.open(cert.certificateUrl, '_blank')} className="p-2 text-[var(--text-muted)] hover:text-blue-500 transition-all"><ExternalLink className="h-4 w-4" /></button>
            <button onClick={async () => {
              if (confirm('Revoke certificate?')) {
                await adminService.deleteCertificate(cert.id);
                setCertificates(certificates.filter((c: any) => c.id !== cert.id));
              }
            }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RequestsSection = ({ requests, setRequests, addToast }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Applications" description="Instructor admission queue." />
    <div className="grid grid-cols-1 gap-6">
      {requests.map((r: any) => (
        <div key={r.id} className="p-8 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-2xl">
              {r.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h4 className="font-extrabold text-sm tracking-tight">{r.name}</h4>
              <div className="flex gap-4 mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {r.email}</span>
                <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> {r.expertise}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await adminService.approveInstructor(r.id, { status: 'APPROVED' });
                setRequests(requests.filter((req: any) => req.id !== r.id));
                addToast('Authority granted');
              }}
              className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-glow)] active:scale-95 transition-all"
            >
              Approve
            </button>
            <button
              onClick={async () => {
                const reason = prompt('Reason for rejection:');
                if (reason) {
                  await adminService.approveInstructor(r.id, { status: 'REJECTED', reason });
                  setRequests(requests.filter((req: any) => req.id !== r.id));
                  addToast('Request rejected');
                }
              }}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 active:scale-95 transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Atomic Components ---

const MetricCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="p-8 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 relative overflow-hidden group hover:border-[var(--accent)] transition-all duration-500 shadow-lg">
    <Icon className={`absolute -right-4 -top-4 h-24 w-24 opacity-[0.03] group-hover:scale-110 transition-transform ${color}`} />
    <div className="relative z-10 space-y-4">
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <p className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none">{value || 0}</p>
    </div>
  </div>
);

const DistributionBar = ({ label, value, max, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
      <span className="text-xs font-extrabold text-[var(--text-primary)]">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--surface-border)]">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  </div>
);

const StatusChip = ({ label, count, total }: any) => (
  <div className="flex-1 p-6 rounded-[1.5rem] bg-[var(--surface-soft)] border border-[var(--surface-border)] relative overflow-hidden group">
    <p className="text-[9px] font-black mb-4 uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-extrabold text-[var(--text-primary)]">{count}</p>
      <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Nodes</p>
    </div>
    <div className="mt-4 h-1 w-full bg-[var(--surface-border)] rounded-full overflow-hidden">
      <div className="h-full bg-[var(--accent)]" style={{ width: `${(count / total) * 100}%` }}></div>
    </div>
  </div>
);

const CategoriesSection = ({ categories, setCategories, onAction }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionHeader title="Categories" description="Manage academic classification." onAdd={() => onAction('create', 'Categories')} />
    <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/40 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--surface-soft)]/50 border-b border-[var(--surface-border)]">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Name</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Courses</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {categories.map((c: any) => (
              <tr key={c.id} className="hover:bg-[var(--surface-soft)]/30 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--surface-soft)] flex items-center justify-center text-[var(--accent)]"><Tag className="h-4 w-4" /></div>
                    <p className="text-xs font-extrabold tracking-tight">{c.name}</p>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <span className="text-[10px] font-bold text-[var(--text-muted)]">{c._count?.courses || 0} Items</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onAction('edit', 'Categories', c)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={async () => {
                      if(confirm('Delete category?')) {
                        await adminService.deleteCategory(c.id);
                        setCategories(categories.filter((cat: any) => cat.id !== c.id));
                      }
                    }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
