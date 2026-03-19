import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Smile, Frown, ShieldAlert, Award, ChevronRight, BookOpen } from 'lucide-react';
import PsychosocialTests from '../components/PsychosocialTests';
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
    const [currentTest, setCurrentTest] = useState(null); // 'vak' o 'dcsej'

    // Estado para recolectar información del alumno
    const [studentInfo, setStudentInfo] = useState({ id: '', nombre: '', curso: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleStartTestSequence = (testId) => {
        setCurrentTest(testId);
    };

    const handleIdentitySubmit = (e) => {
        e.preventDefault();
        if (studentInfo.id && studentInfo.nombre && studentInfo.curso) {
            setIsAuthenticated(true);
        }
    };

    if (currentTest) {
        return <PsychosocialTests type={currentTest} studentInfo={studentInfo} onBack={() => setCurrentTest(null)} />;
    }

    if (!isAuthenticated) {
        return (
            <div className="dashboard-student" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2.5rem', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '4px solid var(--primary)' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Bienvenido</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>Para personalizar tu experiencia y guardar tus resultados correctamente, por favor ingresa tus datos académicos.</p>
                    </div>
                    <form onSubmit={handleIdentitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>RUT o Identificador</label>
                            <input required type="text" value={studentInfo.id} onChange={e => setStudentInfo({ ...studentInfo, id: e.target.value })} placeholder="Ej: 21.000.000-K" className="glass-input" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'var(--transition)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Nombre Completo</label>
                            <input required type="text" value={studentInfo.nombre} onChange={e => setStudentInfo({ ...studentInfo, nombre: e.target.value })} placeholder="Ej: Juan Pérez" className="glass-input" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'var(--transition)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Curso</label>
                            <input required type="text" value={studentInfo.curso} onChange={e => setStudentInfo({ ...studentInfo, curso: e.target.value })} placeholder="Ej: 3° Medio A" className="glass-input" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'var(--transition)' }} />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Ingresar a mi Dashboard</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-student"
        >
            <header className="dash-header">
                <div>
                    <h1 className="greeting">Hola, <span className="text-gradient">{studentInfo.nombre.split(' ')[0] || 'Estudiante'}</span> 👋</h1>
                    <p className="subtitle">Tu mapa psicosocial de hoy. ¿Cómo está tu brújula interior?</p>
                </div>

                <div className="stats-glass">
                    <div className="stat">
                        <span className="stat-val text-gradient">Nivel 4</span>
                        <span className="stat-label">Resiliencia</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val text-gradient">2 / 4</span>
                        <span className="stat-label">Tests Completados</span>
                    </div>
                </div>
            </header>

            <div className="grid-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <section className="glass-panel module-card">
                        <div className="card-header">
                            <h3>Diario de Granularidad Emocional</h3>
                            <span className="badge-new">Rápido</span>
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
                                    ¡Gracias! Tu profesor podrá ver tu estado emocional grupal para apoyarte mejor.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    <section className="glass-panel module-card">
                        <div className="card-header">
                            <h3><BookOpen size={20} color="var(--primary)" /> Encuestas Psicosociales</h3>
                        </div>
                        <p className="card-desc">Completa estos instrumentos para que tus clases se adapten a tu forma de ser.</p>

                        <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <div className="test-promo glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Cuestionario CHAEA</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0', minHeight: '3rem' }}>Estilos de aprendizaje: Activo, Reflexivo, Teórico, Pragmático.</p>
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleStartTestSequence('chaea')}>Iniciar Test</button>
                            </div>
                            <div className="test-promo glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Adaptación Socioemocional</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0', minHeight: '3rem' }}>Diagnóstico DIA: Área Personal, Comunitaria y Ciudadana.</p>
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleStartTestSequence('socioemocional')}>Iniciar Test</button>
                            </div>
                            <div className="test-promo glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Motivación Educativa</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0', minHeight: '3rem' }}>Escala EME-S: Mide niveles de motivación intrínseca y extrínseca.</p>
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleStartTestSequence('motivacion')}>Iniciar Test</button>
                            </div>
                            <div className="test-promo glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Autoeficacia Académica</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0', minHeight: '3rem' }}>Escala EAPESA: Percepción de capacidad y competencia académica.</p>
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleStartTestSequence('autoeficacia')}>Iniciar Test</button>
                            </div>
                            <div className="test-promo glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Clima y Seguridad (EPJA)</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0', minHeight: '3rem' }}>Escala EPCSE: Percepción de respeto y seguridad nocturna.</p>
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleStartTestSequence('clima')}>Iniciar Test</button>
                            </div>
                        </div>
                    </section>

                </div>

                <div className="desktop-sidebar">


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
