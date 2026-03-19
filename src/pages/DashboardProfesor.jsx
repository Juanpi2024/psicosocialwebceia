import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, BarChart3, Users, Award, FileText, Loader2, BookOpen, BrainCircuit, X, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './DashboardProfesor.css';
import { getTestResults } from '../services/psychosocialService';
import { socioemocionalQuestions } from '../data/socioemocionalData';
import { analyzePsychosocialData } from '../services/openaiService';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function DashboardProfesor() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('Todos');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' o 'alerts'
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [userApiKey, setUserApiKey] = useState(localStorage.getItem('openai_key') || '');
    const [showAiConfig, setShowAiConfig] = useState(false);

    const fetchResults = async () => {
        try {
            const data = await getTestResults();
            setResults(data);
        } catch (error) {
            console.error("Error al cargar resultados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 size={48} className="spin" color="var(--primary)" />
                <h3 style={{ color: 'var(--text-main)' }}>Cargando datos del servidor...</h3>
            </div>
        );
    }

    const courses = ['Todos', ...new Set(results.map(r => r.curso || 'Sin especificar'))];
    const filteredResults = selectedCourse === 'Todos' ? results : results.filter(r => r.curso === selectedCourse);

    const chaeaResults = filteredResults.filter(r => r.testId === 'chaea');
    const socioResults = filteredResults.filter(r => r.testId === 'socioemocional');
    const motivacionResults = filteredResults.filter(r => r.testId === 'motivacion');

    // Agrupar resultados por estudiante
    const groupedStudents = filteredResults.reduce((acc, current) => {
        const studentId = current.studentId || 'unknown';
        if (!acc[studentId]) {
            acc[studentId] = {
                studentId: current.studentId,
                studentName: current.studentName,
                curso: current.curso || 'Sin especificar',
                tests: []
            };
        }
        acc[studentId].tests.push(current);
        return acc;
    }, {});

    const studentsList = Object.values(groupedStudents);
    
    // Promedios CHAEA
    const avgChaea = { ACTIVO: 0, REFLEXIVO: 0, TEORICO: 0, PRAGMATICO: 0 };
    if (chaeaResults.length > 0) {
        chaeaResults.forEach(r => {
            avgChaea.ACTIVO += r.scores?.ACTIVO || 0;
            avgChaea.REFLEXIVO += r.scores?.REFLEXIVO || 0;
            avgChaea.TEORICO += r.scores?.TEORICO || 0;
            avgChaea.PRAGMATICO += r.scores?.PRAGMATICO || 0;
        });
        avgChaea.ACTIVO /= chaeaResults.length;
        avgChaea.REFLEXIVO /= chaeaResults.length;
        avgChaea.TEORICO /= chaeaResults.length;
        avgChaea.PRAGMATICO /= chaeaResults.length;
    }

    const chaeaChartData = {
        labels: ['Activo', 'Reflexivo', 'Teórico', 'Pragmático'],
        datasets: [{
            label: `Promedio CHAEA (${selectedCourse})`,
            data: [avgChaea.ACTIVO, avgChaea.REFLEXIVO, avgChaea.TEORICO, avgChaea.PRAGMATICO],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        }],
    };

    // Promedios Socioemocional
    let avgSocio = { GestionEmocional: 0, PercepcionAprendizaje: 0, InteraccionSocial: 0 };
    if (socioResults.length > 0) {
        socioResults.forEach(r => {
            avgSocio.GestionEmocional += r.scores?.GestionEmocional || 0;
            avgSocio.PercepcionAprendizaje += r.scores?.PercepcionAprendizaje || 0;
            avgSocio.InteraccionSocial += r.scores?.InteraccionSocial || 0;
        });
        avgSocio.GestionEmocional /= socioResults.length;
        avgSocio.PercepcionAprendizaje /= socioResults.length;
        avgSocio.InteraccionSocial /= socioResults.length;
    }

    const socioChartData = {
        labels: ['Gestión Emocional', 'Percepción del Aprendizaje', 'Interacción Social'],
        datasets: [{
            label: `Promedio Socioemocional (${selectedCourse})`,
            data: [avgSocio.GestionEmocional, avgSocio.PercepcionAprendizaje, avgSocio.InteraccionSocial],
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            borderColor: 'rgba(236, 72, 153, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(234, 179, 8, 1)',
        }],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12, family: 'Outfit' } },
                ticks: { display: false, min: 0 }
            }
        },
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    const requiresSupport = socioResults.filter(r => r.profile === 'Requiere Apoyo');
    
    const allCriticalAlerts = filteredResults.filter(r => 
        r.profile?.includes('Requiere Apoyo') || 
        r.profile?.includes('Bajo') || 
        r.profile?.includes('Crítica') ||
        (r.testId === 'socioemocional' && r.profile === 'Requiere Apoyo')
    ).map(r => ({
        ...r,
        studentData: groupedStudents[r.studentId]
    }));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-profesor">
            <header className="prof-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(3, 7, 18, 0.8)', padding: '1.5rem 2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="title-section">
                        <h1>Panel <span className="text-gradient">Analítico</span> Docente</h1>
                        <p>Monitoreo CEIA - {selectedCourse}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button 
                            onClick={async () => {
                                setAiLoading(true);
                                const report = await analyzePsychosocialData(filteredResults, selectedCourse, userApiKey);
                                setAiAnalysis(report);
                                setAiLoading(false);
                            }}
                            className="glass-btn btn-ai"
                            disabled={aiLoading}
                            style={{ 
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                                border: 'none', 
                                padding: '0.8rem 1.5rem', 
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                                cursor: aiLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {aiLoading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
                            {aiLoading ? 'Procesando con IA...' : 'Consultar Experto IA'}
                        </button>
                        <div className="tab-selector glass-panel" style={{ padding: '0.4rem', display: 'flex', gap: '0.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <button onClick={() => setActiveTab('overview')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: activeTab === 'overview' ? 'var(--gradient-primary)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
                            <button onClick={() => setActiveTab('alerts')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: activeTab === 'alerts' ? '#ef4444' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                Alertas {allCriticalAlerts.length > 0 && <span style={{ marginLeft: '0.5rem', background: 'white', color: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '50%', fontSize: '0.7rem' }}>{allCriticalAlerts.length}</span>}
                            </button>
                        </div>
                        <button onClick={() => setShowAiConfig(!showAiConfig)} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, background: userApiKey ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)' }}><Cpu size={20} color={userApiKey ? '#a855f7' : 'white'} /></button>
                        <button onClick={() => setShowHelp(true)} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}><BookOpen size={20} /></button>
                    </div>
                </div>

                <AnimatePresence>
                    {showAiConfig && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1rem', border: '1.5px solid #a855f7', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>API Key OpenAI (Sesión):</label>
                                    <input 
                                        type="password" 
                                        value={userApiKey} 
                                        onChange={(e) => {
                                            setUserApiKey(e.target.value);
                                            localStorage.setItem('openai_key', e.target.value);
                                        }}
                                        placeholder="sk-proj-..." 
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}
                                    />
                                </div>
                                <button onClick={() => setShowAiConfig(false)} className="btn btn-secondary" style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem' }}>Cerrar</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="kpi-row" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <div className="glass-panel kpi-card">
                        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', outline: 'none' }}>
                            {courses.map(c => <option key={c} value={c} style={{ background: '#111827' }}>{c}</option>)}
                        </select>
                        <span className="kpi-label">Filtro de Curso</span>
                    </div>
                    <div className="glass-panel kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
                        <span className="kpi-value" style={{ color: '#ef4444' }}>{requiresSupport.length}</span>
                        <span className="kpi-label">Requiere Apoyo</span>
                    </div>
                    <div className="glass-panel kpi-card">
                        <span className="kpi-value">{studentsList.length}</span>
                        <span className="kpi-label">Alumnos Evaluados</span>
                    </div>
                    <button onClick={() => window.print()} className="btn btn-primary" style={{ height: 'auto', padding: '0 1.5rem' }}><FileText size={18} /> Exportar Curso</button>
                </div>
            </header>

            <AnimatePresence>
                {showHelp && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(3, 7, 18, 0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '3rem', border: '1px solid var(--primary)' }}>
                            <button onClick={() => setShowHelp(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}><BookOpen className="text-gradient" size={30} /> Guía Técnica de Instrumentos</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--primary)' }}>CHAEA</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mide estilos de aprendizaje Activo, Reflexivo, Teórico y Pragmático para adaptar la pedagogía.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--secondary)' }}>DIA Socioemocional</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Basado en estándares Mineduc. Detecta niveles de adaptación y convivencia grupal.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowHelp(false)} className="btn btn-primary" style={{ width: '100%' }}>Entendido</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main style={{ padding: '2.5rem' }}>
                {activeTab === 'overview' ? (
                    <div className="dashboard-content">
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <section className="glass-panel" style={{ padding: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={20} color="var(--primary)" /> Perfil de Aprendizaje (CHAEA)</h3>
                                    <div style={{ height: '300px' }}>
                                        <Radar data={chaeaChartData} options={radarOptions} />
                                    </div>
                                </section>

                                <section className="glass-panel" style={{ padding: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BrainCircuit size={20} color="var(--accent)" /> Adaptación Socioemocional (DIA)</h3>
                                    <div style={{ height: '300px' }}>
                                        <Radar data={socioChartData} options={radarOptions} />
                                    </div>
                                </section>
                                <section className="glass-panel" style={{ padding: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}><Users size={20} color="var(--secondary)" /> Listado de Estudiantes</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {studentsList.map(s => (
                                            <div key={s.studentId} onClick={() => setSelectedStudent(s)} className="student-row" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{s.studentName.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>{s.studentName}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.curso}</div>
                                                    </div>
                                                </div>
                                                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{s.tests.length} Tests</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            <aside className="glass-panel" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#ef4444' }}><ShieldAlert size={20} /> Alerts de Intervención</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {requiresSupport.map((r, i) => (
                                        <div key={i} onClick={() => setSelectedStudent(groupedStudents[r.studentId])} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>
                                            <div style={{ fontWeight: 'bold' }}>{r.studentName}</div>
                                            <div style={{ fontSize: '0.8rem' }}>Socioemocional: Requiere Apoyo</div>
                                        </div>
                                    ))}
                                    {requiresSupport.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay alertas críticas en este curso.</p>}
                                </div>
                            </aside>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="alerts-center">
                        <section className="glass-panel" style={{ padding: '3rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <h2 style={{ color: '#ef4444', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><ShieldAlert size={32} /> Central de Alertas Críticas</h2>
                            <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                                    <div>Estudiante</div>
                                    <div>Hallazgo</div>
                                    <div>Nivel Riesgo</div>
                                    <div>Acción</div>
                                </div>
                                {allCriticalAlerts.map((alert, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold' }}>{alert.studentName}</div>
                                        <div>{alert.testId.toUpperCase()} - {alert.profile}</div>
                                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>Crítico</div>
                                        <button onClick={() => setSelectedStudent(alert.studentData)} className="btn btn-primary" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' }}>Ver Ficha</button>
                                    </div>
                                ))}
                                {allCriticalAlerts.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sin alertas críticas registradas.</div>}
                            </div>
                        </section>
                    </motion.div>
                )}
            </main>

            {/* MODAL EXPEDIENTE */}
            <AnimatePresence>
                {selectedStudent && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel" style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}>
                            <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white' }}><X size={24} /></button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>{selectedStudent.studentName.charAt(0)}</div>
                                <div>
                                    <h2 style={{ fontSize: '2.5rem' }}>{selectedStudent.studentName}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{selectedStudent.curso} | RUT: {selectedStudent.studentId}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {selectedStudent.tests.map((test, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <h3 style={{ color: 'var(--primary)' }}>{test.testId.toUpperCase()}</h3>
                                            <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: test.profile?.includes('Apoyo') ? '#ef4444' : 'var(--primary)', fontWeight: 'bold' }}>{test.profile}</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                                            <div style={{ height: '200px' }}>
                                                <Radar 
                                                    data={{
                                                        labels: Object.keys(test.scores || {}),
                                                        datasets: [{
                                                            data: Object.values(test.scores || {}),
                                                            backgroundColor: 'rgba(99, 102, 241, 0.3)',
                                                            borderColor: 'rgba(99, 102, 241, 1)'
                                                        }]
                                                    }} 
                                                    options={radarOptions} 
                                                />
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                                                <h4 style={{ marginBottom: '1rem', color: 'var(--accent)' }}><Lightbulb size={18} /> Recomendación</h4>
                                                <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                    {test.profile?.includes('Apoyo') ? "Priorizar seguimiento en consejo de curso e informar a equipo PIE." : "Continuar monitoreo preventivo semestral."}
                                                </p>
                                                
                                                {test.testId === 'socioemocional' && (
                                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                                        <h5 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Respuestas Críticas:</h5>
                                                        <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
                                                            {test.answers?.slice(0, 3).map((ans, idx) => (
                                                                <li key={idx} style={{ marginBottom: '0.4rem' }}>
                                                                    - "{socioemocionalQuestions.find(q => q.id === ans.id)?.text}" ({ans.value} pts)
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => window.print()} className="btn btn-primary" style={{ marginTop: '3rem', width: '100%' }}><FileText size={18} /> Descargar Informe de Alumno</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL IA: INFORME DEL EXPERTO */}
            <AnimatePresence>
                {aiAnalysis && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000, background: 'rgba(3, 7, 18, 0.98)', backdropFilter: 'blur(25px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="glass-panel" style={{ maxWidth: '1000px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '4rem', border: '1.5px solid #a855f7', borderRadius: '32px', position: 'relative', boxShadow: '0 0 100px rgba(168, 85, 247, 0.15)' }}>
                            <button onClick={() => setAiAnalysis(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}><X size={28} /></button>
                            
                            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
                                    <Sparkles size={40} color="white" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Análisis Psicosocial <span style={{ color: '#a855f7' }}>IA</span></h2>
                                    <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>Motor GPT-4o | Informe Ejecutivo de Curso: {selectedCourse}</p>
                                </div>
                            </div>

                            <div className="markdown-body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                {aiAnalysis}
                            </div>
                            
                            <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
                                <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, padding: '1.5rem', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }}><FileText size={20} /> Guardar Informe IA</button>
                                <button onClick={() => setAiAnalysis(null)} className="btn btn-secondary" style={{ flex: 1, padding: '1.5rem' }}>Cerrar Análisis</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
