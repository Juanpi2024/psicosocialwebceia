import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { VideoPitchComposition } from './video/VideoPitchComposition';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, LayoutDashboard, Users, Code2, 
  Globe, Heart, ShieldCheck, X, Sparkles, Rocket, FileText
} from 'lucide-react';

import DashboardEstudiante from './pages/DashboardEstudiante';
import DashboardProfesor from './pages/DashboardProfesor';
import PortalFamilias from './pages/PortalFamilias';
import LandingPage from './pages/LandingPage';

const Layout = ({ children, setShowCredits }) => (
  <>
    <nav className="navbar">
      <div className="nav-brand">
        <HeartPulse className="icon-gradient" size={28} />
        <span>CEIA<span className="text-gradient">convivenciaescolar</span></span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Inicio</NavLink>
        <NavLink to="/estudiante" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Estudiante</NavLink>
        <NavLink to="/profesor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profesor</NavLink>
      </div>
    </nav>
    <main className="main-content">
      {children}
    </main>
    <footer className="app-footer" style={{ textAlign: 'center', padding: '3rem', opacity: 0.8 }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <button onClick={() => setShowCredits(true)} className="glass-btn"><Code2 size={18} /> Créditos</button>
        <NavLink to="/video-presentacion" className="glass-btn" style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}><Rocket size={18} /> Ver Pitch Galáctico</NavLink>
      </div>
      <p>App creada por <strong>Juan P. Ramirez</strong> | El Nexo Tecnológico</p>
    </footer>
  </>
);

const VideoPlayerPage = () => {
  const [activated, setActivated] = useState(false);
  return (
    <div style={{ height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!activated ? (
          <motion.div 
            key="launcher"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '800px', padding: '4rem', textAlign: 'center', border: '1.5px solid rgba(99, 102, 241, 0.5)', background: 'rgba(3, 7, 18, 0.8)', borderRadius: '40px', boxShadow: '0 0 100px rgba(99, 102, 241, 0.15)' }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ width: '120px', height: '120px', background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 40px var(--primary)' }}>
                <Rocket size={60} color="white" />
              </div>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '900' }}>SISTEMA <span className="text-gradient">LISTO</span></h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>Preparado para el Despegue de Presentación de Marca</p>
            </div>
            <button onClick={() => setActivated(true)} style={{ padding: '1.5rem 3.5rem', fontSize: '1.4rem', background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: '15px', margin: '0 auto' }} className="btn-hover-effect">
              <Sparkles size={24} /> LANZAR PITCH GALÁCTICO
            </button>
          </motion.div>
        ) : (
          <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', maxWidth: '1280px', position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '30px', border: '1px solid var(--primary)', background: 'rgba(3, 7, 18, 0.9)' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 'bold', letterSpacing: '2px' }}>MODO: PRESENTACIÓN DE ALTA FIDELIDAD</span>
                <NavLink to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>SALIR</NavLink>
              </div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
                <Player component={VideoPitchComposition} durationInFrames={600} compositionWidth={1920} compositionHeight={1080} fps={30} controls autoPlay loop style={{ width: '100%', aspectRatio: '16/9' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/video-presentacion" element={<VideoPlayerPage />} />
          <Route path="/" element={<Layout setShowCredits={setShowCredits}><LandingPage /></Layout>} />
          <Route path="/estudiante" element={<Layout setShowCredits={setShowCredits}><DashboardEstudiante /></Layout>} />
          <Route path="/profesor" element={<Layout setShowCredits={setShowCredits}><DashboardProfesor /></Layout>} />
          <Route path="/familia" element={<Layout setShowCredits={setShowCredits}><PortalFamilias /></Layout>} />
        </Routes>

        <AnimatePresence>
          {showCredits && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel" style={{ padding: '3rem', maxWidth: '600px' }}>
                <button onClick={() => setShowCredits(false)} className="close-btn"><X /></button>
                <h2>Tecnología y Visión</h2>
                <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p>• IA: OpenAI GPT-4o Integration</p>
                  <p>• Video: Remotion Engine</p>
                  <p>• UI: Framer Motion & Lucide</p>
                </div>
                <button onClick={() => setShowCredits(false)} className="btn btn-primary" style={{ width: '100%' }}>Cerrar</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
