import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck, HeartPulse } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

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
                    onClick={() => navigate('/profesor')}
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
        </div>
    );
}
