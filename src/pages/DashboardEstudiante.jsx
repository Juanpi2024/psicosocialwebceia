import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Smile, Frown, ShieldAlert, BookOpen, BrainCircuit, Sparkles, Award, ChevronRight, User, X, AlertCircle, Lightbulb, Loader2 } from 'lucide-react';
import PsychosocialTests from '../components/PsychosocialTests';
import { getTestResults } from '../services/psychosocialService';
import './DashboardEstudiante.css';

const emotions = [
    { id: 'alegria', label: 'Alegría', color: '#10B981', icon: Smile },
    { id: 'calma', label: 'Calma', color: '#3B82F6', icon: Compass },
    { id: 'frustracion', label: 'Frustración', color: '#F59E0B', icon: Frown },
    { id: 'ansiedad', label: 'Ansiedad', color: '#8B5CF6', icon: ShieldAlert },
];

export default function DashboardEstudiante() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTest, setCurrentTest] = useState(null);
    const [completedTests, setCompletedTests] = useState([]);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            const guestUser = { name: 'Invitado CEIA', rut: '12.345.678-K' };
            setUser(guestUser);
            fetchProgress(guestUser.rut);
            setLoading(false);
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchProgress(parsedUser.rut);
    }, []);

    const fetchProgress = async (rut) => {
        try {
            const results = await getTestResults();
            if (!results || !Array.isArray(results)) return;
            
            const studentResults = results.filter(r => r?.studentId === rut);
            const uniqueCompleted = [...new Set(studentResults.map(r => r?.testId).filter(Boolean))];
            setCompletedTests(uniqueCompleted);
        } catch (error) {
            console.error("Error fetching progress:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTestSequence = (testId) => {
        setCurrentTest(testId);
    };

    if (currentTest) {
        return <PsychosocialTests type={currentTest} studentInfo={user} onBack={() => {
            setCurrentTest(null);
            fetchProgress(user.rut);
        }} />;
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-body)' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    const progressPercentage = Math.round((completedTests.length / 6) * 100);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dashboard-estudiante"
        >
            <header className="dash-header">
                <div className="welcome-section">
                    <h1 className="greeting">Hola, <span className="text-gradient">{(user?.name || 'Estudiante').split(' ')[0]}</span> 👋</h1>
                    <p className="subtitle">Tu mapa psicosocial de hoy. ¿Cómo está tu brújula interior?</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button 
                        onClick={() => setShowInstructions(true)}
                        className="btn btn-secondary" 
                        style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem' }}
                    >
                        <AlertCircle size={18} /> ¿Cómo completar?
                    </button>
                    <div className="stats-glass">
                        <div className="stat">
                            <span className="stat-val text-gradient">{progressPercentage}%</span>
                            <span className="stat-label">Progreso</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val text-gradient">{completedTests.length}/6</span>
                            <span className="stat-label">Completados</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="progress-bar-container" style={{ margin: '-1.5rem 2.5rem 2rem 2.5rem', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    style={{ height: '100%', background: 'var(--gradient-primary)', boxShadow: '0 0 15px var(--primary-glow)' }}
                />
            </div>

            {/* MODAL DE INSTRUCCIONES ALUMNO */}
            <AnimatePresence>
                {showInstructions && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, background: 'rgba(3, 7, 18, 0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', position: 'relative', border: '1.5px solid var(--primary)' }}
                        >
                            <button onClick={() => setShowInstructions(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                            
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Sparkles className="text-gradient" size={30} /> Tu Espacio de Apoyo</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={18} /> ¿Por qué hacemos esto?</h3>
                                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                        Estas encuestas nos ayudan a conocer mejor cómo aprendes y cómo te sientes en el CEIA. Tus respuestas nos permiten crear talleres y apoyos pensados especialmente para ti. Tu opinión es fundamental.
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Consejos para llenar</h3>
                                    <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem' }}>
                                        <li>No hay respuestas correctas ni incorrectas.</li>
                                        <li>Sé lo más sincero posible; tus datos son confidenciales y solo los verá el equipo de apoyo.</li>
                                        <li>Tómate tu tiempo para leer cada afirmación.</li>
                                        <li>Si tienes dudas, ¡no dudes en preguntarnos!</li>
                                    </ul>
                                </div>
                            </div>

                            <button onClick={() => setShowInstructions(false)} className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%', padding: '1.1rem', background: 'var(--gradient-primary)', fontWeight: 'bold' }}>¡Vale, empecemos!</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid-layout" style={{ padding: '0 2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Diario Emocional */}
                    <section className="glass-panel module-card">
                        <div className="card-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Smile size={20} color="var(--secondary)" /> Diario de Emociones</h3>
                            <span className="badge-new">Rápido</span>
                        </div>
                        <p className="card-desc">Selecciona la emoción que más resuena contigo hoy.</p>

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
                                            background: isSelected ? `${emotion.color}15` : 'transparent',
                                            padding: '1rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.3s'
                                        }}
                                    >
                                        <Icon size={28} color={emotion.color} />
                                        <span style={{ color: isSelected ? emotion.color : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: isSelected ? 'bold' : 'normal' }}>
                                            {emotion.label}
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </section>

                    <section className="glass-panel module-card">
                        <div className="card-header">
                            <h3><BookOpen size={20} color="var(--primary)" /> Encuestas Psicosociales</h3>
                        </div>
                        <p className="card-desc" style={{ marginBottom: '1.5rem' }}>Completa estos instrumentos para que tus clases se adapten a tu forma de ser.</p>

                        <div className="tests-container-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { id: 'chaea', title: 'Estilos de Aprendizaje', desc: 'Identifica cómo prefieres aprender.', icon: Sparkles },
                                { id: 'socioemocional', title: 'Adaptación Socioemocional', desc: 'Tu bienestar y autoconocimiento.', icon: ShieldAlert },
                                { id: 'motivacion', title: 'Motivación Educativa', desc: '¿Qué te impulsa a estudiar?', icon: Compass },
                                { id: 'autoeficacia', title: 'Autoeficacia Académica', desc: 'Confianza en tus capacidades.', icon: BrainCircuit },
                                { id: 'clima', title: 'Clima y Seguridad', desc: 'Tu percepción de la jornada nocturna.', icon: Award },
                                { id: 'dcsej', title: 'Desafío Grupal (Historia)', desc: 'Resuelve situaciones de convivencia.', icon: ChevronRight }
                            ].map((test, index) => {
                                const Icon = test.icon;
                                const isDone = completedTests.includes(test.id);
                                return (
                                    <motion.div
                                        key={test.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="test-card-item glass-panel"
                                        style={{ padding: '1.5rem', border: isDone ? '1px solid var(--secondary)' : '1px solid rgba(255,255,255,0.05)', background: isDone ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{test.title}</h4>
                                            <Icon size={24} color={isDone ? 'var(--secondary)' : 'var(--text-muted)'} />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '3rem' }}>{test.desc}</p>
                                        <button 
                                            className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={() => handleStartTestSequence(test.id)}
                                            style={{ width: '100%', opacity: isDone ? 0.8 : 1 }}
                                        >
                                            {isDone ? 'Repetir Test' : 'Iniciar'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}
