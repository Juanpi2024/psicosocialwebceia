import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, HeartHandshake, ShieldCheck, MessageCircle, AlertTriangle, PlayCircle, CheckCircle } from 'lucide-react';
import './PortalFamilias.css';

const familyStories = [
    {
        id: 'f1',
        title: 'La Noticia del Despido',
        theme: 'Desempleo y Estrés Familiar',
        desc: 'Un padre/madre llega a casa tras perder su trabajo inesperadamente.',
        text: '"Hoy llegaron a mi trabajo y nos avisaron que la empresa cierra el mes que viene. No sé de dónde sacaremos para pagar las cuentas del próximo mes o el colegio de los niños." - Esta situación genera mucha tensión en casa. Como adulto responsable que escucha esta noticia, ¿cómo reaccionarías habitualmente con tu hijo/a adolescente si te pregunta ansioso qué va a pasar?',
        options: [
            { id: 'comunicacion', label: 'Comunicación Abierta', text: 'Me siento con él/ella, le explico la situación sin ocultarle la verdad pero dándole tranquilidad de que entre todos buscaremos soluciones paso a paso.', color: '#10B981' },
            { id: 'proteccion', label: 'Sobreprotección / Evasión', text: 'Le digo que no se preocupe por cosas de grandes, que siga estudiando y me encierro a pensar en cómo solucionarlo.', color: '#F59E0B' },
            { id: 'estres', label: 'Estrés Transmitido', text: 'Me frustro, le digo que estamos en un problema grave y que ahora todos tendrán que hacer sacrificios pesados y dejar de pedir cosas.', color: '#F43F5E' }
        ]
    },
    {
        id: 'f2',
        title: 'Conflictos en el Colegio',
        theme: 'Bullying y Autoestima',
        desc: 'Tu hijo/a adolescente no quiere ir a clases porque sus amigos lo están molestando por redes sociales.',
        text: 'Tu hijo/a lleva varios días de mal humor, encerrado en su cuarto. Un día te confiesa llorando que subieron una foto de él/ella al grupo de WhatsApp del curso burlándose, y que ya no tiene amigos. ¿Cuál suele ser tu enfoque en estos casos?',
        options: [
            { id: 'poder', label: 'Fomento del Poder Personal', text: 'Valido lo que siente, lo escucho sin juzgar y le pregunto qué cree él/ella que sería lo mejor: ¿hablar con el profesor, ignorarlo o enfrentarlos? Lo acompaño en su decisión.', color: '#10B981' },
            { id: 'solucionador', label: 'Resolución Autoritaria', text: 'Voy de inmediato al colegio, pido hablar con el director y los padres de esos niños para exigir que los expulsen o castiguen. Yo me encargo del problema.', color: '#3B82F6' },
            { id: 'minimizacion', label: 'Minimización', text: 'Le digo que a todos los molestaron alguna vez en el colegio, que ignore esos mensajes y que tiene que hacerse más fuerte para que no lo/la pasen a llevar.', color: '#F59E0B' }
        ]
    }
];

