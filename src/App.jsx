import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import TemplesPage from './pages/TemplesPage';
import AstrologyPage from './pages/AstrologyPage';
import PanditsPage from './pages/PanditsPage';
import PrayersPage from './pages/PrayersPage';
import ContactPage from './pages/ContactPage';
import CalendarPage from './pages/CalendarPage';
import ScripturesPage from './pages/ScripturesPage';
import ScriptureDetailPage from './pages/ScriptureDetailPage';
import WishlistPage from './pages/WishlistPage';

// Pages that require login
const PROTECTED = [
  { path: '/prayers', element: <PrayersPage />, label: 'Prayers' },
  { path: '/astrology', element: <AstrologyPage />, label: 'Astrology' },
  { path: '/scriptures', element: <ScripturesPage />, label: 'Scriptures' },
  { path: '/scriptures/:slug', element: <ScriptureDetailPage />, label: 'Scriptures' },
  { path: '/wishlist', element: <WishlistPage />, label: 'Wishlist' },
];

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <ToastProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/temples" element={<TemplesPage />} />
                  <Route path="/pandits" element={<PanditsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />

                  {/* Protected routes — require login */}
                  {PROTECTED.map(({ path, element, label }) => (
                    <Route key={path} path={path} element={
                      <ProtectedRoute label={label}>{element}</ProtectedRoute>
                    } />
                  ))}

                  {/* Bhajans not built yet — also protected */}
                  <Route path="/bhajans" element={
                    <ProtectedRoute label="Bhajans">
                      <div className="flex items-center justify-center min-h-screen text-gray-400">Bhajans coming soon</div>
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </main>
              <Footer />
            </BrowserRouter>
          </WishlistProvider>
        </ToastProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}
