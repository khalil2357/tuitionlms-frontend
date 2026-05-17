import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Globe, Book, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/user.service';

const Accounts = () => {
  const { user, hydrated, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saveError, setSaveError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (hydrated && !user) {
      navigate('/login');
    }
  }, [hydrated, navigate, user]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFormData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaveError('');
    setSavingProfile(true);

    try {
      await userService.updateProfile(formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      setSaveError(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (!hydrated || !user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="flex items-center gap-3 rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
          Loading account
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-[-6rem] top-[12rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>

        <section className="rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-strong)]/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] sm:text-5xl">Account Settings</h1>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">Manage your profile information and preferences.</p>
            </div>

            {saveError && (
              <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {saveError}
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-300/30"
                  />
                ) : (
                  <p className="text-lg font-black text-[var(--text-primary)]">{profile?.name || 'N/A'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="text-sm text-[var(--text-secondary)]">{profile?.email || 'N/A'}</p>
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-300/30"
                    placeholder="Your phone number"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">{profile?.phone || 'Not provided'}</p>
                )}
              </div>

              {/* University */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  <Globe className="h-4 w-4" />
                  University
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.university || ''}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-300/30"
                    placeholder="Your university"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">{profile?.university || 'Not provided'}</p>
                )}
              </div>

              {/* Education Level */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  <Book className="h-4 w-4" />
                  Education Level
                </label>
                {isEditing ? (
                  <select
                    value={formData?.educationLevel || ''}
                    onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]/50 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-cyan-300/30"
                  >
                    <option value="">Select your level</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">{profile?.educationLevel || 'Not provided'}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)] mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Account Type
                </label>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">{profile?.role || 'STUDENT'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.16)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#050816] shadow-2xl transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                  setSaveError('');
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)]/70 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--text-secondary)] transition-transform hover:scale-[1.01]"
              >
                Cancel
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-red-200 transition-transform hover:scale-[1.01]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