export default function PortalFamilias() {
    const [activeStory, setActiveStory] = useState(null);
    const [completedStories, setCompletedStories] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const startStory = (story) => {
        setActiveStory(story);
        setSelectedOption(null);
    };

    const handleOptionSelect = (optId) => {
        setSelectedOption(optId);
    };

    const finishStory = () => {
        if (!completedStories.includes(activeStory.id)) {
            setCompletedStories([...completedStories, activeStory.id]);
        }
        setActiveStory(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="portal-familias"
        >
            {/* HEADER */}
            <header className="dash-header">
                <div>
                    <h1 className="greeting"><span className="text-gradient">Portal de Apoyo</span> Familiar</h1>
                    <p className="subtitle">Módulo RES-F: Identificando recursos protectores en el hogar.</p>
                </div>

                <div className="stats-glass">
                    <div className="stat">
                        <span className="stat-val text-gradient">{completedStories.length} de {familyStories.length}</span>
                        <span className="stat-label">Casos Completados</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val" style={{ color: 'var(--secondary)' }}>Activo</span>
                        <span className="stat-label">Estado de Red</span>
                    </div>
                </div>
            </header>

            {/* VISTA PRINCIPAL vs VISTA HISTORIA */}
            <AnimatePresence mode="wait">
                {!activeStory ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid-layout"
                    >
                        {/* IZQUIERDA: LISTA DE HISTORIAS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section className="glass-panel module-card">
                                <div className="card-header">
                                    <h3><Home size={22} color="var(--primary)" /> Casos de Aprendizaje (RES-F)</h3>
                                </div>
                                <p className="card-desc">
                                    La comunicación en casa es el principal pilar de la resiliencia escolar. Estas historias
                                    cotidianas nos ayudan a entender sus estilos de crianza para apoyar mejor a sus hijos. No hay respuestas "malas", solo información para el equipo del colegio.
                                </p>

                                <div className="story-list-cards">
                                    {familyStories.map(story => {
                                        const isCompleted = completedStories.includes(story.id);
                                        return (
                                            <div key={story.id} className={`story-card ${isCompleted ? 'completed' : ''}`}>
                                                <div className="story-card-icon">
                                                    {isCompleted ? <CheckCircle size={28} color="var(--secondary)" /> : <PlayCircle size={28} color="var(--primary)" />}
                                                </div>
                                                <div className="story-card-info">
                                                    <span className="story-theme">{story.theme}</span>
                                                    <h4>{story.title}</h4>
                                                    <p>{story.desc}</p>
                                                </div>
                                                <div className="story-card-action">
                                                    <button
                                                        className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                                                        onClick={() => startStory(story)}
                                                    >
                                                        {isCompleted ? 'Revisar' : 'Participar'}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        </div>

                        {/* DERECHA: SIDEBAR INFORMATIVO */}
                        <div className="desktop-sidebar">
                            <section className="glass-panel module-card infobox">
                                <h3><ShieldCheck size={20} color="var(--secondary)" /> Privacidad de los Datos</h3>
                                <p>La información recopilada en este portal es estrictamente confidencial. Solo el orientador o psicólogo(a) del colegio utilizará estas respuestas para:</p>
                                <ul>
                                    <li>Comprender el <b>Poder, Autoestima y Comunicación</b> en el hogar.</li>
                                    <li>Generar alertas tempranas de riesgo de deserción escolar.</li>
                                    <li>Planificar talleres para padres más efectivos.</li>
                                </ul>
                            </section>

                            <section className="glass-panel module-card infobox tips-box">
                                <h3><HeartHandshake size={20} color="var(--accent)" /> Tip de Resiliencia</h3>
                                <blockquote>
                                    "Un adolescente resiliente no es el que no tiene problemas, sino el que sabe que puede contar de manera segura con al menos un adulto cuando algo sale mal."
                                </blockquote>
                            </section>
                        </div>
                    </motion.div>
                ) : (
                    /* VISTA DE LA HISTORIA ACTIVA */
                    <motion.div
                        key="story"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-panel active-story-container"
                    >
                        <div className="active-story-header">
                            <button className="btn btn-secondary back-btn-top" onClick={() => setActiveStory(null)}>
                                Volver
                            </button>
                            <h2>{activeStory.title}</h2>
                            <span className="story-theme large">{activeStory.theme}</span>
                        </div>

                        <div className="active-story-body">
                            <div className="story-context-box">
                                <MessageCircle size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                <p className="story-main-text">{activeStory.text}</p>
                            </div>

                            <div className="story-options-prompt">
                                <h3>¿Cómo actuaría usted normalmente en este escenario?</h3>
                                <p>Seleccione la respuesta que más se acerque a la realidad de su hogar.</p>

                                <div className="story-options-grid">
                                    {activeStory.options.map(opt => (
                                        <button
                                            key={opt.id}
                                            className={`family-opt-btn ${selectedOption === opt.id ? 'selected' : ''}`}
                                            onClick={() => handleOptionSelect(opt.id)}
                                            style={{
                                                borderColor: selectedOption === opt.id ? opt.color : 'var(--border-color)',
                                                boxShadow: selectedOption === opt.id ? `0 0 15px ${opt.color}30` : 'none'
                                            }}
                                        >
                                            <h4>{opt.label}</h4>
                                            <p>{opt.text}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedOption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="story-action-footer"
                                >
                                    <p className="feedback-text"><CheckCircle size={18} color="var(--secondary)" /> Respuesta registrada para el Equipo Psicosocial.</p>
                                    <button className="btn btn-primary btn-large" onClick={finishStory}>
                                        Guardar y Continuar
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
