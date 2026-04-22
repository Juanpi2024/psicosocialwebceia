import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
// Data imports removed - using dynamic scoring from results
import { analyzePsychosocialData, analyzeStudentData } from '../services/openaiService';
import logoCeia from '../assets/logo_ceia.png';

const ALL_SURVEY_IDS = ['participacion', 'clima_convivencia', 'autoestima_motivacion', 'afectividad_genero', 'chaea'];

const SURVEY_LABELS = {
    participacion: 'Participación Ciudadana',
    clima_convivencia: 'Clima y Convivencia Escolar',
    autoestima_motivacion: 'Autoestima y Motivación Escolar',
    afectividad_genero: 'Afectividad, Sexualidad y Género',
    chaea: 'Estilos de Aprendizaje (CHAEA)'
};

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

const REPORT_TEMPLATES = {
    chaea: {
        ACTIVO: "Alumno con estilo predominante Activo. Aprende mejor con actividades prácticas, dinámicas de grupo y experiencias concretas. Se recomienda incorporar juegos de rol, debates y proyectos manuales.",
        REFLEXIVO: "Alumno con estilo predominante Reflexivo. Necesita tiempo para observar y analizar antes de actuar. Se recomienda dar espacio para la reflexión, diarios de aprendizaje y actividades de análisis.",
        TEORICO: "Alumno con estilo predominante Teórico. Busca coherencia lógica y modelos conceptuales. Se recomienda usar mapas conceptuales, lecturas estructuradas y explicaciones con fundamento.",
        PRAGMATICO: "Alumno con estilo predominante Pragmático. Prefiere la aplicación práctica del conocimiento. Se recomienda vincular contenidos con situaciones reales y proyectos aplicados.",
        'REFLEXIVO/PRAGMÁTICO': "Perfil mixto Reflexivo-Pragmático. Combina análisis profundo con orientación a la acción. Potenciar con estudios de caso y resolución de problemas reales.",
        'ACTIVO/PRAGMÁTICO': "Perfil mixto Activo-Pragmático. Aprende haciendo y busca resultados tangibles. Ideal para proyectos prácticos con impacto directo.",
    },
    autoestima_motivacion: {
        risk: "ALERTA: Perfil de riesgo en autoestima o motivación. Se detectan indicadores de desmotivación o baja autopercepción. Se recomienda entrevista personal, identificación de barreras y plan de re-enganche con metas a corto plazo.",
        healthy: "Perfil adecuado en autoestima y motivación. El estudiante muestra recursos de autoconfianza y metas claras. Continuar con refuerzo positivo y seguimiento semestral.",
    },
    clima_convivencia: {
        vulnerable: "ALERTA: Percepción de clima escolar descendido. El estudiante podría sentirse inseguro o poco acogido. Se recomienda abordaje con equipo de convivencia para identificar factores de riesgo institucional.",
        positive: "Clima percibido como positivo. El estudiante se siente acogido y seguro en el CEIA. Mantener y reforzar las buenas prácticas de convivencia.",
    },
    afectividad_genero: {
        low: "ALERTA: Bajo conocimiento en afectividad, sexualidad y género. Se recomienda reforzar contenidos de educación integral en sexualidad y derivar a talleres de formación ciudadana.",
        adequate: "Nivel adecuado de conocimiento en la temática. El estudiante demuestra comprensión de derechos, vínculos saludables y autocuidado.",
    }
};

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
    const [studentAiAnalysis, setStudentAiAnalysis] = useState(null);
    const [studentAiLoading, setStudentAiLoading] = useState(false);
    const navigate = useNavigate();

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

    const courses = ['Todos', ...COURSES];
    const filteredResults = selectedCourse === 'Todos' ? (results || []) : (results || []).filter(r => r?.curso === selectedCourse);

    const chaeaResults = (filteredResults || []).filter(r => r?.testId === 'chaea');
    const autoestResults = (filteredResults || []).filter(r => r?.testId === 'autoestima_motivacion');

    // Agrupar resultados por estudiante
    const groupedStudents = (filteredResults || []).reduce((acc, current) => {
        const studentId = current?.studentId || 'unknown';
        if (!acc[studentId]) {
            acc[studentId] = {
                studentId: studentId,
                studentName: current?.studentName || 'Estudiante sin nombre',
                curso: current?.curso || 'Sin especificar',
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

    // Promedios Autoestima y Motivación
    let avgAutoest = { Autoestima: 0, Autorregulacion: 0, 'Motivacion Intrinseca': 0, 'Motivacion Extrinseca': 0, Riesgo: 0 };
    if (autoestResults.length > 0) {
        autoestResults.forEach(r => {
            avgAutoest.Autoestima += r.scores?.Autoestima || 0;
            avgAutoest.Autorregulacion += r.scores?.Autorregulacion || 0;
            avgAutoest['Motivacion Intrinseca'] += r.scores?.['Motivacion Intrinseca'] || 0;
            avgAutoest['Motivacion Extrinseca'] += r.scores?.['Motivacion Extrinseca'] || 0;
            avgAutoest.Riesgo += r.scores?.Riesgo || 0;
        });
        Object.keys(avgAutoest).forEach(k => avgAutoest[k] /= autoestResults.length);
    }

    const autoestChartData = {
        labels: ['Autoestima', 'Autorregulación', 'Motiv. Intrínseca', 'Motiv. Extrínseca', 'Riesgo'],
        datasets: [{
            label: `Promedio Autoestima/Motivación (${selectedCourse})`,
            data: [avgAutoest.Autoestima, avgAutoest.Autorregulacion, avgAutoest['Motivacion Intrinseca'], avgAutoest['Motivacion Extrinseca'], avgAutoest.Riesgo],
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

    const requiresSupport = (filteredResults || []).filter(r => 
        r?.profile?.includes('Riesgo') || 
        r?.profile?.includes('Baja') || 
        r?.profile?.includes('Vulnerable') ||
        r?.profile?.includes('Requiere')
    );
    
    const allCriticalAlerts = (filteredResults || []).filter(r => 
        r?.profile?.includes('Riesgo') || 
        r?.profile?.includes('Baja') || 
        r?.profile?.includes('Vulnerable') ||
        r?.profile?.includes('Requiere')
    ).map(r => ({
        ...r,
        studentData: groupedStudents[r?.studentId || 'unknown']
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
                        <button onClick={() => setShowAiConfig(!showAiConfig)} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, background: userApiKey ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)' }}><Sparkles size={20} color={userApiKey ? '#a855f7' : 'white'} /></button>
                        <button onClick={() => navigate('/ayuda')} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }} title="Ir al Centro de Ayuda"><BookOpen size={20} /></button>
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
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BrainCircuit size={20} color="var(--accent)" /> Autoestima y Motivación</h3>
                                    <div style={{ height: '300px' }}>
                                        <Radar data={autoestChartData} options={radarOptions} />
                                    </div>
                                </section>
                                <section className="glass-panel" style={{ padding: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}><Users size={20} color="var(--secondary)" /> Listado de Estudiantes</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {studentsList.map(s => (
                                            <div key={s.studentId} onClick={() => setSelectedStudent(s)} className="student-row" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{(s?.studentName || 'E').charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>{s?.studentName || 'Estudiante'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s?.curso || 'Sin curso'}</div>
                                                    </div>
                                                </div>
                                                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{(s?.tests || []).length} Tests</div>
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
                                            <div style={{ fontSize: '0.8rem' }}>{SURVEY_LABELS[r.testId] || r.testId}: {r.profile}</div>
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
                    <div className="print-student-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel print-modal-content" style={{ maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}>
                            
                            {/* Header exclusivo para Impresión/PDF */}
                            <div className="only-print report-header" style={{ display: 'none', borderBottom: '2px solid black', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                <div className="report-header only-print" style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
                            <img src={logoCeia} alt="Logo" style={{ height: '80px', width: 'auto' }} />
                                        <div>
                                            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>CEIA PARRAL</h1>
                                            <p style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>EXPEDIENTE PSICOSOCIAL ESTUDIANTIL</p>
                                            <p style={{ fontSize: '1rem', fontStyle: 'italic' }}>Juanita Zúñiga - Educación de Adultos</p>
                                        </div>
                                    </div>
                                    <p style={{ margin: '15px 0 0', display: 'flex', justifyContent: 'space-between' }}>
                                        <span><strong>Fecha:</strong> {new Date().toLocaleDateString()}</span>
                                        <span><strong>RUT Estudiante:</strong> {selectedStudent?.studentId || 'Desconocido'}</span>
                                    </p>
                                </div>
                            </div>

                            <button className="no-print" onClick={() => { setSelectedStudent(null); setStudentAiAnalysis(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 10 }}>
                                <X size={24} />
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>{(selectedStudent?.studentName || 'E').charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '2.5rem' }}>{selectedStudent?.studentName || 'Estudiante'}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{selectedStudent?.curso || 'Sin curso'} | RUT: {selectedStudent?.studentId || 'Desconocido'}</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <span style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                            {selectedStudent.tests.length} de 6 Test Completados
                                        </span>
                                        <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                            Último movimiento: {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={async () => {
                                        setStudentAiLoading(true);
                                        const analysis = await analyzeStudentData(selectedStudent, userApiKey);
                                        setStudentAiAnalysis(analysis);
                                        setStudentAiLoading(false);
                                    }}
                                    className="btn no-print" 
                                    style={{ 
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                                        color: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem',
                                        padding: '1rem 1.5rem'
                                    }}
                                    disabled={studentAiLoading}
                                >
                                    {studentAiLoading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
                                    Analizar Caso con IA
                                </button>
                            </div>

                            {studentAiAnalysis && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.2)', marginBottom: '3rem' }}
                                >
                                    <h3 style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <Sparkles size={20} /> Informe Estratégico AI
                                    </h3>
                                    <div style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: 'rgba(255,255,255,0.9)' }}>
                                        {studentAiAnalysis}
                                    </div>
                                </motion.div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                <h3 className="only-print" style={{ color: 'black', margin: '1rem 0', borderBottom: '1px solid #ccc' }}>Detalle de Instrumentos Aplicados</h3>
                                
                                {ALL_SURVEY_IDS.map((testId, i) => {
                                    const test = selectedStudent.tests.find(t => t.testId === testId);
                                    
                                    if (!test) {
                                        return (
                                            <div key={testId} style={{ background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 style={{ color: 'var(--text-muted)' }}>{SURVEY_LABELS[testId]}</h4>
                                                    <span style={{ fontSize: '0.8rem', color: '#fb7185' }}>(PENDIENTE DE REALIZACIÓN)</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={testId} className="test-report-block" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', pageBreakInside: 'avoid' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <h3 style={{ color: 'var(--primary)' }}>{SURVEY_LABELS[testId]}</h3>
                                                <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: test.profile?.includes('Apoyo') || test.profile?.includes('Riesgo') ? '#ef4444' : 'var(--primary)', fontWeight: 'bold' }}>{test.profile}</span>
                                            </div>
                                            <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                                                <div className="chart-wrapper" style={{ height: '250px' }}>
                                                    <Radar 
                                                        data={{
                                                            labels: Object.keys(test.scores || {}),
                                                            datasets: [{
                                                                data: Object.values(test.scores || {}),
                                                                backgroundColor: test.profile?.includes('Riesgo') || test.profile?.includes('Baja') 
                                                                    ? 'rgba(239, 68, 68, 0.3)' 
                                                                    : 'rgba(99, 102, 241, 0.3)',
                                                                borderColor: test.profile?.includes('Riesgo') || test.profile?.includes('Baja')
                                                                    ? 'rgba(239, 68, 68, 1)'
                                                                    : 'rgba(99, 102, 241, 1)',
                                                                borderWidth: 2,
                                                                pointBackgroundColor: 'white'
                                                            }]
                                                        }} 
                                                        options={radarOptions} 
                                                    />
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                                                    <h4 style={{ marginBottom: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={18} /> Orientación Pedagógica</h4>
                                                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.2rem' }}>
                                                        {test.testId === 'chaea' && (
                                                            REPORT_TEMPLATES.chaea[test.profile.toUpperCase()] || 
                                                            "Alumno con perfil versátil. Se recomienda variar las metodologías de enseñanza para cubrir todas las dimensiones."
                                                        )}
                                                        {test.testId === 'autoestima_motivacion' && (
                                                            test.profile?.includes('Riesgo') || test.profile?.includes('Baja') ?
                                                            REPORT_TEMPLATES.autoestima_motivacion.risk : REPORT_TEMPLATES.autoestima_motivacion.healthy
                                                        )}
                                                        {test.testId === 'clima_convivencia' && (
                                                            test.profile?.includes('Vulnerable') ?
                                                            REPORT_TEMPLATES.clima_convivencia.vulnerable : REPORT_TEMPLATES.clima_convivencia.positive
                                                        )}
                                                        {test.testId === 'afectividad_genero' && (
                                                            test.profile?.includes('Requiere') ?
                                                            REPORT_TEMPLATES.afectividad_genero.low : REPORT_TEMPLATES.afectividad_genero.adequate
                                                        )}
                                                        {test.testId === 'participacion' && (
                                                            test.profile?.includes('Baja') ?
                                                            "ALERTA: Baja participación ciudadana. Requiere estrategias de re-enganche comunitario." :
                                                            "Nivel de participación adecuado. Continuar reforzando la formación ciudadana."
                                                        )}
                                                    </p>
                                                    <div className="hallazgo-box" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Hallazgo clave:</span> {test.profile}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={() => window.print()} className="btn btn-primary no-print" style={{ marginTop: '3rem', width: '100%', gap: '1rem' }}><FileText size={18} /> Generar Expediente PDF Profesional</button>
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
