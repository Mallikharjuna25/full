import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import CalendarPage from './pages/CalendarPage';
import Profile from './pages/Profile';
import HostEvent from './pages/HostEvent';
import CreateEvent from './pages/CreateEvent';
import EventAnalytics from './pages/EventAnalytics';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import QRScannerPage from './components/QRScanner';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1E293B',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }
                    }}
                />

                {/* Render Navbar only on non-admin routes */}
                <Routes>
                    <Route path="/admin/*" element={null} />
                    <Route path="*" element={<Navbar />} />
                </Routes>

                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/events/:id" element={<EventDetails />} />
                            <Route path="/admin/login" element={<AdminLogin />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/home" element={<Home />} />
                                <Route path="/calendar" element={<CalendarPage />} />
                                <Route path="/my-events" element={<MyEvents />} />
                                <Route path="/my-events/:id" element={<EventDetails />} />
                                <Route path="/host-event" element={<HostEvent />} />
                                <Route path="/host-event/create" element={<CreateEvent />} />
                                <Route path="/host-event/edit/:id" element={<CreateEvent />} />

                                {/* Wrap scanner in a div for layout */}
                                <Route path="/host-event/:id/scan" element={
                                    <div style={{ paddingTop: '100px', padding: '20px' }}>
                                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Participant Scanner</h2>
                                        <QRScannerPage />
                                    </div>
                                } />

                                <Route path="/host-event/:id/analytics" element={<EventAnalytics />} />
                                <Route path="/profile" element={<Profile />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<AdminRoute />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/events/:id" element={<EventDetails />} />
                                <Route path="/admin/analytics/:id" element={<EventAnalytics />} />
                            </Route>

                            {/* Catch-all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
