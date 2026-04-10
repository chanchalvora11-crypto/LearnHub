import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 font-sans">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
