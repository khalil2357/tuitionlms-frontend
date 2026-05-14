import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Settings, 
  Edit2, 
  Check, 
  X, 
  TrendingUp, 
  Search,
  Shield,
  GraduationCap,
  LayoutDashboard,
  MoreVertical,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { adminService, DashboardStats } from '../services/admin.service';
import { useAuthStore } from '../store/useAuthStore';

const AdminDashboard = () => {
  const { user, hydrated } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Inline editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydrated && (!user || user.role !== 'ADMIN')) {
      navigate('/dashboard');
    }
  }, [hydrated, user, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, coursesData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers(),
        adminService.getCourses()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id: string, currentData: any) => {
    setEditingId(id);
    setEditData({ ...currentData });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveUserEdit = async (id: string) => {
    try {
      // If role changed, update role specifically or via general update
      if (editData.role !== users.find(u => u.id === id).role) {
        await adminService.updateUserRole(id, editData.role);
      } else {
        await adminService.updateUser(id, editData);
      }
      setUsers(users.map(u => u.id === id ? { ...u, ...editData } : u));
      setEditingId(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const saveCourseEdit = async (id: string) => {
    try {
      await adminService.updateCourse(id, editData);
      setCourses(courses.map(c => c.id === id ? { ...c, ...editData } : c));
      setEditingId(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!hydrated || !user || user.role !== 'ADMIN') return null;

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8" ref={containerRef}>
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] font-['Bricolage_Grotesque']">
            Admin Intelligence <span className="text-[var(--accent)]">Center</span>
          </h1>
          <p className="mt-2 text-[var(--text-secondary)] flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
            System Management & Oversight
          </p>
        </div>

        <div className="flex gap-2 rounded-2xl bg-[var(--surface-soft)] p-1 border border-[var(--surface-border)]">
          {(['overview', 'users', 'courses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-[var(--accent)] text-white shadow-lg' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-border)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Activity className="h-10 w-10 animate-pulse text-[var(--accent)]" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Revenue" value={`$${stats?.revenue.toLocaleString()}`} icon={DollarSign} color="#8B5CF6" trend="+12.5%" />
                <StatCard label="Total Users" value={stats?.totalUsers.toString() || '0'} icon={Users} color="#3B82F6" trend="+4.2%" />
                <StatCard label="Live Courses" value={stats?.publishedCourses.toString() || '0'} icon={BookOpen} color="#10B981" trend="+2" />
                <StatCard label="Enrollments" value={stats?.totalEnrollments.toString() || '0'} icon={TrendingUp} color="#F59E0B" trend="+24" />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Secondary Stats */}
                <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-8">
                  <h3 className="mb-6 text-xl font-bold text-[var(--text-primary)]">System Health</h3>
                  <div className="space-y-4">
                    <HealthBar label="Active Users" value={stats?.activeUsers || 0} total={stats?.totalUsers || 1} color="bg-blue-500" />
                    <HealthBar label="Verified Instructors" value={stats?.verifiedInstructors || 0} total={stats?.totalUsers || 1} color="bg-green-500" />
                    <HealthBar label="Course Completion Rate" value={stats?.completedEnrollments || 0} total={stats?.totalEnrollments || 1} color="bg-purple-500" />
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-strong)] to-[rgba(139,92,246,0.05)] p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8">
                      <LayoutDashboard className="h-24 w-24 text-[var(--accent)] opacity-5 rotate-12" />
                   </div>
                   <h3 className="text-xl font-bold text-[var(--text-primary)]">Quick Insights</h3>
                   <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-[var(--surface-soft)]">
                         <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Draft Courses</p>
                         <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{stats?.draftCourses}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--surface-soft)]">
                         <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Certificates</p>
                         <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{stats?.totalCertificates}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] overflow-hidden shadow-2xl backdrop-blur-3xl">
              <div className="p-8 border-b border-[var(--surface-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Users Repository</h3>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search identity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[var(--accent)] outline-none transition-all w-full md:w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-soft)]/50">
                      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">User Identity</th>
                      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Role</th>
                      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--surface-border)]">
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                      <tr key={u.id} className="group hover:bg-[var(--surface-soft)]/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#ec4899] flex items-center justify-center text-white font-bold text-xs">
                              {u.avatar ? <img src={u.avatar} className="rounded-full h-full w-full object-cover" /> : u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--text-primary)]">{u.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {editingId === u.id ? (
                            <select 
                              value={editData.isActive} 
                              onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                              className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-lg p-1 text-xs"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          {editingId === u.id ? (
                            <select 
                              value={editData.role} 
                              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                              className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-lg p-1 text-xs"
                            >
                              <option value="STUDENT">Student</option>
                              <option value="INSTRUCTOR">Instructor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          ) : (
                            <span className="text-xs font-medium px-2 py-1 bg-[var(--surface-soft)] rounded-md border border-[var(--surface-border)]">
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          {editingId === u.id ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => saveUserEdit(u.id)} className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"><Check className="h-4 w-4" /></button>
                              <button onClick={cancelEditing} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"><X className="h-4 w-4" /></button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEditing(u.id, u)}
                              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-soft)] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
             <div className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] overflow-hidden shadow-2xl backdrop-blur-3xl">
                <div className="p-8 border-b border-[var(--surface-border)]">
                   <h3 className="text-xl font-bold text-[var(--text-primary)]">Curriculum Management</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-soft)]/50">
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Course</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Economics</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Visibility</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--surface-border)]">
                        {courses.map((c) => (
                           <tr key={c.id} className="group hover:bg-[var(--surface-soft)]/30 transition-colors">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-20 rounded-xl overflow-hidden border border-[var(--surface-border)]">
                                       <img src={c.thumbnail || 'https://via.placeholder.com/150'} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                       {editingId === c.id ? (
                                          <input 
                                            type="text" 
                                            value={editData.title} 
                                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                                            className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-lg px-2 py-1 text-sm font-bold w-full"
                                          />
                                       ) : (
                                          <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">{c.title}</p>
                                       )}
                                       <p className="text-xs text-[var(--text-muted)]">ID: {c.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 {editingId === c.id ? (
                                    <input 
                                       type="number" 
                                       value={editData.price} 
                                       onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                                       className="bg-[var(--surface-soft)] border border-[var(--surface-border)] rounded-lg px-2 py-1 text-sm w-24"
                                    />
                                 ) : (
                                    <span className="text-sm font-bold text-[var(--text-primary)]">${c.price}</span>
                                 )}
                              </td>
                              <td className="px-8 py-5">
                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${c.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {c.status}
                                 </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 {editingId === c.id ? (
                                    <div className="flex justify-end gap-2">
                                       <button onClick={() => saveCourseEdit(c.id)} className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"><Check className="h-4 w-4" /></button>
                                       <button onClick={cancelEditing} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"><X className="h-4 w-4" /></button>
                                    </div>
                                 ) : (
                                    <button 
                                       onClick={() => startEditing(c.id, c)}
                                       className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-soft)] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                       <Edit2 className="h-4 w-4" />
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-2xl">
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-5 transition-transform group-hover:scale-150" style={{ background: color }} />
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
        <p className="mt-2 text-4xl font-black text-[var(--text-primary)] font-['Bricolage_Grotesque']">{value}</p>
        <span className="mt-2 inline-block text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--surface-soft)]" style={{ color: color }}>
        <Icon className="h-8 w-8" />
      </div>
    </div>
  </div>
);

const HealthBar = ({ label, value, total, color }: any) => {
  const percentage = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="text-[var(--text-primary)]">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--surface-soft)] overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
