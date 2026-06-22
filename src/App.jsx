// divineConnect/divineconnect_frontend/src/App.jsx
// REPLACE your entire existing App.jsx with this file

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TemplesPage from './pages/TemplesPage';
import EPujaPage from './pages/EPujaPage';
import AstrologyPage from './pages/AstrologyPage';
import PanditsPage from './pages/PanditsPage';
import PrayersPage from './pages/PrayersPage';
import ContactPage from './pages/ContactPage';
import CalendarPage from './pages/CalendarPage';   // ← NEW LINE

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/"          element={<Navigate to="/home" replace />} />
          <Route path="/home"      element={<HomePage />} />
          <Route path="/temples"   element={<TemplesPage />} />
          <Route path="/epuja"     element={<EPujaPage />} />
          <Route path="/astrology" element={<AstrologyPage />} />
          <Route path="/pandits"   element={<PanditsPage />} />
          <Route path="/prayers"   element={<PrayersPage />} />
          <Route path="/contact"   element={<ContactPage />} />
          <Route path="/calendar"  element={<CalendarPage />} />  {/* ← NEW LINE */}
          <Route path="*"          element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
