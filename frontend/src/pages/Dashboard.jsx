import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  BookOpen, CheckCircle, Award, TrendingUp, Users, PlusCircle,
  ChevronRight, Play, FileText, Download, LayoutDashboard, Compass,
  CreditCard, User as UserIcon, LogOut, Search
} from 'lucide-react';

const MOCK_REVENUE_DATA = [
  { name: 'Mon', revenue: 450 },
  { name: 'Tue', revenue: 1200 },
  { name: 'Wed', revenue: 900 },
  { name: 'Thu', revenue: 1600 },
  { name: 'Fri', revenue: 1400 },
  { name: 'Sat', revenue: 2100 },
  { name: 'Sun', revenue: 1800 },
];

export default function Dashboard() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved && saved !== "undefined" ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [stats, setStats] = useState({
    enrolledCourseCount: 0,
    completedLessonCount: 0,
    points: 0,
    courseStats: [],
    skillProgress: [],
    instructorStats: null
  });

  useEffect(() => {
    console.log("[DIAGNOSTIC] Dashboard mounting. User from localStorage:", user);
    api.get("/api/stats/me")
      .then(res => {
        console.log("[DIAGNOSTIC] Stats received:", res.data);
        if (res.data) {
          setStats({
            ...res.data,
            courseStats: res.data.courseStats || [],
            skillProgress: res.data.skillProgress || [],
          });
        }
      })
      .catch(err => console.error("[DIAGNOSTIC] Stats fetch failed:", err));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 text-white">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">LearnHub</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" to="/dashboard" active />
          <SidebarLink icon={<Compass size={20} />} label="Explore" to="/explore" />
          <SidebarLink icon={<CreditCard size={20} />} label="Payments" to="/payments" />
          <SidebarLink icon={<UserIcon size={20} />} label="Profile" to="/profile" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black">
              {user?.name?.[0] || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user?.role || "Student"}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-40 w-full glass border-b border-slate-100 px-8 py-4 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search courses..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-black text-slate-900 leading-none">{stats.points || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase mt-1">Total Points</div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <section>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hey {user?.name || "there"}! 👋</h1>
                <p className="text-slate-500 font-medium mt-2">Ready to master a new skill today?</p>
              </div>
              {user?.role === 'instructor' && (
                <button className="btn-premium flex items-center gap-2">
                  <PlusCircle size={20} />
                  Create Course
                </button>
              )}
            </div>
          </section>

          {user?.role === 'instructor' && stats.instructorStats && (
            <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                <div className="premium-card p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Revenue Analytics</h3>
                      <p className="text-slate-500 text-sm font-medium">Your daily earnings reports</p>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-dark p-8 rounded-[2rem] text-white">
                    <Users className="text-blue-400 mb-4" size={32} />
                    <div className="text-4xl font-black">{stats.instructorStats.totalStudents || 0}</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Active Students</div>
                  </div>
                  <div className="premium-card p-8">
                    <TrendingUp className="text-violet-500 mb-4" size={32} />
                    <div className="text-4xl font-black">{stats.instructorStats.activeCourses || 0}</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Live Courses</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/explore?filter=enrolled" className="block transform hover:scale-[1.02] transition-all">
              <StatCard icon={<BookOpen className="text-blue-600" size={24} />} value={stats.enrolledCourseCount} label="Courses Enrolled" trend="Keep moving forward!" color="bg-blue-50" />
            </Link>
            <Link to="/profile#lessons" className="block transform hover:scale-[1.02] transition-all">
              <StatCard icon={<CheckCircle className="text-emerald-500" size={24} />} value={stats.completedLessonCount} label="Lessons Completed" trend="Great progress!" color="bg-emerald-50" />
            </Link>
            <Link to="/profile#achievements" className="block transform hover:scale-[1.02] transition-all">
              <StatCard icon={<Award className="text-violet-500" size={24} />} value={stats.points} label="Points Earned" trend="Leaderboard active" color="bg-violet-50" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Play className="text-blue-600 fill-blue-600" size={20} />
                  Continue Learning
                </h3>
                {stats.courseStats?.length > 0 && (
                  <Link to="/explore?filter=enrolled" className="text-sm font-black text-blue-600 hover:underline">
                    See All ({stats.courseStats.length})
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(stats.courseStats || []).map((c, i) => (
                  <CourseMiniCard key={i} course={c} />
                ))}
                {(!stats.courseStats || stats.courseStats.length === 0) && (
                  <div className="col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-bold">
                    No courses enrolled yet. <Link to="/explore" className="text-blue-600 underline ml-1">Explore Marketplace</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="premium-card p-8">
                <h3 className="text-lg font-black mb-6">Learning Pulse</h3>
                <div className="space-y-6">
                  {(stats.skillProgress || []).map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                        <span className="text-slate-500">{s.label}</span>
                        <span className="text-blue-600">{s.progress}%</span>
                      </div>
                      <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${s.progress}%` }} />
                      </div>
                    </div>
                  ))}
                  {(!stats.skillProgress || stats.skillProgress.length === 0) && (
                    <p className="text-xs text-slate-400 font-bold italic">Loading analytics...</p>
                  )}
                </div>
              </div>

              <div className="glass p-8 rounded-[2rem] border-blue-100 bg-blue-50/50">
                <FileText className="text-blue-600 mb-4" size={24} />
                <h3 className="text-lg font-black text-slate-900">Study Materials</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Check individual course pages for downloadable PDF resources and roadmaps.</p>
                <Link to="/explore" className="mt-6 w-full py-3 bg-white text-blue-600 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                  Find Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, to, active }) {
  return (
    <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function StatCard({ icon, value, label, trend, color }) {
  return (
    <div className="premium-card p-8 group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="text-4xl font-black text-slate-900">{value !== undefined ? value : 0}</div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      <div className="h-[1px] w-full bg-slate-50 my-6" />
      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
  );
}

function CourseMiniCard({ course }) {
  if (!course || !course.title) return null;
  const percent = Math.round((course.completed / course.total) * 100) || 0;
  return (
    <div className="premium-card p-6 flex items-center gap-5 group">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 font-black text-xl">
        {course.title[0]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[10px] font-black text-slate-400">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
