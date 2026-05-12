import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BookOpen,
  Loader2,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<'student' | 'instructor'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /* Student form state */
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    educationLevel: '',
    phone: '',
  });

  /* Instructor form state */
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    expertise: '',
    bio: '',
    phoneNumber: '',
  });

  /* Redirect if already logged in */
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  /* Entrance animation */
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.1 }
      );
    }
  }, []);

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstructorForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (isStudent: boolean) => {
    const form = isStudent ? studentForm : instructorForm;
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setError('');
    setLoading(true);

    try {
      const { confirmPassword, ...payload } = studentForm;
      await authService.registerStudent(payload);
      setSuccess('✓ Account created! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setError('');
    setLoading(true);

    try {
      const { confirmPassword, ...payload } = instructorForm;
      const response = await authService.registerInstructor(payload);
      setSuccess(
        '✓ ' + (response.message || 'Application submitted! Check your email for updates.')
      );
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="py-16 px-4">
      <div ref={contentRef} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Join TuitionLMS</h1>
          <p className="text-slate-400 text-lg">Start your learning journey today</p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => {
                setTab('student');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition ${
                tab === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Student</span>
              </div>
            </button>
            <button
              onClick={() => {
                setTab('instructor');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition ${
                tab === 'instructor'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Instructor</span>
              </div>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm animate-in fade-in">
              {success}
            </div>
          )}

          {/* Student Form */}
          {tab === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={studentForm.name}
                      onChange={handleStudentChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={studentForm.email}
                      onChange={handleStudentChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={studentForm.password}
                      onChange={handleStudentChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={studentForm.confirmPassword}
                      onChange={handleStudentChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={studentForm.university}
                    onChange={handleStudentChange}
                    placeholder="Your university"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  />
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Education Level
                  </label>
                  <select
                    name="educationLevel"
                    value={studentForm.educationLevel}
                    onChange={handleStudentChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  >
                    <option value="">Select level</option>
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="BACHELOR">Bachelor</option>
                    <option value="MASTER">Master</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={studentForm.phone}
                    onChange={handleStudentChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2 group mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Student Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Instructor Form */}
          {tab === 'instructor' && (
            <form onSubmit={handleInstructorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={instructorForm.name}
                      onChange={handleInstructorChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={instructorForm.email}
                      onChange={handleInstructorChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={instructorForm.password}
                      onChange={handleInstructorChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={instructorForm.confirmPassword}
                      onChange={handleInstructorChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                    />
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={instructorForm.expertise}
                    onChange={handleInstructorChange}
                    placeholder="e.g. Web Development"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={instructorForm.phoneNumber}
                    onChange={handleInstructorChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={instructorForm.bio}
                  onChange={handleInstructorChange}
                  placeholder="Tell us about your teaching experience and achievements..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2 group mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Apply as Instructor
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Note */}
              <p className="text-sm text-slate-400 mt-4">
                Your application will be reviewed by our admin team. We'll send you an email once it's approved.
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1" />
            <span className="text-slate-500 text-sm">Have an account?</span>
            <div className="h-px bg-gradient-to-l from-white/10 to-transparent flex-1" />
          </div>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="w-full py-3 px-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg transition duration-300 text-center block"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
