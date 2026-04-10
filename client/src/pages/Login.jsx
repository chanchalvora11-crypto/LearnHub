import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 md:p-12 rounded-[2rem] shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="mb-6" />
                    <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Login to continue your learning</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, x: [0, -5, 5, -5, 5, 0] }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
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

                    <div className="flex justify-end">
                        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Logging in...' : 'Login'} <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
