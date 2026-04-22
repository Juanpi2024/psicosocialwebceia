import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, BrainCircuit, Sparkles, ShieldAlert, Users, 
    FileText, Lightbulb, ArrowLeft, Search, ChevronRight, 
    HeartHandshake, Compass, Award, BarChart3, HelpCircle,
    Printer, Download, ExternalLink, MessageSquare, Heart, Shield, Globe
} from 'lucide-react';
import './LandingPage.css';

const INSTRUMENTS_INFO = [
    {
        id: 'participacion',
        title: 'Participación Ciudadana',
        icon: Globe,
        color: '#3b82f6',
        description: 'Evalúa el interés e involucramiento del estudiante en la comunidad educativa y su formación como ciudadano activo.',
        utility: 'Mide indicadores clave del convenio de desempeño directivo relacionados con la formación ciudadana y participación escolar.',
        target: 'Estudiantes'
    },
    {
        id: 'clima_convivencia',
        title: 'Clima y Convivencia Escolar',
        icon: Shield,
        color: '#ef4444',
        description: 'Percepción de seguridad, respeto y convivencia en el entorno escolar CEIA, incluyendo aspectos de la jornada vespertina/nocturna.',
        utility: 'Identifica factores de riesgo institucional y permite al equipo de convivencia actuar preventivamente.',
        target: 'Estudiantes'
    },
    {
        id: 'autoestima_motivacion',
        title: 'Autoestima y Motivación Escolar',
        icon: BrainCircuit,
        color: '#ec4899',
        description: 'Fusión de autoconcepto, autorregulación emocional y motivación (intrínseca, extrínseca y riesgo de desmotivación).',
        utility: 'Detecta estudiantes con baja autoestima o en riesgo de deserción, permitiendo intervención temprana con metas a corto plazo.',
        target: 'Estudiantes'
    },
    {
        id: 'afectividad_genero',
        title: 'Afectividad, Sexualidad y Género',
        icon: Heart,
        color: '#a855f7',
        description: 'Evalúa autoconocimiento afectivo, relaciones saludables, perspectiva de género, autocuidado en salud sexual y derechos.',
        utility: 'Permite planificar talleres de educación integral en sexualidad alineados con las orientaciones del Mineduc (2017).',
        target: 'Estudiantes'
    },
    {
        id: 'chaea',
        title: 'Estilos de Aprendizaje (CHAEA)',
        icon: Sparkles,
        color: '#6366f1',
        description: 'Cuestionario Honey-Alonso. Identifica si el alumno es Activo, Reflexivo, Teórico o Pragmático.',
        utility: 'Permite al docente adaptar su didáctica para que el aprendizaje sea más efectivo según el perfil predominante.',
        target: 'Estudiantes'
    }
];

