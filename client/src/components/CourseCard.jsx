import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, User } from 'lucide-react';

const CourseCard = ({ course, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.thumbnail_url || `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {course.category_name}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{course.instructor_name}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-slate-700">{course.rating}</span>
                    </div>
                    <div className="text-lg font-black text-blue-600">
                        ${course.price}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
