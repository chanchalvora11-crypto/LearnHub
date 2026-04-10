import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    courseStats: [],
    skillProgress: [],
    enrolledCourseCount: 0,
    completedLessonCount: 0,
    points: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle hash-based navigation
    const hash = window.location.hash.replace("#", "");
    if (["overview", "lessons", "achievements"].includes(hash)) {
      setActiveTab(hash);
    }

    Promise.all([
      api.get("/api/profile/me").catch(e => ({ error: true, e })),
      api.get("/api/stats/me").catch(e => ({ error: true, e }))
    ]).then(([profileRes, statsRes]) => {
      if (profileRes.data && !profileRes.error) setMe(profileRes.data);
      if (statsRes.data && !statsRes.error) {
        setStats({
          ...statsRes.data,
          courseStats: statsRes.data.courseStats || [],
          skillProgress: statsRes.data.skillProgress || [],
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 font-Inter pb-20">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-3xl border shadow-sm p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-100">
              {me?.name?.[0] || "?"}
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">{me?.name}</div>
              <div className="text-slate-500 font-bold">{me?.email}</div>
              <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                {me?.role}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" />
            <TabButton active={activeTab === "lessons"} onClick={() => setActiveTab("lessons")} label="Lessons" />
            <TabButton active={activeTab === "achievements"} onClick={() => setActiveTab("achievements")} label="Points" />
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white rounded-3xl border shadow-sm p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Course Performance
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.courseStats || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="title" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} interval={0} tickFormatter={(val) => val.length > 20 ? val.substring(0, 15) + '...' : val} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '16px' }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Progress Overview
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.courseStats || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="completed" nameKey="title">
                      {(stats?.courseStats || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-2xl font-black text-slate-900">Module Completion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(stats?.courseStats || []).map((c, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-400 font-black uppercase mt-1">{c.completed} / {c.total} Lessons Done</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${c.completed === c.total ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {Math.round((c.completed / c.total) * 100) || 0}%
                  </div>
                </div>
              ))}
              {(stats?.courseStats?.length === 0) && <p className="text-slate-400 font-bold italic py-10">No lesson data found.</p>}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-2xl font-black text-slate-900">Earning Breakdown</h3>
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
              <div className="text-6xl font-black mb-2">{stats.points}</div>
              <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">Total Lifetime Points</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Enrollment Bonus</p>
                  <p className="text-2xl font-black">{stats.enrolledCourseCount * 150} pts</p>
                  <p className="text-[10px] text-slate-500 mt-1">150 pts per course joined</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Lesson Completion</p>
                  <p className="text-2xl font-black">{stats.completedLessonCount * 50} pts</p>
                  <p className="text-[10px] text-slate-500 mt-1">50 pts per module finished</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${active
          ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
        }`}
    >
      {label}
    </button>
  );
}
