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
    const [selectedStudent, setSelectedStudent] = useState(null); // Para el Modal Clínico

    useEffect(() => {
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

    // Agrupar resultados por estudiante para el listado y el modal consolidado
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
        datasets: [
            {
                label: `Promedio CHAEA (${selectedCourse})`,
                data: [avgChaea.ACTIVO, avgChaea.REFLEXIVO, avgChaea.TEORICO, avgChaea.PRAGMATICO],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            },
        ],
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
        datasets: [
            {
                label: `Promedio Socioemocional (${selectedCourse})`,
                data: [avgSocio.GestionEmocional, avgSocio.PercepcionAprendizaje, avgSocio.InteraccionSocial],
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(234, 179, 8, 1)',
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: { size: 12, family: 'Outfit' }
                },
                ticks: { display: false, min: 0 }
            }
        },
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    // Alertas Tempranas Simuladas basadas en datos reales
    const requiresSupport = socioResults.filter(r => r.profile === 'Requiere Apoyo');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-profesor"
        >
            <header className="prof-header">
                <div className="title-section">
                    <h1>Panel <span className="text-gradient">Analítico</span> Docente</h1>
                    <p>Monitoreo de Estilos de Aprendizaje y Adaptación Socioemocional</p>
                </div>

                <div className="kpi-row">
                    <div className="glass-panel kpi-card">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}
                        >
                            {courses.map(c => <option key={c} value={c} style={{ background: '#111827' }}>{c}</option>)}
                        </select>
                        <span className="kpi-label">Filtro de Curso</span>
                    </div>
                    <div className="glass-panel kpi-card alert">
                        <span className="kpi-value text-gradient">{requiresSupport.length}</span>
                        <span className="kpi-label">Alumnos Requieren Apoyo</span>
                    </div>
                    <div className="glass-panel kpi-card">
                        <span className="kpi-value text-gradient">{motivacionResults.length}</span>
                        <span className="kpi-label">Motivación</span>
                    </div>
                    <div className="glass-panel kpi-card">
                        <span className="kpi-value">{filteredResults.length}</span>
                        <span className="kpi-label">Total Gral.</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid">

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Gráfico CHAEA */}
                    <section className="glass-panel module-card">
                        <div className="panel-header">
                            <h3><BookOpen size={20} color="var(--primary)" /> Perfil de Aprendizaje (CHAEA)</h3>
                        </div>
                        <p className="card-desc">Tendencias de estilos de aprendizaje del curso seleccionado.</p>
                        <div className="chart-container" style={{ height: '250px' }}>
                            {chaeaResults.length > 0 ? <Radar data={chaeaChartData} options={radarOptions} /> : <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Sin datos suficientes</p>}
                        </div>
                    </section>

                    {/* Gráfico Socioemocional */}
                    <section className="glass-panel module-card">
                        <div className="panel-header">
                            <h3><BrainCircuit size={20} color="var(--accent)" /> Adaptación Socioemocional (DIA)</h3>
                        </div>
                        <p className="card-desc">Resultados grupales de gestión y percepción del entorno escolar.</p>
                        <div className="chart-container" style={{ height: '250px' }}>
                            {socioResults.length > 0 ? <Radar data={socioChartData} options={radarOptions} /> : <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Sin datos suficientes</p>}
                        </div>
                    </section>
                </div>

                {/* Panel derecho: Estudiantes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section className="glass-panel module-card" style={{ flexGrow: 1 }}>
                        <div className="panel-header" style={{ marginBottom: '1rem' }}>
                            <h3><Users size={20} color="var(--primary)" /> Registro de Estudiantes</h3>
                        </div>

                        <div className="students-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {studentsList.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No hay evaluaciones registradas para este curso.</p>}

                            {studentsList.map(s => (
                                <div
                                    key={s.studentId}
                                    className="student-row"
                                    style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
                                    onClick={() => setSelectedStudent(s)}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                >
                                    <div className="student-info" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {(s.studentName || 'E').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="student-name" style={{ fontWeight: '600' }}>{s.studentName || 'Estudiante'}</div>
                                            <div className="student-role" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {s.curso || 'Sin curso'} | RUT: {s.studentId}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="student-action" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {s.tests.map((t, idx) => (
                                                <div key={idx} className="test-badge" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                                                    {t.testId.toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--primary)' }}>
                                            {s.tests.length} {s.tests.length === 1 ? 'Evaluación' : 'Evaluaciones'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* EXPEDIENTE CLÍNICO MODAL */}
            <AnimatePresence>
                {selectedStudent && (
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <button
                                onClick={() => setSelectedStudent(null)}
                                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-main)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <X size={20} />
                            </button>

                            {/* Cabecera del Expediente */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                    {(selectedStudent.studentName || 'E').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{selectedStudent.studentName}</h2>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                                        <span>Cur: {selectedStudent.curso}</span> |
                                        <span>RUT: {selectedStudent.studentId}</span> |
                                        <span>Consolidado: {selectedStudent.tests.length} evaluaciones</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido Dinámico Consolidado */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {selectedStudent.tests.map((test, index) => (
                                    <div key={index} style={{ borderBottom: index !== selectedStudent.tests.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '3rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                            Fecha: {test.completedAt?.toDate ? test.completedAt.toDate().toLocaleDateString() : 'Desconocida'}
                                        </div>
                                        
                                        {test.testId === 'socioemocional' ? (
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                                    <div>
                                                        <h3 style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>Cuestionario de Adaptación Socioemocional (DIA)</h3>
                                                        <p style={{ color: 'var(--text-muted)' }}>Resultado Final: Diagnóstico Dimensional</p>
                                                    </div>
                                                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', background: test.profile === 'Adecuado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: test.profile === 'Adecuado' ? '#10b981' : '#ef4444' }}>
                                                        Estado Central: {test.profile}
                                                    </div>
                                                </div>

                                                {/* Barras de Desglose Analítico */}
                                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                                                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart3 size={18} /> Desglose Analítico</h4>
                                                    {[
                                                        { label: 'Gestión Emocional', score: test.scores?.GestionEmocional, max: 40 },
                                                        { label: 'Percepción del Aprendizaje', score: test.scores?.PercepcionAprendizaje, max: 28 },
                                                        { label: 'Interacción Social', score: test.scores?.InteraccionSocial, max: 24 }
                                                    ].map((dim, i) => {
                                                        const perc = Math.round((dim.score / dim.max) * 100);
                                                        const isAlert = perc <= 60;
                                                        return (
                                                            <div key={i} style={{ marginBottom: '1rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                                                                    <span style={{ color: isAlert ? '#ef4444' : 'var(--text-main)' }}>{dim.label}</span>
                                                                    <span>{dim.score} / {dim.max} pts</span>
                                                                </div>
                                                                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                                                    <div style={{ width: `${perc}%`, height: '100%', background: isAlert ? '#ef4444' : 'var(--primary)', borderRadius: '5px' }}></div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* Focos de Atención Inmediata (Respuestas Críticas) */}
                                                <div style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                                                    <h4 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={18} /> Focos de Atención Inmediata</h4>
                                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                        {test.answers?.filter(ans => {
                                                            const questionData = socioemocionalQuestions.find(q => q.id === ans.id);
                                                            // Si la pregunta es normal (positiva): alertar si responde 1 (Nunca) o 2 (Algunas veces)
                                                            // Si la pregunta es invertida (negativa): alertar si responde 3 (Casi siempre) o 4 (Siempre)
                                                            if (questionData?.inverted) {
                                                                return ans.value >= 3;
                                                            } else {
                                                                return ans.value <= 2;
                                                            }
                                                        }).slice(0, 5).map((ans, i) => {
                                                            const qText = socioemocionalQuestions.find(q => q.id === ans.id)?.text;
                                                            const valText = ans.value === 4 ? "Siempre" : ans.value === 3 ? "Casi Siempre" : ans.value === 2 ? "Algunas veces" : "Nunca";
                                                            return (
                                                                <li key={i} style={{ fontSize: '0.95rem', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                                                                    <span style={{ color: 'var(--text-muted)' }}>Afirmación:</span> "{qText}" <br />
                                                                    <span style={{ color: 'var(--text-muted)' }}>Respuesta del alumno:</span> <strong style={{ color: '#fca5a5' }}>{valText}</strong>
                                                                </li>
                                                            )
                                                        })}
                                                        {(!test.answers || test.answers.filter(ans => {
                                                            const questionData = socioemocionalQuestions.find(q => q.id === ans.id);
                                                            return questionData?.inverted ? ans.value >= 3 : ans.value <= 2;
                                                        }).length === 0) && (
                                                            <li style={{ color: 'var(--text-muted)' }}>No se detectan respuestas críticas urgentes.</li>
                                                        )}
                                                    </ul>
                                                </div>

                                                {/* Orientaciones */}
                                                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                                                    <h4 style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Lightbulb size={18} /> Sugerencia de Abordaje Docente</h4>
                                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                                                        {test.profile === 'Requiere Apoyo' ?
                                                            "Se sugiere derivación inmediata al Equipo Psicosocial para entrevista exploratoria. Informar al profesor jefe para refuerzo positivo en aula y pausas activas. Monitorizar posibles factores estresores externos que estén mermando su interacción social." :
                                                            "Estudiante muestra indicadores estables emocionales. Su abordaje en aula debe basarse en afianzar su liderazgo constructivo, encomendándole tareas de apoyo hacia pares que requieran contención. Fomentar su percepción de autonomía."}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : test.testId === 'chaea' ? (
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                                    <div>
                                                        <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>Perfil de Aprendizaje CHAEA</h3>
                                                        <p style={{ color: 'var(--text-muted)' }}>Cuestionario Honey-Alonso de Estilos de Aprendizaje</p>
                                                    </div>
                                                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', textTransform: 'uppercase' }}>
                                                        Estilo Dominante: {test.profile}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                                    {['ACTIVO', 'REFLEXIVO', 'TEORICO', 'PRAGMATICO'].map((style) => (
                                                        <div key={style} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: '500' }}>{style}</span>
                                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: test.profile === style ? '#818cf8' : 'var(--text-main)' }}>
                                                                {test.scores?.[style] || 0} pts
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                                                    <h4 style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Lightbulb size={18} /> Orientación Metodológica</h4>
                                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                                                        {test.profile === 'ACTIVO' && "Su mente busca estimulación constante. Aprende mejor trabajando en equipo, liderando debates, dramatizando, compitiendo. Evita las clases teóricas expositivas y trabajos en solitario prolongados."}
                                                        {test.profile === 'REFLEXIVO' && "Presta mucha atención a los detalles antes de actuar. Aprende mejor siendo observador, teniendo tiempo para investigar un tema a fondo antes de aportar. Evita forzarle a liderar espontáneamente sin filtro previo."}
                                                        {test.profile === 'TEORICO' && "Busca la racionalidad, las teorías y principios. Estructuran la información paso a paso. Aprenden mejor con modelos teóricos estructurados que integren los hechos. Se frustran en ambientes confusos e imprevisibles."}
                                                        {test.profile === 'PRAGMATICO' && "Son buscadores rápidos de nuevas ideas para aplicarlas en la práctica. Aprenden mejor cuando ven la relación evidente entre la materia y un problema real de su vida. Odian las teorías sin funcionalidad utilitaria."}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : test.testId === 'motivacion' ? (
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                                    <div>
                                                        <h3 style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}>Escala de Motivación (EME-S)</h3>
                                                        <p style={{ color: 'var(--text-muted)' }}>Desglose por dimensiones motivacionales</p>
                                                    </div>
                                                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', background: 'rgba(52, 211, 153, 0.2)', color: '#10b981' }}>
                                                        Completado
                                                    </div>
                                                </div>
                                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                                                    {Object.entries(test.scores || {}).map(([dim, score], i) => (
                                                        <div key={i} style={{ marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                                                                <span>{dim}</span>
                                                                <span>{score} pts</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                                                <div style={{ width: `${(score / 28) * 100}%`, height: '100%', background: 'var(--secondary)', borderRadius: '4px' }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                                                    <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Lightbulb size={18} /> Recomendación Pedagógica</h4>
                                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Analizar los niveles de Amotivación frente a la Regulación Identificada para ajustar la relevancia de los contenidos curriculares a sus fines personales.</p>
                                                </div>
                                            </div>
                                        ) : test.testId === 'autoeficacia' || test.testId === 'clima' ? (
                                            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--gradient-primary)', color: 'white' }}>
                                                            {test.testId === 'autoeficacia' ? <BrainCircuit size={24} /> : <ShieldAlert size={24} />}
                                                        </div>
                                                        <div>
                                                            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{test.testId === 'autoeficacia' ? 'Autoeficacia Académica' : 'Clima y Seguridad'}</h3>
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Instrumento EAPESA / EPCSE</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', background: 'white', color: 'var(--bg-body)', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }}>
                                                        {test.testId === 'autoeficacia' ? (
                                                            test.scores?.total >= 40 ? 'Perfil Alto' : test.scores?.total >= 26 ? 'Perfil Medio' : 'Perfil Bajo'
                                                        ) : (
                                                            test.scores?.total >= 31 ? 'Percepción Positiva' : test.scores?.total >= 21 ? 'Percepción Regular' : 'Percepción Crítica'
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                                                    <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'block' }}>PUNTOS</span>
                                                        <span style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', textShadow: '0 0 20px var(--primary-glow)' }}>{test.scores?.total}</span>
                                                    </div>
                                                    <div>
                                                        <div style={{ marginBottom: '1.5rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progreso de la escala</span>
                                                                <span style={{ fontWeight: 'bold' }}>{Math.round((test.scores?.total / (test.testId === 'autoeficacia' ? 50 : 40)) * 100)}%</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', padding: '2px' }}>
                                                                <div style={{ width: `${(test.scores?.total / (test.testId === 'autoeficacia' ? 50 : 40)) * 100}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', borderRadius: '4px' }}></div>
                                                            </div>
                                                        </div>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                            {test.testId === 'autoeficacia' ? 'Mide la creencia en las propias capacidades para organizar y ejecutar las acciones requeridas que producirán determinados logros.' : 'Mide la percepción de seguridad física y respeto interpersonal en el contexto de la jornada escolar nocturna.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                                                    <h4 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Lightbulb size={18} /> Recomendación Pedagógica</h4>
                                                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', fontStyle: 'italic' }}>
                                                        {test.testId === 'autoeficacia' ? (
                                                            test.scores?.total >= 40 ? 
                                                            "Potenciar con desafíos de alta complejidad. El alumno posee una 'mentalidad de crecimiento' sólida." :
                                                            test.scores?.total >= 26 ?
                                                            "Acompañar con feedback específico. Necesita confirmar sus logros paso a paso." :
                                                            "Alerta: Riesgo de abandono por baja confianza. Requiere metas muy cortas y éxito inmediato garantizado."
                                                        ) : (
                                                            test.scores?.total >= 31 ? 
                                                            "Excelente vínculo con el entorno. Fomentar su rol como tutor o mediador natural." :
                                                            test.scores?.total >= 21 ?
                                                            "Situación estable, pero requiere monitoreo de los horarios de salida/entrada." :
                                                            "Urgente: El alumno no se siente seguro. Identificar focos de conflicto o riesgos en accesos."
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : test.testId === 'dcsej' ? (
                                            <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'linear-gradient(to bottom right, #a855f7, #ec4899)', color: 'white' }}>
                                                            <Users size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Desafío Grupal (DCSE-J)</h3>
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Test Situacional de Habilidades Sociales</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', background: test.profile === 'Habilidades Sociales Altas' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: test.profile === 'Habilidades Sociales Altas' ? '#34d399' : '#fb7185', border: '1px solid currentColor' }}>
                                                        {test.profile}
                                                    </div>
                                                </div>
                                                
                                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                                                        <h4 style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>Análisis de la Dinámica</h4>
                                                        <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)' }}>
                                                            {test.profile === 'Habilidades Sociales Altas' ? 
                                                                "El estudiante posee un perfil mediador. Elige respuestas que maximizan el bienestar del grupo sin sacrificar sus propios objetivos, demostrando alta asertividad." :
                                                                "Se detectan dificultades en la negociación. Tiende a respuestas reactivas o a la sumisión grupal, lo que indica necesidad de trabajar la autoconfianza social."}
                                                        </p>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', padding: '1rem' }}>
                                                        <span style={{ fontSize: '3rem', fontWeight: '900', color: '#a855f7' }}>{test.scores?.total}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puntos / 18</span>
                                                    </div>
                                                </div>

                                                <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ color: '#38bdf8' }}><Sparkles size={24} /></div>
                                                    <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: '500' }}>
                                                        {test.profile === 'Habilidades Sociales Altas' ? 
                                                            "Estrategia: Incluir en equipos de trabajo como líder de mediación por su capacidad comunicativa." :
                                                            "Intervención: Se recomienda Taller de Asertividad y Role-playing para situaciones de conflicto."}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', gap: '1rem' }}>
                                <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>Cerrar Expediente</button>
                                <button className="btn btn-primary" onClick={() => window.print()}><FileText size={18} /> Descargar PDF</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
