import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star,
    Clock,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Play,
    CheckCircle,
    Shield,
    Award,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [openSections, setOpenSections] = useState([0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`/api/course/${id}`);
                setCourse(res.data);
                if (res.data.lessons.length > 0) setActiveLesson(res.data.lessons[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(`/api/enrollments/enroll/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Enrolled successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading Course...</div>;
    if (!course) return <div className="h-screen flex items-center justify-center">Course not found</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />

            {/* Course Banner */}
            <div className="pt-24 pb-12 px-6 hero-gradient relative">
                <div className="container mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Courses
                    </button>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-black mb-6 uppercase tracking-widest">
                                {course.category_name}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span>By <span className="text-slate-900">{course.instructor_name}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-slate-900">{course.rating} (120 Ratings)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span>12 Hours Content</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-4xl font-black text-blue-600">${course.price}</div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEnroll}
                                    className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 group animate-pulse"
                                >
                                    Enroll Now <Play className="w-5 h-5 fill-white" />
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group cursor-pointer"
                        >
                            <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-video">
                                <img
                                    src={course.thumbnail_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80`}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
                {/* Syllabus Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Course Syllabus</h2>
                        <div className="space-y-4">
                            {course.lessons.map((lesson, index) => (
                                <motion.div
                                    key={lesson.id}
                                    className="glass rounded-2xl overflow-hidden border border-slate-100"
                                >
                                    <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                                                <p className="text-sm text-slate-400">{lesson.duration || '10:00'}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                                            <Play className="w-4 h-4 fill-blue-600" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Reviews</h2>
                        <div className="space-y-6">
                            {course.reviews.map(review => (
                                <div key={review.id} className="glass p-8 rounded-[2rem] shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 capitalize">
                                                {review.user_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800">{review.user_name}</div>
                                                <div className="flex text-yellow-500 gap-1 mt-1">
                                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-500" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400">2 days ago</div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
                                </div>
                            ))}
                            {course.reviews.length === 0 && <p className="text-slate-400 font-medium italic">No reviews yet. Be the first to share your experience!</p>}
                        </div>
                    </div>
                </div>

                {/* Features Sidebar */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[2rem] border-2 border-slate-100 sticky top-24">
                        <h3 className="text-xl font-black text-slate-900 mb-6">Course Includes:</h3>
                        <ul className="space-y-4">
                            <FeatureItem icon={<Play className="w-5 h-5 text-blue-600" />} text="12 Hours on-demand video" />
                            <FeatureItem icon={<BookOpen className="w-5 h-5 text-blue-600" />} text="15 Downloadable resources" />
                            <FeatureItem icon={<Shield className="w-5 h-5 text-blue-600" />} text="Full lifetime access" />
                            <FeatureItem icon={<Award className="w-5 h-5 text-blue-600" />} text="Certificate of completion" />
                        </ul>
                        <hr className="my-8 border-slate-100" />
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-400 mb-4">Secure Payment & Money Back Guarantee</p>
                            <div className="flex justify-center gap-2 opacity-30 grayscale">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, text }) => (
    <li className="flex items-center gap-3 font-bold text-slate-600 group">
        <div className="p-2 rounded-lg bg-blue-50 group-hover:scale-110 transition-transform">{icon}</div>
        <span>{text}</span>
    </li>
);

export default CourseDetail;
