import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Smile, Frown, ShieldAlert, BookOpen, BrainCircuit, Sparkles, Award, ChevronRight } from 'lucide-react';
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
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [currentTest, setCurrentTest] = useState(null); 

    // Estado para recolectar información del alumno
    const [studentInfo, setStudentInfo] = useState({ id: '', nombre: '', curso: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [completedTests, setCompletedTests] = useState([]);

    const handleStartTestSequence = (testId) => {
        setCurrentTest(testId);
    };

    const handleIdentitySubmit = (e) => {
        e.preventDefault();
        if (studentInfo.id && studentInfo.nombre && studentInfo.curso) {
            setIsAuthenticated(true);
            fetchProgress(studentInfo.id);
        }
    };

    const fetchProgress = async (studentId) => {
        try {
            const results = await getTestResults();
            const studentResults = results.filter(r => r.studentId === studentId);
            const uniqueCompleted = [...new Set(studentResults.map(r => r.testId))];
            setCompletedTests(uniqueCompleted);
        } catch (error) {
            console.error("Error fetching progress:", error);
        } finally {
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
                        <span className="stat-val text-gradient">
                            {Math.round((completedTests.length / 6) * 100)}%
                        </span>
                        <span className="stat-label">Progreso Total</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val text-gradient">{completedTests.length} / 6</span>
                        <span className="stat-label">Completados</span>
                    </div>
                </div>
            </header>

            <div className="progress-bar-container" style={{ margin: '-1.5rem 0 2rem 0', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedTests.length / 6) * 100}%` }}
                    style={{ height: '100%', background: 'var(--gradient-primary)', boxShadow: '0 0 15px var(--primary-glow)' }}
                />
            </div>

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
                        <p className="card-desc" style={{ marginBottom: '1.5rem' }}>Completa estos instrumentos para que tus clases se adapten a tu forma de ser.</p>

                        <div className="tests-container-grid">
                            {[
                                { id: 'chaea', title: 'Estilos de Aprendizaje', desc: 'Modelo VAK y CHAEA: Visual, Auditivo o Kinestésico.', icon: Sparkles, type: 'secondary' },
                                { id: 'socioemocional', title: 'Resiliencia (SV-RES)', desc: 'Evaluación de adaptación y ajuste socioemocional (DIA).', icon: ShieldAlert, type: 'secondary' },
                                { id: 'motivacion', title: 'Motivación Educativa', desc: 'Escala EME-S: Mide niveles de motivación intrínseca y extrínseca.', icon: Compass, type: 'secondary' },
                                { id: 'autoeficacia', title: 'Autoeficacia Académica', desc: 'Escala EAPESA: Percepción de capacidad y competencia.', icon: BrainCircuit, type: 'secondary' },
                                { id: 'clima', title: 'Clima y Seguridad', desc: 'Escala EPCSE: Percepción de respeto y seguridad nocturna.', icon: Award, type: 'secondary' },
                                { id: 'dcsej', title: 'Test Situacional', desc: '"El desafío grupal": Historia interactiva para medir asertividad.', icon: ChevronRight, type: 'primary' }
                            ].map((test, index) => {
                                const Icon = test.icon;
                                return (
                                    <motion.div
                                        key={test.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`test-card-item glass-panel ${test.id === 'dcsej' ? 'highlighted' : ''}`}
                                    >
                                        <div className="test-card-content">
                                            <div className="test-card-header">
                                                <h4>{test.title}</h4>
                                                <Icon size={20} className={test.id === 'dcsej' ? 'primary-icon' : 'muted-icon'} />
                                            </div>
                                            <p>{test.desc}</p>
                                        </div>
                                        <button 
                                            className={`btn btn-${test.id === 'dcsej' ? 'primary' : (completedTests.includes(test.id) ? 'outline' : 'secondary')}`}
                                            onClick={() => handleStartTestSequence(test.id)}
                                            style={{ opacity: completedTests.includes(test.id) ? 0.7 : 1 }}
                                        >
                                            {completedTests.includes(test.id) ? 'Repetir Test' : (test.id === 'dcsej' ? 'Empezar Historia' : 'Iniciar Test')}
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
