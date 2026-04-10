import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Compass, BookOpen, Star, ArrowLeft } from "lucide-react";

export default function Explore() {
  const [q, setQ] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    const url = filter === "enrolled"
      ? "/api/enrollments/my"
      : `/api/courses?search=${encodeURIComponent(q)}`;

    api.get(url)
      .then((r) => {
        // Map enrolled response format to course format if needed
        const data = r.data.map(item => ({
          ...item,
          id: item.course_id || item.id // Use course_id from enrollments or id from courses
        }));
        setCourses(data);
      })
      .catch(() => setCourses([]));
  }, [q, filter]);

  return (
    <div className="min-h-screen bg-slate-50 font-Inter pb-20">
      {/* Hero Search Section */}
      <div className="bg-slate-900 py-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Compass size={14} />
            {filter === "enrolled" ? "My Learning" : "Marketplace"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white leading-tight"
          >
            {filter === "enrolled" ? (
              <>Your <span className="gradient-text">Enrolled Courses</span></>
            ) : (
              <>What do you want <br /> to <span className="gradient-text">learn today?</span></>
            )}
          </motion.h1>

          {filter === "enrolled" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <Link to="/explore" className="text-blue-400 hover:text-blue-300 font-bold flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to Marketplace
              </Link>
            </motion.div>
          )}

          {filter !== "enrolled" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 max-w-2xl mx-auto relative"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input
                className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white border-none shadow-2xl shadow-black/20 text-lg font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Search 1,000+ premium courses..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c, i) => (
            <motion.div
              key={c.id}
              className="premium-card group h-full flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    {c.title[0]}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {c.category_name || "Course"}
                  </div>
                </div>

                <Link to={`/course/${c.id}`} className="block group/title">
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover/title:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                </Link>

                <p className="text-slate-500 text-sm font-medium mt-4 line-clamp-2 flex-grow">
                  {c.description}
                </p>

                <div className="mt-8 flex items-center gap-4 py-4 border-t border-slate-50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">1.2k students</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">₹{c.price}</span>
                  </div>
                  <Link
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                    to={`/course/${c.id}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No courses found</h3>
            <p className="text-slate-500 font-medium mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
