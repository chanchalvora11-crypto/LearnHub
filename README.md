# 🎓 LearnHub – Full Stack E-Learning Platform

LearnHub is a full-stack web application designed to provide a seamless and interactive e-learning experience. It enables users to explore courses, enroll, track progress, and manage their learning journey through a modern and intuitive interface.
This project was built with a focus on real-world application architecture, combining frontend design, backend logic, and database integration.

## 🌐 Overview

The platform simulates a real-world online learning system where:
- Users can sign up and log in securely
- Browse and explore courses
- Enroll in courses and track their progress
- View personalized dashboards
- Manage profiles and activity

The goal of this project was to implement a scalable and structured full-stack system with clean UI and efficient backend handling.

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion (for animations)
- Axios (API handling)

### Backend
- Node.js
- Express.js
- REST API Architecture
- JWT Authentication

### Database
- PostgreSQL

## ✨ Features

### 🔐 Authentication System
- Secure login and signup using JWT
- Token-based authentication for protected routes
- Persistent login sessions

### 📚 Course Management
- View available courses
- Detailed course pages with structured content
- Dynamic rendering of course data

### 🧑‍💻 User Dashboard
- Personalized dashboard interface
- Displays enrolled courses and user stats
- Clean and responsive UI

### 📈 Progress Tracking
- Track enrolled course progress
- Monitor learning journey

### 💳 Enrollment System
- Enroll in courses via backend APIs
- Maintain enrollment records in database

### 👤 Profile Management
- View and update user profile
- Track activity and enrolled courses

## 🧱 Project Structure

LearnHub/
│
├── backend/          # Express backend (API + DB)
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   ├── db.js         # Database connection
│   └── server.js     # Main server file
│
├── client/           # Main frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│
├── frontend/         # Additional UI structure (experimental/extended UI)
│
├── package.json
└── README.md

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 1️⃣ Clone the repository

```bash
git clone https://github.com/chanchalvora11-crypto/LearnHub.git
cd LearnHub
````

### 2️⃣ Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file inside the `backend` folder:

```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=learnhub
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret
```

### 4️⃣ Run the project

```bash
# Start backend
cd backend
npm start

# Start frontend
cd ../client
npm run dev
```

## 📊 Database

The application uses PostgreSQL for data storage.

Key tables include:

* Users
* Courses
* Enrollments
* Progress Tracking

Schema and seed files are included in the backend directory.

## 🎯 Key Highlights

* Full-stack architecture (Frontend + Backend + Database)
* Clean and modular code structure
* Real-world features like authentication and dashboards
* Responsive UI with modern design
* RESTful API integration

## 🚀 Future Improvements

* Payment gateway integration
* Admin panel for course management
* Video streaming support
* Deployment (AWS / Vercel / Render)
* Role-based access control

## 🤝 Contribution

This project was built as part of academic and personal learning. Contributions and suggestions are always welcome.

## 📌 Note

PostgreSQL is required to run this project locally.
Ensure your database is properly configured before starting the backend server.

## 👨‍💻 Author

**Chanchal Vora**
B.Tech IT Student | Full Stack Developer

