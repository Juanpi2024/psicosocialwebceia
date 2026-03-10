import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Smile, Frown, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import './DashboardEstudiante.css';

const emotions = [
    { id: 'alegria', label: 'Alegría', color: '#10B981', icon: Smile },
    { id: 'calma', label: 'Calma', color: '#3B82F6', icon: Compass },
    { id: 'frustracion', label: 'Frustración', color: '#F59E0B', icon: Frown },
    { id: 'ansiedad', label: 'Ansiedad', color: '#8B5CF6', icon: ShieldAlert },
];

const badges = [
    { id: 'resilience', title: 'Caballero Mindful', desc: 'Recuperación tras un error', icon: Award, color: '#F43F5E' },
    { id: 'helper', title: 'Apoyo Empático', desc: 'Ayudaste a un compañero', icon: Sparkles, color: '#10B981' },
];

export default function DashboardEstudiante() {
    const [selectedEmotion, setSelectedEmotion] = useState(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-student"
        >
            <header className="dash-header">
                <div>
                    <h1 className="greeting">Hola, <span className="text-gradient">Estudiante</span> 👋</h1>
                    <p className="subtitle">Tu mapa psicosocial de hoy. ¿Cómo está tu brújula interior?</p>
                </div>

                <div className="stats-glass">
                    <div className="stat">
                        <span className="stat-val text-gradient">Nivel 4</span>
                        <span className="stat-label">Autoconocimiento</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val text-gradient">20%</span>
                        <span className="stat-label">Progreso Test ERE</span>
                    </div>
                </div>
            </header>

            <div className="grid-layout">
                <section className="glass-panel module-card">
                    <div className="card-header">
                        <h3>Diario de Granularidad Emocional</h3>
                        <span className="badge-new">Nuevo</span>
                    </div>
                    <p className="card-desc">Selecciona la emoción que más resuena contigo en este momento de la jornada escolar.</p>

                    <div className="emotions-grid">
                        {emotions.map((emotion) => {
                            const Icon = emotion.icon;
                            const isSelected = selectedEmotion === emotion.id;

                            return (
                                <motion.button
                                    key={emotion.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedEmotion(emotion.id)}
                                    className={`emotion-btn ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        borderColor: isSelected ? emotion.color : 'var(--border-color)',
                                        boxShadow: isSelected ? `0 0 20px ${emotion.color}40` : 'none'
                                    }}
                                >
                                    <Icon size={28} color={emotion.color} />
                                    <span style={{ color: isSelected ? emotion.color : 'var(--text-muted)' }}>
                                        {emotion.label}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>

                    <AnimatePresence>
                        {selectedEmotion && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="emotion-feedback"
                            >
                                ¡Gracias por registrarlo! Conocer lo que sientes es el primer paso para dominarlo.
                            </motion.div>
                        )}
                    </AnimatePresence>

                </section>

                <div className="desktop-sidebar">
                    <section className="glass-panel module-card">
                        <h3>Test Situacional (DCSE-J)</h3>
                        <div className="situational-test-preview">
                            <div className="story-snippet">
                                <h4>"El trabajo en grupo"</h4>
                                <p>Tus compañeros no están participando y quedan 2 días para entregar el trabajo de Historia. ¿Qué decides hacer?</p>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Iniciar Historia <ChevronRight size={18} />
                            </button>
                        </div>
                    </section>

                    <section className="glass-panel module-card badges-card">
                        <h3>Praise Badges <Award size={18} style={{ color: 'var(--accent)', marginLeft: '8px' }} /></h3>
                        <p className="card-desc">Reconocimientos de tus profesores</p>
                        <div className="badges-list">
                            {badges.map(b => (
                                <div key={b.id} className="badge-item">
                                    <div className="badge-icon" style={{ background: `${b.color}20`, color: b.color }}>
                                        <b.icon size={20} />
                                    </div>
                                    <div className="badge-info">
                                        <h4>{b.title}</h4>
                                        <p>{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}
