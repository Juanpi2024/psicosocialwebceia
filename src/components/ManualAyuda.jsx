import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, BrainCircuit, Sparkles, ShieldAlert, Users, 
    FileText, Lightbulb, X, Search, ChevronRight, 
    HeartHandshake, Compass, Award, BarChart3, HelpCircle
} from 'lucide-react';

const INSTRUMENTS_INFO = [
    {
        id: 'chaea',
        title: 'CHAEA (Estilos de Aprendizaje)',
        icon: BrainCircuit,
        color: '#6366f1',
        description: 'Basado en el Cuestionario Honey-Alonso. Identifica si el alumno es Activo, Reflexivo, Teórico o Pragmático.',
        utility: 'Permite al docente adaptar su didáctica para que el aprendizaje sea más efectivo según el perfil predominante.',
        target: 'Estudiantes'
    },
    {
        id: 'socioemocional',
        title: 'DIA Socioemocional',
        icon: HeartHandshake,
        color: '#ec4899',
        description: 'Evaluación de bienestar emocional y recursos personales. Detecta niveles de ansiedad, calma y red de apoyo.',
        utility: 'Vital para identificar estudiantes en riesgo socioemocional y activar protocolos de acompañamiento urgente.',
        target: 'Estudiantes'
    },
    {
        id: 'motivacion',
        title: 'Motivación Educativa',
        icon: Compass,
        color: '#f59e0b',
        description: 'Mide qué impulsa al estudiante adulto a volver a las aulas: metas intrínsecas, extrínsecas o amotivación.',
        utility: 'Ayuda a prevenir la deserción escolar al entender los pilares que mantienen al alumno en el sistema.',
        target: 'Estudiantes'
    },
    {
        id: 'autoeficacia',
        title: 'Autoeficacia Académica',
        icon: Award,
        color: '#10b981',
        description: 'Evalúa la confianza del estudiante en sus propias capacidades para enfrentar desafíos educativos.',
        utility: 'Fundamental en educación de adultos para trabajar la autoestima académica dañada por fracasos previos.',
        target: 'Estudiantes'
    },
    {
        id: 'clima',
        title: 'Clima y Seguridad',
        icon: ShieldAlert,
        color: '#ef4444',
        description: 'Percepción de seguridad en el entorno escolar, especialmente enfocado en la jornada nocturna y convivencia.',
        utility: 'Identifica zonas de peligro o conflictos de convivencia que afectan el rendimiento grupal.',
        target: 'Estudiantes'
    },
    {
        id: 'dcsej',
        title: 'DCSE-J (Convivencia)',
        icon: Users,
        color: '#8b5cf6',
        description: 'Test situacional mediante historias interactivas para evaluar juicio moral y resolución de conflictos.',
        utility: 'Permite observar cómo reacciona el alumno ante situaciones de injusticia o dilemas éticos.',
        target: 'Estudiantes'
    },
    {
        id: 'res-f',
        title: 'RES-F (Resiliencia Familiar)',
        icon: BarChart3,
        color: '#3b82f6',
        description: 'Evaluación para familias/apoderados sobre los factores protectores presentes en el hogar.',
        utility: 'Completa el panorama psicosocial integrando la visión del entorno cercano del estudiante.',
        target: 'Familias'
    }
];

