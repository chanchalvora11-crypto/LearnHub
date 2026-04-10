import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-200 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm animate-pulse"></div>
                <GraduationCap className="w-6 h-6 text-white relative z-10" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
                Learn<span className="text-blue-600">Hub</span>
            </span>
        </div>
    );
};

export default Logo;
