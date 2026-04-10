import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
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

      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="font-extrabold text-xl tracking-tight">
          Learn<span className="text-blue-600">Hub</span>
        </div>
        <div className="flex gap-3">
          <Link className="px-4 py-2 rounded-xl hover:bg-blue-50" to="/login">Login</Link>
          <Link className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" to="/signup">Signup</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.h1
          className="text-4xl md:text-6xl font-black leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Learn skills that <span className="text-blue-600">level you up</span>.
        </motion.h1>

        <motion.p
          className="mt-5 text-lg text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Courses, enrollments, progress tracking — everything for your DBMS project demo.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Link to="/signup" className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Get Started
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-2xl bg-white shadow hover:shadow-md font-semibold">
            Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
