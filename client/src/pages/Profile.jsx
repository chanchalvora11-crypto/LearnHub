import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Award,
    BookOpen,
    Settings,
    Edit2,
    ChevronRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [stats, setStats] = useState({ enrolledCourseCount: 0, completedLessonCount: 0, points: 0, skillProgress: [] });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    axios.get('/api/profile/me'),
                    axios.get('/api/stats/me')
                ]);
                setUser(profileRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Error fetching profile data", err);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-32 px-6">
                <div className="container mx-auto max-w-5xl">
                    {/* Profile Header */}
                    <div className="glass p-8 md:p-12 rounded-[3rem] shadow-xl mb-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="relative">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl overflow-hidden group">
                                <div className="w-full h-full rounded-[2.3rem] border-4 border-white overflow-hidden bg-white">
                                    <img
                                        src={`https://i.pravatar.cc/300?u=${user.id}`}
                                        className="w-full h-full object-cover"
                                        alt="profile"
                                    />
                                </div>
                                <button className="absolute bottom-2 right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl font-black text-slate-900">{user.name}</h1>
                                <div className="inline-flex px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest self-center md:self-auto">
                                    {user.role} Learner
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-bold mb-8">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                    <span>Joined Feb 2026</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:scale-105">
                                    Edit Profile
                                </button>
                                <button className="px-8 py-3 glass text-slate-700 font-bold rounded-2xl hover:bg-white transition-all">
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Stats */}
                        <div className="md:col-span-4 space-y-8">
                            <div className="glass p-8 rounded-[2rem] shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 mb-8">Learning Stats</h3>
                                <div className="space-y-6">
                                    <StatItem icon={<BookOpen className="w-5 h-5" />} label="Courses Enrolled" value={stats.enrolledCourseCount} color="blue" />
                                    <StatItem icon={<Award className="w-5 h-5" />} label="Certificates Earned" value={Math.floor(stats.completedLessonCount / 5)} color="green" />
                                    <StatItem icon={<Clock className="w-5 h-5" />} label="Learning Hours" value={`${Math.floor(stats.completedLessonCount * 0.5)}h`} color="purple" />
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[2rem] shadow-sm overflow-hidden relative group cursor-pointer">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                <h4 className="font-black text-blue-600 mb-2">PRO PLAN</h4>
                                <p className="text-slate-800 font-bold mb-4">Get unlimited access to all courses</p>
                                <button className="text-sm font-black text-blue-600 flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                                    Upgrade Now <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Achievement / Progress */}
                        <div className="md:col-span-8 space-y-8">
                            <div className="glass p-8 md:p-12 rounded-[3rem] shadow-sm">
                                <h3 className="text-2xl font-black text-slate-900 mb-8">Skill Progress</h3>
                                <div className="space-y-10">
                                    {stats.skillProgress && stats.skillProgress.map((skill, index) => (
                                        <ProgressItem key={index} label={skill.label} progress={skill.progress} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-black text-slate-900">Recent Achievements</h3>
                                <button className="text-blue-600 font-bold hover:underline">View All</button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="glass p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center hover:shadow-lg transition-all group">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                            <Award className="w-8 h-8" />
                                        </div>
                                        <div className="text-xs font-black text-slate-800">Swift Learner</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value, color }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-emerald-100 text-emerald-600',
        purple: 'bg-purple-100 text-purple-600'
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
                <span className="font-bold text-slate-500">{label}</span>
            </div>
            <span className="text-xl font-black text-slate-900">{value}</span>
        </div>
    );
};

const ProgressItem = ({ label, progress }) => (
    <div>
        <div className="flex items-center justify-between mb-3">
            <span className="font-black text-slate-800">{label}</span>
            <span className="font-black text-blue-600">{progress}%</span>
        </div>
        <div className="h-4 bg-blue-50 rounded-full overflow-hidden p-1 border border-blue-100">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-200"
            />
        </div>
    </div>
);

export default Profile;
