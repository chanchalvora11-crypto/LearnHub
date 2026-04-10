import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { CreditCard, CheckCircle, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Payments() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/payments/my")
      .then((r) => setRows(r.data))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-Inter pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Payments</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest font-black">Manage your course transactions</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
            Transaction History
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {rows.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-blue-100 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{p.title || p.course_title || "Course Enrollment"}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(p.paid_at || p.created_at).toLocaleDateString()}
                      </div>
                      <div className={`flex items-center gap-1 ${p.status === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        <CheckCircle size={12} />
                        {p.status || "Completed"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">₹{p.amount}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {p.transaction_ref?.substring(0, 10) || p.id}</div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            {rows.length === 0 && (
              <div className="py-20 text-center glass rounded-[2.5rem] border-dashed border-slate-200">
                <CreditCard className="mx-auto text-slate-100 mb-6" size={64} />
                <h4 className="text-xl font-black text-slate-300">No transactions found</h4>
                <p className="text-slate-400 font-medium mt-2">Start your learning journey to see history here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
