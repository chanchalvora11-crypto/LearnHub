import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Play, CheckCircle, Download, FileText, ChevronRight,
  Star, Users, Clock, Globe, Shield
} from "lucide-react";
import { motion } from "framer-motion";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get(`/api/courses/${id}`).then((r) => setData(r.data));
  }, [id]);

  const enroll = async () => {
    setMsg("");
    try {
      await api.post("/api/enrollments", { courseId: Number(id) });
      setMsg("Enrolled successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Enroll failed");
    }
  };

  const pay = async () => {
    setMsg("");
    try {
      await api.post("/api/payments/mockPay", { courseId: Number(id) });
      setMsg("Payment success! Redirecting to Dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Payment failed");
    }
  };

  if (!data) return (
    <div className="p-20 text-center font-black text-slate-400">
      <div className="animate-pulse mb-4 text-2xl">⚡ [DIAGNOSTIC] STABILIZING PREMIUM CONTENT...</div>
      <p className="text-sm">Fetching course ID: {id}</p>
    </div>
  );

  const { course, lessons, materials } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-Inter pb-20">
      {/* Dynamic Header */}
      <div className="bg-slate-900 pt-32 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              {course.category_name}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-xl font-medium mt-6 leading-relaxed max-w-xl">
              {course.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-8">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Rating</p>
                  <p className="text-lg font-black mt-1">4.9/5.0</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Students</p>
                  <p className="text-lg font-black mt-1">8.4k+</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-violet-400">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Language</p>
                  <p className="text-lg font-black mt-1">English</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sticky Purchase Card Mockup (for UI) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass-dark p-10 rounded-[2.5rem] border-slate-700/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Exclusive Offer</div>
              <div className="text-5xl font-black text-white mb-2">₹{course.price}</div>
              <p className="text-slate-500 text-sm font-bold mb-8 italic line-through">₹{course.price * 2}</p>

              <div className="space-y-4">
                <button
                  onClick={pay}
                  className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3"
                >
                  Enroll Now <ChevronRight size={20} />
                </button>
                <button
                  onClick={enroll}
                  className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <Shield size={16} className="text-emerald-500" />
                  30-Day Money-Back Guarantee
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <Play size={16} className="text-blue-500" />
                  Full Lifetime Access
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          <div className="space-y-8">
            {/* Syllabus Section */}
            <div className="premium-card p-10">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                Course Curriculum
              </h3>
              <div className="space-y-4">
                {lessons.map((l, idx) => (
                  <div key={l.id} className="group p-6 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">{l.title}</h4>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Video Module • 12:45</p>
                    </div>
                    <Link to={`/learn/${id}`} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                      <Play size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Footer (visible on mobile only) */}
            <div className="lg:hidden premium-card p-8 bg-slate-900 text-white">
              <div className="text-4xl font-black mb-6">₹{course.price}</div>
              <button onClick={pay} className="btn-premium w-full bg-blue-600 hover:bg-blue-700">Enroll Directly</button>
            </div>
          </div>

          <aside className="space-y-8">
            {/* Study Materials Cards */}
            <div className="premium-card p-10">
              <h3 className="text-xl font-black text-slate-900 mb-8">Study Resources</h3>
              <div className="space-y-4">
                {materials && materials.length > 0 ? (
                  materials.map((m) => (
                    <a
                      key={m.id}
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-slate-900 hover:text-white transition-all duration-500 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{m.title}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-blue-400">PDF Document</p>
                      </div>
                      <Download size={16} className="text-slate-300 group-hover:text-white" />
                    </a>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest leading-none">No materials</p>
                    <p className="text-[10px] mt-2">Check back later!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="glass p-10 rounded-[2.5rem] border-blue-100 bg-blue-600 text-white shadow-xl shadow-blue-200">
              <Users className="mb-6 opacity-50" size={32} />
              <h4 className="text-xl font-black">24/7 Mentorship</h4>
              <p className="text-blue-100 mt-2 font-medium leading-relaxed italic">"Our instructors are here to guide you every step of the way. Never study alone."</p>
              <button className="mt-8 w-full py-3 bg-white text-blue-600 rounded-xl font-bold shadow-sm hover:shadow-xl transition-all">
                Join Community
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* Success/Error Toasts */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl font-black z-50 flex items-center gap-4 ${msg.includes('success') ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
          {msg.includes('success') ? <CheckCircle size={24} /> : <Shield size={24} />}
          {msg}
        </motion.div>
      )}
    </div>
  );
}
