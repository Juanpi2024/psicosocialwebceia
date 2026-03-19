import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, Play, Loader2, Sparkles } from 'lucide-react';
import './Tests.css';
import { saveTestResult, getDCSEJSituations } from '../services/psychosocialService';
import { chaeaQuestions, chaeaKey } from '../data/chaeaData';
import { socioemocionalQuestions, socioemocionalScale } from '../data/socioemocionalData';
import { motivacionQuestions, motivacionScale } from '../data/motivacionData';
import { autoeficaciaQuestions, autoeficaciaScale } from '../data/autoeficaciaData';
import { climaEscolarQuestions, climaEscolarScale } from '../data/climaEscolarData';

export default function PsychosocialTests({ type, onBack, studentInfo }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [situations, setSituations] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [scoreDCSEJ, setScoreDCSEJ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (type === 'dcsej') {
            setLoading(true);
            getDCSEJSituations().then(data => {
                setSituations(data);
                setLoading(false);
            });
        }
    }, [type]);

    // CHAEA LOGIC
    const handleCHAEAAnswer = async (value) => {
        // value es true (Generalmente) o false (Casi Nunca)
        const currentQ = chaeaQuestions[currentStep];
        const newAnswers = [...answers, { id: currentQ.id, value }];

        if (currentStep < chaeaQuestions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);

            const profileVal = calculateCHAEAResult(newAnswers);
            const { mainStyle, scores } = profileVal;

            await saveTestResult(
                studentInfo.rut || studentInfo.id || 'ANONIMO',
                studentInfo.nombre || studentInfo.name || 'Estudiante Desconocido',
                studentInfo.curso,
                'chaea',
                scores,
                mainStyle,
                newAnswers
            );
        }
    };

    const calculateCHAEAResult = (finalAnswers) => {
        let scores = { ACTIVO: 0, REFLEXIVO: 0, TEORICO: 0, PRAGMATICO: 0 };

        finalAnswers.forEach(ans => {
            if (ans.value === true) { // Solo suma si es "Generalmente" (positivo)
                if (chaeaKey.ACTIVO.includes(ans.id)) scores.ACTIVO++;
                else if (chaeaKey.REFLEXIVO.includes(ans.id)) scores.REFLEXIVO++;
                else if (chaeaKey.TEORICO.includes(ans.id)) scores.TEORICO++;
                else if (chaeaKey.PRAGMATICO.includes(ans.id)) scores.PRAGMATICO++;
            }
        });

        // Determinar el dominante
        let maxVal = -1;
        let mainStyle = '';
        for (const [style, score] of Object.entries(scores)) {
            if (score > maxVal) {
                maxVal = score;
                mainStyle = style;
            }
        }

        return { mainStyle, scores };
    };

    // SOCIOEMOCIONAL LOGIC
    const handleSocioemocionalAnswer = async (value) => {
        const currentQ = socioemocionalQuestions[currentStep];
        const newAnswers = [...answers, { id: currentQ.id, dimension: currentQ.dimension, inverted: currentQ.inverted, value }];

        if (currentStep < socioemocionalQuestions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);

            const result = calculateSocioemocionalResult(newAnswers);

            await saveTestResult(
                studentInfo.rut || studentInfo.id || 'ANONIMO',
                studentInfo.nombre || studentInfo.name || 'Estudiante Desconocido',
                studentInfo.curso,
                'socioemocional',
                result.scores,
                result.status,
                newAnswers
            );
        }
    };

    const calculateSocioemocionalResult = (finalAnswers) => {
        let scores = { Intrapersonal: 0, Interpersonal: 0, Ciudadana: 0, Gestion: 0, Total: 0 };

        finalAnswers.forEach(ans => {
            let itemScore = ans.value; // Escala 1-4

            if (ans.dimension === "Intrapersonal") scores.Intrapersonal += itemScore;
            else if (ans.dimension === "Interpersonal") scores.Interpersonal += itemScore;
            else if (ans.dimension === "Ciudadana") scores.Ciudadana += itemScore;
            else if (ans.dimension === "Gestion") scores.Gestion += itemScore;

            scores.Total += itemScore;
        });

        // El puntaje máximo es 22*4 = 88. 
        let status = scores.Total > 55 ? "Adecuado" : "Requiere Apoyo";

        return { scores, status };
    };

    // NEW TESTS LOGIC
    const handleGenericAnswer = async (value, questions, testType) => {
        const currentQ = questions[currentStep];
        const newAnswers = [...answers, { id: currentQ.id, dimension: currentQ.dimension, value }];

        if (currentStep < questions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);

            let scores = {};
            if (testType === 'motivacion') {
                questions.forEach(q => { if (q.dimension) scores[q.dimension] = 0; });
                newAnswers.forEach(ans => { if (ans.dimension) scores[ans.dimension] += ans.value; });
            } else {
                let total = 0;
                newAnswers.forEach(ans => { total += ans.value; });
                scores = { total };
            }

            await saveTestResult(
                studentInfo.rut || studentInfo.id || 'ANONIMO',
                studentInfo.nombre || studentInfo.name || 'Estudiante Desconocido',
                studentInfo.curso,
                testType,
                scores,
                "Completado",
                newAnswers
            );
        }
    };

    if (loading) {
        return (
            <div className="test-container glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="loading-spinner text-gradient" size={48} style={{ animation: 'spin 1s linear infinite' }} />
                <h3 style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>Cargando test...</h3>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="test-container glass-panel"
        >
            <button className="back-btn" onClick={onBack}>
                <ChevronLeft size={20} /> Volver al Dashboard
            </button>

            {type === 'chaea' ? (
                <div className="test-content">
                    {!finished ? (
                        <>
                            <div className="test-header">
                                <BookOpen className="text-gradient" size={32} />
                                <h2>Cuestionario CHAEA</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pregunta {currentStep + 1} de {chaeaQuestions.length}</p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep) / chaeaQuestions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section" style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', lineHeight: 1.6, minHeight: '80px' }}>
                                    {chaeaQuestions[currentStep].text}
                                </h3>
                                <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
                                    <button className="opt-btn" style={{ background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.3)' }} onClick={() => handleCHAEAAnswer(true)}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10B981' }}>+</span> Generalmente
                                    </button>
                                    <button className="opt-btn" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' }} onClick={() => handleCHAEAAnswer(false)}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F43F5E' }}>-</span> Casi nunca
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="result-section">
                            <CheckCircle size={64} color="var(--secondary)" />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Test Completado!</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tu estilo de aprendizaje dominante es:</p>
                            <h3 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>
                                {calculateCHAEAResult(answers).mainStyle}
                            </h3>

                            <div className="profile-details glass-panel" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                                {calculateCHAEAResult(answers).mainStyle === 'ACTIVO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Vives la experiencia!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Disfrutas el presente pero te entusiasma el futuro, por lo que buscas aprender siempre cosas nuevas. Llenas tus días de actividades y tan pronto te aburres, integras nuevos desafíos.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'REFLEXIVO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Piensas antes de actuar!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Analizas meticulosamente la información y escuchas a los demás antes de llegar a una conclusión o aportar tu perspectiva.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'TEORICO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Sistematizas y estructuras!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Buscas que todo encaje en esquemas lógicos. Eres perfeccionista, profundo y racional a la hora de procesar nueva información.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'PRAGMATICO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Vas directo al grano!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Te gusta probar nuevas ideas y comprobar en la realidad si funcionan. Te impacientan las largas discusiones teóricas.</p>
                                    </>
                                )}
                            </div>

                            <button className="btn btn-primary" onClick={onBack} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Finalizar y Volver</button>
                        </div>
                    )}
                </div>
            ) : type === 'socioemocional' ? (
                <div className="test-content">
                    {!finished ? (
                        <>
                            <div className="test-header">
                                <Play className="text-gradient" size={32} />
                                <h2>Adaptación Socioemocional (DIA)</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Afirmación {currentStep + 1} de {socioemocionalQuestions.length}</p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep) / socioemocionalQuestions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section" style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', lineHeight: 1.6, minHeight: '80px', color: 'var(--text-main)' }}>
                                    "{socioemocionalQuestions[currentStep].text}"
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                                    Dimensión: {socioemocionalQuestions[currentStep].dimension}
                                </p>
                                <div className="options-column" style={{ marginTop: '1rem', gap: '0.8rem' }}>
                                    {socioemocionalScale.map((opt, i) => (
                                        <button key={i} className="opt-btn story-opt" style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => handleSocioemocionalAnswer(opt.value)}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="result-section">
                            <CheckCircle size={64} color="var(--secondary)" />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Cuestionario Completado!</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Gracias por responder con honestidad.</p>
                            <p style={{ marginTop: '1rem' }}>Tus resultados han sido enviados a tu profesor para apoyarte en tu desarrollo educativo y socioemocional.</p>
                            <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', marginTop: '2rem' }} onClick={onBack}>Finalizar y Volver</button>
                        </div>
                    )}
                </div>
            ) : type === 'motivacion' || type === 'autoeficacia' || type === 'clima' ? (
                <div className="test-content">
                    {!finished ? (
                        <>
                            <div className="test-header">
                                <Play className="text-gradient" size={32} />
                                <h2>{type === 'motivacion' ? 'Escala de Motivación (EME-S)' : type === 'autoeficacia' ? 'Autoeficacia Académica' : 'Clima y Seguridad (EPJA)'}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Ítem {currentStep + 1} de {type === 'motivacion' ? motivacionQuestions.length : type === 'autoeficacia' ? autoeficaciaQuestions.length : climaEscolarQuestions.length}
                                </p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep) / (type === 'motivacion' ? motivacionQuestions.length : type === 'autoeficacia' ? autoeficaciaQuestions.length : climaEscolarQuestions.length)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section" style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', lineHeight: 1.6, minHeight: '80px', color: 'var(--text-main)' }}>
                                    "{type === 'motivacion' ? motivacionQuestions[currentStep].text : type === 'autoeficacia' ? autoeficaciaQuestions[currentStep].text : climaEscolarQuestions[currentStep].text}"
                                </h3>
                                <div className="options-column" style={{ marginTop: '2rem', gap: '0.8rem' }}>
                                    {(type === 'motivacion' ? motivacionScale : type === 'autoeficacia' ? autoeficaciaScale : climaEscolarScale).map((opt, i) => (
                                        <button key={i} className="opt-btn story-opt" style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }} 
                                            onClick={() => handleGenericAnswer(opt.value, (type === 'motivacion' ? motivacionQuestions : type === 'autoeficacia' ? autoeficaciaQuestions : climaEscolarQuestions), type)}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="result-section">
                            <CheckCircle size={64} color="var(--secondary)" />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Evaluación Completada!</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Tus respuestas han sido registradas exitosamente.</p>
                            <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', marginTop: '2rem' }} onClick={onBack}>Finalizar y Volver</button>
                        </div>
                    )}
                </div>
            ) : type === 'dcsej' ? (
                <div className="test-content">
                    {!finished && situations.length > 0 ? (
                        <>
                            <div className="test-header">
                                <Sparkles className="text-gradient" size={32} />
                                <h2>Test Situacional</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Historia {currentStep + 1} de {situations.length}</p>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${((currentStep) / situations.length) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="question-section" style={{ marginTop: '2.5rem' }}>
                                <div className="situation-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', lineHeight: 1.6, fontWeight: 700 }}>
                                        {situations[currentStep].title}
                                    </h3>
                                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                        {situations[currentStep].context}
                                    </p>
                                </div>

                                <div className="options-column">
                                    {situations[currentStep].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`opt-btn story-opt ${selectedOption === i ? 'selected' : ''}`}
                                            onClick={() => setSelectedOption(i)}
                                            style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                                        >
                                            <div className="opt-indicator">{i + 1}</div>
                                            <span>{opt.text}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="test-footer" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn btn-primary"
                                        disabled={selectedOption === null}
                                        onClick={async () => {
                                            const points = situations[currentStep].options[selectedOption].points;
                                            const newScore = scoreDCSEJ + points;
                                            setScoreDCSEJ(newScore);

                                            if (currentStep < situations.length - 1) {
                                                setCurrentStep(currentStep + 1);
                                                setSelectedOption(null);
                                            } else {
                                                setFinished(true);
                                                const profile = newScore >= 12 ? "Habilidades Sociales Altas" : "Requiere Entrenamiento";
                                                await saveTestResult(
                                                    studentInfo.id,
                                                    studentInfo.nombre || 'Estudiante',
                                                    studentInfo.curso,
                                                    'dcsej',
                                                    { total: newScore },
                                                    profile,
                                                    []
                                                );
                                            }
                                        }}
                                        style={{ padding: '1rem 3rem' }}
                                    >
                                        Continuar <ChevronLeft size={18} style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : finished ? (
                        <div className="result-section">
                            <CheckCircle size={64} color="var(--secondary)" />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Test Finalizado!</h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Has completado todas las situaciones del diagnóstico.</p>
                            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--secondary)' }}>
                                <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>Resultado Provisorio</h4>
                                <h3 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
                                    {scoreDCSEJ >= 12 ? "Liderazgo Asertivo" : "Potencial de Crecimiento"}
                                </h3>
                                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Tu profesor revisará el detalle de tus elecciones para brindarte mejores herramientas.</p>
                            </div>
                            <button className="btn btn-primary" style={{ padding: '1rem 4rem' }} onClick={onBack}>Finalizar</button>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </motion.div>
    );
}
