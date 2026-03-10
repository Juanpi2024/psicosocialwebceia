import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, LayoutDashboard, Search, Users } from 'lucide-react';

import DashboardEstudiante from './pages/DashboardEstudiante';
import DashboardProfesor from './pages/DashboardProfesor';
import PortalFamilias from './pages/PortalFamilias';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <HeartPulse className="icon-gradient" size={28} />
            <span>Mineduc<span className="text-gradient">Bienestar</span></span>
          </div>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={18} /> Estudiante
              </span>
            </NavLink>
            <NavLink to="/profesor" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={18} /> Profesor
              </span>
            </NavLink>
            <NavLink to="/familia" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} /> Familias
              </span>
            </NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardEstudiante />} />
            <Route path="/profesor" element={<DashboardProfesor />} />
            <Route path="/familia" element={<PortalFamilias />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