export default function ManualAyuda({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('instruments');

    const tabs = [
        { id: 'instruments', label: 'Instrumentos', icon: BookOpen },
        { id: 'ai', label: 'Inteligencia Artificial', icon: Sparkles },
        { id: 'dashboards', label: 'Uso del Panel', icon: BarChart3 },
        { id: 'faq', label: 'Preguntas Frecuentes', icon: HelpCircle },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div 
                style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    zIndex: 10000, background: 'rgba(3, 7, 18, 0.95)', 
                    backdropFilter: 'blur(20px)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', padding: '20px' 
                }}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{ 
                        maxWidth: '1000px', width: '100%', maxHeight: '90vh', 
                        background: 'rgba(17, 24, 39, 0.8)', borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BookOpen className="text-gradient" size={30} /> 
                                Manual Maestro de Usuario
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.5rem 0 0' }}>Expediente Psicosocial CEIA v2.0</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            style={{ 
                                background: 'rgba(255,255,255,0.05)', border: 'none', 
                                color: 'white', cursor: 'pointer', padding: '0.75rem', 
                                borderRadius: '50%', transition: 'all 0.3s ease' 
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 2rem', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {tabs.map(tab => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '1rem 1.5rem', border: 'none', background: 'none',
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        position: 'relative', fontWeight: isActive ? 'bold' : 'normal',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <TabIcon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                                    {tab.label}
                                    {isActive && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)', borderRadius: '3px' }} />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'instruments' && (
                                <motion.div 
                                    key="instr" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
                                >
                                    {INSTRUMENTS_INFO.map(inst => {
                                        const InstIcon = inst.icon;
                                        return (
                                            <div key={inst.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${inst.color}15` }}>
                                                        <InstIcon size={24} color={inst.color} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{inst.title}</h4>
                                                        <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{inst.target}</span>
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>{inst.description}</p>
                                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', fontSize: '0.85rem' }}>
                                                    <span style={{ color: inst.color, fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Utilidad Pedagógica:</span>
                                                    {inst.utility}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {activeTab === 'ai' && (
                                <motion.div 
                                    key="ai" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                    style={{ textAlign: 'center', padding: '1rem' }}
                                >
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
                                            <Sparkles size={40} color="white" />
                                        </div>
                                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Soporte Crítico con <span className="text-gradient">Inteligencia Artificial</span></h3>
                                        <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.7, lineHeight: 1.6 }}>
                                            Nuestra IA (GPT-4o) analiza miles de datos psicosociales en segundos para entregarte estrategias de intervención personalizadas.
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
                                        <div style={{ padding: '2rem', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                                            <h4 style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Users size={20} /> Análisis de Curso</h4>
                                            <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Escanea a todo el grupo para identificar patrones comunes, climas de aula tensos o estilos de aprendizaje dominantes en el salón.</p>
                                        </div>
                                        <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                            <h4 style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><ShieldAlert size={20} /> Análisis de Caso</h4>
                                            <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Genera una "Ficha Estratégica" para un alumno específico, sugiriendo pasos concretos para el docente y el equipo psicopedagógico.</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#ef444410', borderRadius: '16px', border: '1px solid #ef444420', fontSize: '0.9rem', color: '#ef4444' }}>
                                        <b>Nota Ética:</b> La IA es un asistente. La decisión final de intervención debe ser tomada siempre por un profesional humano calificado.
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'dashboards' && (
                                <motion.div key="dash" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Estructura de la Plataforma</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Estudiante</h4>
                                            <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', opacity: 0.7, lineHeight: 1.8 }}>
                                                <li>Registro emocional diario.</li>
                                                <li>Realización de 6 encuestas.</li>
                                                <li>Seguimiento de progreso personal.</li>
                                            </ul>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Profesor</h4>
                                            <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', opacity: 0.7, lineHeight: 1.8 }}>
                                                <li>Vista de promedios por curso.</li>
                                                <li>Central de Alertas Críticas.</li>
                                                <li>Exportación de Expedientes PDF.</li>
                                                <li>Consultoría con Experto IA.</li>
                                            </ul>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Familias</h4>
                                            <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', opacity: 0.7, lineHeight: 1.8 }}>
                                                <li>Casos de resiliencia familiar.</li>
                                                <li>Historias interactivas (RES-F).</li>
                                                <li>Comunicación colegio-hogar.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><FileText size={20} /> ¿Cómo exportar resultados?</h4>
                                        <div style={{ display: 'flex', gap: '2rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>1. Selecciona un alumno de la lista.</p>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>2. Haz clic en "Ver Ficha".</p>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>3. Selecciona "Generar Informe PDF".</p>
                                            </div>
                                            <div style={{ width: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}><b>Sugerencia:</b> Usa los informes impresos para carpetas de casos especiales o derivaciones a especialistas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'faq' && (
                                <motion.div key="faq" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {[
                                            { q: "¿Los datos son confidenciales?", a: "Absolutamente. Toda la información está protegida por encriptación y los resultados solo pueden ser vistos por el equipo docente autorizado." },
                                            { q: "¿Qué significa el gráfico de Radar?", a: "Mientras más cerca del borde esté el punto, más alto es el resultado en esa dimensión. Un radar equilibrado es ideal, picos muy pronunciados indican especializaciones o riesgos." },
                                            { q: "¿Cómo ingreso la clave de IA?", a: "En el panel docente, usa el icono de la chispa (✨) para ingresar tu API Key de OpenAI. Sin ella, los botones de IA no estarán activos." },
                                            { q: "¿Se puede repetir un test?", a: "Sí. Los estudiantes pueden repetir los tests para ver cómo evolucionan durante el año escolar (monitoreo longitudinal)." }
                                        ].map((item, i) => (
                                            <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{item.q}</h4>
                                                <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
                        <button 
                            onClick={onClose} 
                            className="btn btn-primary" 
                            style={{ padding: '1rem 3rem', borderRadius: '16px', fontWeight: 'bold' }}
                        >
                            ¡Entendido! Volver al Sistema
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
