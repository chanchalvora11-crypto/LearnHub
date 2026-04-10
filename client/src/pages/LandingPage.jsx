import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Play } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

const LandingPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('/api/courses');
                setCourses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="hero-gradient min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                            Master New Skills <br />
                            <span className="gradient-text">Anywhere, Anytime.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                            Explore thousands of professional courses designed to help you launch that career, learn a new craft, or expand your mind.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 group">
                                Explore Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 glass text-slate-700 font-bold rounded-2xl hover:bg-white transition-all flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                                </div>
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                Joined by <span className="text-slate-900 font-bold">10,000+</span> learners worldwide
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                                alt="Students learning"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass p-6 rounded-2xl shadow-xl z-20 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Course Certificate</div>
                                    <div className="text-xs text-slate-400">Successfully earned</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-20 px-6 container mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Our Popular Courses</h2>
                        <p className="text-slate-500 max-w-md">Hand-picked courses from top instructors to help you master any subject.</p>
                    </div>
                    <button className="text-blue-600 font-bold hover:underline mb-2">View All Courses</button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                    {courses.length === 0 && (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl"></div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
