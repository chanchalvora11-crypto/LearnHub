import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/">
                    <Logo />
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Courses</Link>
                    <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Mentors</Link>
                    <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-5 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-full transition-all">
                        Login
                    </Link>
                    <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
