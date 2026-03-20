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

const COURSES = [
    '7° Y 8° BASICO',
    '1° Y 2° MEDIO HC',
    '3° Y 4° MEDIO HC',
    '1° Y 2° MEDIO ELECTRICO',
    '3° MEDIO ELECTRICO',
    '4° MEDIO ELECTRICO',
    '1° Y 2° MEDIO PÁRVULO',
    '3° MEDIO PÁRVULO',
    '4° MEDIO PÁRVULO'
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
            setLoading(false);
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchProgress(parsedUser.rut);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUser = {
            name: formData.get('name'),
            rut: formData.get('rut'),
            curso: formData.get('curso')
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        fetchProgress(newUser.rut);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setCompletedTests([]);
    };

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
        window.scrollTo(0, 0); // Asegurar que el test empiece arriba
        setCurrentTest(testId);
    };

    if (currentTest) {
        return <PsychosocialTests type={currentTest} studentInfo={user} onBack={() => {
            setCurrentTest(null);
            fetchProgress(user.rut);
        }} />;
    }

    if (!user) {
        return (
            <div className="login-overlay">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel login-card"
                >
                    <div className="login-header">
                        <User size={40} color="var(--primary)" />
                        <h2>Identificación de Estudiante</h2>
                        <p>Ingresa tus datos para registrar tus avances en las encuestas.</p>
                    </div>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>Nombre Completo</label>
                            <input type="text" name="name" placeholder="Ej: Juan Pérez" required />
                        </div>
                        <div className="input-group">
                            <label>RUT</label>
                            <input type="text" name="rut" placeholder="Ej: 12.345.678-K" required />
                        </div>
                        <div className="input-group">
                            <label>Curso</label>
                            <select name="curso" required defaultValue="">
                                <option value="" disabled>Selecciona tu curso...</option>
                                {COURSES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-large" style={{ marginTop: '1rem' }}>
                            Ingresar al Portal
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-body)' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    const testList = [
        { id: 'chaea', title: 'Estilos de Aprendizaje', desc: 'Identifica cómo prefieres aprender.', icon: Sparkles },
        { id: 'socioemocional', title: 'Adaptación Socioemocional', desc: 'Tu bienestar y autoconocimiento.', icon: ShieldAlert },
        { id: 'motivacion', title: 'Motivación Educativa', desc: '¿Qué te impulsa a estudiar?', icon: Compass },
        { id: 'autoeficacia', title: 'Autoeficacia Académica', desc: 'Confianza en tus capacidades.', icon: BrainCircuit },
        { id: 'clima', title: 'Clima y Seguridad', desc: 'Tu percepción de la jornada nocturna.', icon: Award },
        { id: 'dcsej', title: 'Desafío Grupal (Historia)', desc: 'Resuelve situaciones de convivencia.', icon: ChevronRight }
    ];

    const progressPercentage = Math.round((completedTests.length / testList.length) * 100);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dashboard-estudiante"
            style={{ paddingBottom: '10rem' }} // Mucho mas espacio abajo
        >
            <header className="dash-header">
                <div className="welcome-section">
                    <h1 className="greeting">Hola, <span className="text-gradient">{(user?.name || 'Estudiante').split(' ')[0]}</span> 👋</h1>
                    <p className="subtitle" style={{ fontSize: '1rem' }}>
                        {user?.curso} | RUT: {user?.rut}
                        <button onClick={handleLogout} className="btn-text" style={{ marginLeft: '1rem', color: 'var(--accent)', fontSize: '0.8rem' }}>
                             (Cambiar Usuario)
                        </button>
                    </p>
                    <p className="subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Tu progreso: {completedTests.length} de {testList.length} encuestas listas.</p>
                </div>

                <div className="stats-glass">
                    <div className="stat">
                        <span className="stat-val text-gradient">{progressPercentage}%</span>
                        <span className="stat-label">Completado</span>
                    </div>
                </div>
            </header>

            <div className="progress-bar-container" style={{ margin: '1rem 0 2rem', background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    style={{ height: '100%', background: 'var(--gradient-primary)', boxShadow: '0 0 15px var(--primary-glow)' }}
                />
            </div>

            <div className="grid-layout">
                {/* Diario Emocional */}
                <section className="glass-panel module-card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Smile size={20} color="var(--secondary)" /> Diario de Emociones</h3>
                    </div>
                    <div className="emotions-grid">
                        {emotions.map((emotion) => {
                            const Icon = emotion.icon;
                            const isSelected = selectedEmotion === emotion.id;
                            return (
                                <motion.button
                                    key={emotion.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedEmotion(emotion.id)}
                                    className={`emotion-btn ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        borderColor: isSelected ? emotion.color : 'var(--border-color)',
                                        background: isSelected ? `${emotion.color}15` : 'transparent'
                                    }}
                                >
                                    <Icon size={24} color={emotion.color} />
                                    <span>{emotion.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </section>

                {/* Grid de Encuestas */}
                <section className="glass-panel module-card">
                    <div className="card-header">
                        <h3><BookOpen size={20} color="var(--primary)" /> Encuestas Disponibles</h3>
                    </div>
                    <p className="card-desc">Todas las encuestas están activas. Si ya completaste una, puedes repetirla.</p>

                    <div className="tests-container-grid">
                        {testList.map((test, index) => {
                            const Icon = test.icon;
                            const isDone = completedTests.includes(test.id);
                            return (
                                <motion.div
                                    key={test.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`test-card-item ${isDone ? 'is-completed' : ''}`}
                                    style={{ 
                                        position: 'relative', 
                                        zIndex: 1, 
                                        border: isDone ? '1px solid var(--secondary)' : '1px solid var(--border-color)' 
                                    }}
                                >
                                    <div className="test-card-header">
                                        <h4>{test.title}</h4>
                                        <Icon size={22} color={isDone ? 'var(--secondary)' : 'var(--primary)'} />
                                    </div>
                                    <p>{test.desc}</p>
                                    <button 
                                        className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={() => handleStartTestSequence(test.id)}
                                        style={{ 
                                            width: '100%', 
                                            cursor: 'pointer',
                                            boxShadow: !isDone ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                                        }}
                                    >
                                        {isDone ? 'Repetir Test' : 'Iniciar Encuesta'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
