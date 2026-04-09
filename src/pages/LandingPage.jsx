import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, HeartPulse, Lock, X } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'ceia2026') {
            navigate('/profesor');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div className="landing-container">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="landing-hero"
            >
                <div className="hero-badge">
                    <HeartPulse className="icon-pulse" size={20} />
                    <span>Mineduc Bienestar Psicosocial</span>
                </div>
                <h1>Ecosistema de <span className="text-gradient">Bienestar Integral</span></h1>
                <p>Plataforma de diagnóstico y acompañamiento socioemocional para la Educación de Personas Jóvenes y Adultas (EPJA).</p>
            </motion.div>

            <div className="role-selector">
                <motion.div 
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="role-card student-card glass-panel"
                    onClick={() => navigate('/estudiante')}
                >
                    <div className="role-icon-wrapper">
                        <User size={40} color="var(--primary)" />
                    </div>
                    <h2>Soy Estudiante</h2>
                    <p>Accede a tus encuestas, mide tu bienestar y obtén insignias de resiliencia.</p>
                    <button className="btn btn-primary">Ingresar al Portal</button>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="role-card teacher-card glass-panel"
                    onClick={() => setShowAuth(true)}
                >
                    <div className="role-icon-wrapper">
                        <ShieldCheck size={40} color="var(--secondary)" />
                    </div>
                    <h2>Soy Docente</h2>
                    <p>Gestiona diagnósticos, visualiza resultados grupales y apoya a tus alumnos.</p>
                    <button className="btn btn-secondary">Panel de Gestión</button>
                </motion.div>
            </div>

            <motion.footer 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="landing-footer"
            >
                <p>© 2026 Mineduc - CEIA - Programa de Bienestar Psicosocial EPJA</p>
            </motion.footer>
            <AnimatePresence>
                {showAuth && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="login-overlay"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', maxWidth: '400px', width: '90%', position: 'relative', border: '1px solid var(--secondary)' }}
                        >
                            <button 
                                onClick={() => { setShowAuth(false); setError(''); setPassword(''); }}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <Lock size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Acceso Restringido</h2>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Portal exclusivo para personal docente.</p>
                            </div>
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <input 
                                        type="password" 
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: 'white', boxSizing: 'border-box', fontSize: '1.1rem', outline: 'none' }}
                                        placeholder="Ingresa la clave..."
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        autoFocus
                                    />
                                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
                                </div>
                                <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}>
                                    Entrar al Panel
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