export default function Help() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('instruments');

    const tabs = [
        { id: 'instruments', label: 'Guía de Instrumentos', icon: BookOpen },
        { id: 'ai', label: 'Manual de Inteligencia Artificial', icon: Sparkles },
        { id: 'admin', label: 'Gestión Docente', icon: Users },
        { id: 'interpretation', label: 'Interpretación de Datos', icon: BarChart3 }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body, #030712)', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
            {/* Navegación Superior */}
            <nav style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Centro de Ayuda <span className="text-gradient">Premium</span></h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Printer size={18} /> Imprimir Guía
                    </button>
                    <button onClick={() => navigate('/')} className="btn btn-primary">Volver al Inicio</button>
                </div>
            </nav>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>
                    
                    {/* Barra Lateral de Selección */}
                    <aside>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.6 }}>CONTENIDO</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button 
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '1rem', 
                                                    padding: '1rem 1.5rem', border: 'none', 
                                                    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                    color: isActive ? 'var(--primary, #6366f1)' : 'rgba(255,255,255,0.5)',
                                                    borderRadius: '16px', cursor: 'pointer', textAlign: 'left',
                                                    fontWeight: isActive ? 'bold' : 'normal', transition: 'all 0.3s'
                                                }}
                                            >
                                                <Icon size={20} />
                                                {tab.label}
                                                {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><MessageSquare size={18} color="var(--primary)" /> ¿Necesitas ayuda extra?</h4>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5 }}>Si el sistema presenta errores, contacta a soporte técnico CEIA o al orientador de turno.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Contenido Principal Acordeón */}
                    <section>
                        <AnimatePresence mode="wait">
                            {activeTab === 'instruments' && (
                                <motion.div key="instr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Guía de Instrumentos Psicosociales</h1>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '3rem' }}>Descripción detallada de todas las mediciones aplicadas en el sistema.</p>
                                    
                                    <div style={{ display: 'grid', gap: '2rem' }}>
                                        {INSTRUMENTS_INFO.map(inst => {
                                            const Icon = inst.icon;
                                            return (
                                                <div key={inst.id} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '150px', height: '150px', background: `${inst.color}10`, borderRadius: '50%', filter: 'blur(40px)' }} />
                                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                                        <div style={{ background: `${inst.color}15`, padding: '1.5rem', borderRadius: '24px', height: 'fit-content' }}>
                                                            <Icon size={40} color={inst.color} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                                <h3 style={{ fontSize: '1.7rem', margin: 0 }}>{inst.title}</h3>
                                                                <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: inst.color }}>{inst.target}</span>
                                                            </div>
                                                            <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '1.5rem' }}>{inst.description}</p>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                                                <div style={{ borderLeft: `3px solid ${inst.color}`, paddingLeft: '1.5rem' }}>
                                                                    <h5 style={{ color: inst.color, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>¿Por qué lo aplicamos?</h5>
                                                                    <p style={{ fontSize: '0.95rem', opacity: 0.7, margin: 0 }}>{inst.utility}</p>
                                                                </div>
                                                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <Lightbulb size={24} color="#fcd34d" />
                                                                    <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Recomendado para monitoreo longitudinal semestral.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'ai' && (
                                <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Manual de Inteligencia Artificial</h1>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '3rem' }}>Cómo potenciar tu análisis docente con la integración de GPT-4o.</p>
                                    
                                    <div className="glass-panel" style={{ padding: '3rem', borderRadius: '32px', marginBottom: '3rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                                            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}>
                                                <Sparkles size={40} color="white" />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '1.8rem' }}>Uso Ético y Estratégico</h2>
                                                <p style={{ opacity: 0.7 }}>La IA analiza variables complejas para identificar riesgos que el ojo humano podría pasar por alto.</p>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px' }}>
                                                <h4 style={{ color: '#a855f7', marginBottom: '1rem' }}>1. Configuración de API</h4>
                                                <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Para activar las funciones de IA, el docente debe ingresar su API KEY personal desde el panel de configuración (icono ✨). Esta clave es privada y temporal para la sesión.</p>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px' }}>
                                                <h4 style={{ color: '#6366f1', marginBottom: '1rem' }}>2. Consultas de Caso</h4>
                                                <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Al entrar en la ficha de un alumno, puedes solicitar un "Informe de Caso". La IA cruzará todos los tests del alumno para darte una recomendación pedagógica personalizada.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '6px solid #ef4444' }}>
                                        <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ Descargo de Responsabilidad</h4>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Las recomendaciones de la IA son sugerencias basadas en modelos de lenguaje. No deben reemplazar el juicio clínico de un profesional psicosocial o de orientación.</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'admin' && (
                                <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Gestión del Panel Docente</h1>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '3rem' }}>Herramientas administrativas para el monitoreo institucional.</p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}><Users color="var(--primary)" /> Central de Alertas</h3>
                                            <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.7 }}>
                                                El sistema detecta automáticamente perfiles con la etiqueta <b>"Requiere Apoyo"</b> o <b>"Riesgo Crítico"</b>. 
                                                Estas aparecen resaltadas en rojo en la barra lateral del dashboard.
                                            </p>
                                        </section>
                                        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}><FileText color="var(--secondary)" /> Expedientes PDF</h3>
                                            <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.7 }}>
                                                Cada estudiante tiene un "Expediente Digital". Puede ser impreso directamente para integrarse en carpetas físicas de seguimiento oficial CEIA-Mineduc.
                                            </p>
                                        </section>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'interpretation' && (
                                <motion.div key="inter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Interpretación de Resultados</h1>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '3rem' }}>Guía visual para entender gráficos de radar y métricas psicosociales.</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                                        <div>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', marginBottom: '2rem' }}>
                                                <h4 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Lectura de Gráficos Radar</h4>
                                                <p style={{ lineHeight: 1.8, opacity: 0.7 }}>
                                                    Los gráficos de radar muestran el <b>equilibrio</b> entre dimensiones.
                                                    <br /><br />
                                                    - <b>Puntos en la periferia:</b> Fortaleza o predominancia alta.
                                                    <br />
                                                    - <b>Puntos cerca del centro:</b> Debilidad o área de intervención necesaria.
                                                    <br />
                                                    - <b>Área total:</b> Indica el nivel general de desarrollo de la competencia evaluada.
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ background: '#10b98110', padding: '1.5rem', borderRadius: '24px', border: '1px solid #10b98130' }}>
                                                <h5 style={{ color: '#10b981', margin: '0 0 0.5rem' }}>Zonas Verdes</h5>
                                                <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Resultados satisfactorios. Mantener monitoreo preventivo anual.</p>
                                            </div>
                                            <div style={{ background: '#f59e0b10', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f59e0b30' }}>
                                                <h5 style={{ color: '#f59e0b', margin: '0 0 0.5rem' }}>Zonas Amarillas</h5>
                                                <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Indicadores de riesgo latente. Recomendamos entrevista de tutoría.</p>
                                            </div>
                                            <div style={{ background: '#ef444410', padding: '1.5rem', borderRadius: '24px', border: '1px solid #ef444430' }}>
                                                <h5 style={{ color: '#ef4444', margin: '0 0 0.5rem' }}>Zonas Rojas</h5>
                                                <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Alerta crítica. Requiere derivación inmediata a equipo psicosocial.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </main>

            {/* Footer Global */}
            <footer style={{ marginTop: '5rem', padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <p style={{ opacity: 0.4 }}>Herramienta de Diagnóstico Psicosocial CEIA | Diseñado para la Excelencia Educativa</p>
            </footer>
        </div>
    );
}
