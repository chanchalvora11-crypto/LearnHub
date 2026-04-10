import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Private from "./lib/Private";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import CourseDetail from "./pages/CourseDetail";
import Learn from "./pages/Learn";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/explore" element={<Private><Explore /></Private>} />
        <Route path="/course/:id" element={<Private><CourseDetail/></Private>} />
        <Route path="/learn/:courseId" element={<Private><Learn /></Private>} />
        <Route path="/payments" element={<Private><Payments /></Private>} />
        <Route path="/profile" element={<Private><Profile /></Private>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
