import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    Search,
    Bell,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ enrolledCourseCount: 0, completedLessonCount: 0, points: 0 });
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, statsRes] = await Promise.all([
                    axios.get('/api/courses'),
                    axios.get('/api/stats/me')
                ]);
                setCourses(coursesRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="glass border-r border-slate-200 h-screen flex flex-col relative z-30"
            >
                <div className="p-6 flex items-center justify-between mb-8">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Logo />
                            </motion.div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active isOpen={isSidebarOpen} />
                    <SidebarItem icon={<BookOpen />} label="My Courses" isOpen={isSidebarOpen} />
                    <SidebarItem icon={<Settings />} label="Settings" isOpen={isSidebarOpen} />
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
                    >
                        <LogOut className="w-6 h-6" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-20 -right-4 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all z-40"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header */}
                <header className="glass sticky top-0 z-20 px-8 py-4 flex items-center justify-between border-b border-white/50">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-all">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-800">{user.name}</div>
                                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold shadow-sm">
                                {user.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="mb-12">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back, {user.name.split(' ')[0]}! 👋</h1>
                        <p className="text-slate-500">You're doing great! You have completed 0% of your current goal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatsCard label="Courses Enrolled" value={stats.enrolledCourseCount} color="blue" />
                        <StatsCard label="Completed Lessons" value={stats.completedLessonCount} color="green" />
                        <StatsCard label="Points Earned" value={stats.points} color="purple" />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900">Recommended for you</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-blue-600 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false, isOpen = true }) => (
    <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-white hover:text-blue-600'
        }`}>
        <div className="flex-shrink-0">{icon}</div>
        {isOpen && <span className="whitespace-nowrap">{label}</span>}
    </button>
);

const StatsCard = ({ label, value, color }) => {
    const colors = {
        blue: 'from-blue-500 to-indigo-600 shadow-blue-200',
        green: 'from-emerald-500 to-teal-600 shadow-emerald-200',
        purple: 'from-violet-500 to-purple-600 shadow-violet-200'
    };
    return (
        <div className={`p-8 rounded-[2rem] bg-gradient-to-br ${colors[color]} text-white shadow-xl`}>
            <div className="text-4xl font-black mb-2">{value}</div>
            <div className="text-white/80 font-bold">{label}</div>
        </div>
    );
};

export default Dashboard;
