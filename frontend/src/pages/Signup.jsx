import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-200/60 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/50 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-2xl font-black">
            Learn<span className="text-blue-600">Hub</span>
          </div>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        {err && (
          <motion.div
            className="mt-4 p-3 rounded-2xl bg-red-50 text-red-700 text-sm"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {err}
          </motion.div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            className="w-full px-4 py-3 rounded-2xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            className="w-full px-4 py-3 rounded-2xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full px-4 py-3 rounded-2xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
          <select
            className="w-full px-4 py-3 rounded-2xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            name="role"
            value={form.role}
            onChange={onChange}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link className="text-blue-600 font-semibold hover:underline" to="/login">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
