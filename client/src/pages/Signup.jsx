import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/signup', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-xl p-8 md:p-12 rounded-[2rem] shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="mb-6" />
                    <h2 className="text-3xl font-black text-slate-900">Create your account</h2>
                    <p className="text-slate-500 mt-2">Join LearnHub and start your journey today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${formData.role === 'student' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white/50'
                                }`}
                        >
                            <div className={`p-3 rounded-xl ${formData.role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <span className={`font-bold ${formData.role === 'student' ? 'text-blue-600' : 'text-slate-500'}`}>I'm a Student</span>
                        </div>
                        <div
                            onClick={() => setFormData({ ...formData, role: 'instructor' })}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${formData.role === 'instructor' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white/50'
                                }`}
                        >
                            <div className={`p-3 rounded-xl ${formData.role === 'instructor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className={`font-bold ${formData.role === 'instructor' ? 'text-blue-600' : 'text-slate-500'}`}>I'm an Instructor</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
