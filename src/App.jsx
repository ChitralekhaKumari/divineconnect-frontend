import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import BhajanPlayerBar from './components/BhajanPlayerBar';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import TemplesPage from './pages/TemplesPage';
import AstrologyPage from './pages/AstrologyPage';
import PanditsPage from './pages/PanditsPage';
import PrayersPage from './pages/PrayersPage';
import PrayerDetailPage from './pages/PrayerDetailPage';
import ContactPage from './pages/ContactPage';
import CalendarPage from './pages/CalendarPage';
import CalendarDetailPage from './pages/CalendarDetailPage';
import CalendarMonthPage from './pages/CalendarMonthPage';
import ScripturesPage from './pages/ScripturesPage';
import ScriptureDetailPage from './pages/ScriptureDetailPage';
import WishlistPage from './pages/WishlistPage';
import BhajansPage from './pages/BhajansPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminTemplesPage from './pages/admin/AdminTemplesPage';
import AdminPrayersPage from './pages/admin/AdminPrayersPage';

// Pages that require login
const PROTECTED = [
  { path: '/prayers', element: <PrayersPage />, label: 'Prayers' },
  { path: '/prayers/:slug', element: <PrayerDetailPage />, label: 'Prayers' },
  { path: '/astrology', element: <AstrologyPage />, label: 'Astrology' },
  { path: '/scriptures', element: <ScripturesPage />, label: 'Scriptures' },
  { path: '/scriptures/:slug', element: <ScriptureDetailPage />, label: 'Scriptures' },
  { path: '/wishlist', element: <WishlistPage />, label: 'Wishlist' },
  { path: '/bhajans', element: <BhajansPage />, label: 'Bhajans' },
];

// The admin dashboard has its own sidebar shell — it doesn't get the
// public Navbar / Footer / BhajanPlayerBar chrome.
function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/home" replace />} />
          <Route path="home" element={<AdminHomePage />} />
          <Route path="temples" element={<AdminTemplesPage />} />
          <Route path="prayers" element={<AdminPrayersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/temples" element={<TemplesPage />} />
          <Route path="/pandits" element={<PanditsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calendar/:type" element={<CalendarDetailPage />} />
          <Route path="/calendar/:type/:year/:month" element={<CalendarMonthPage />} />

          {/* Protected routes — require login */}
          {PROTECTED.map(({ path, element, label }) => (
            <Route key={path} path={path} element={
              <ProtectedRoute label={label}>{element}</ProtectedRoute>
            } />
          ))}

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
      <BhajanPlayerBar />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <ToastProvider>
          <WishlistProvider>
            <AudioPlayerProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AppRoutes />
              </BrowserRouter>
            </AudioPlayerProvider>
          </WishlistProvider>
        </ToastProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}
