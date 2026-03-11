import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, Play, Loader2 } from 'lucide-react';
import './Tests.css';
import { saveTestResult } from '../services/psychosocialService';
import { chaeaQuestions, chaeaKey } from '../data/chaeaData';
import { socioemocionalQuestions, socioemocionalScale, socioemocionalDimensions } from '../data/socioemocionalData';

export default function PsychosocialTests({ type, onBack, studentInfo }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    // Removed DCSEJ useEffect

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
                studentInfo.id,
                studentInfo.nombre || 'Estudiante Desconocido',
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
                studentInfo.id,
                studentInfo.nombre || 'Estudiante Desconocido',
                studentInfo.curso,
                'socioemocional',
                result.scores,
                result.status,
                newAnswers
            );
        }
    };

    const calculateSocioemocionalResult = (finalAnswers) => {
        let scores = { GestionEmocional: 0, PercepcionAprendizaje: 0, InteraccionSocial: 0, Total: 0 };

        finalAnswers.forEach(ans => {
            // For inverted questions: Nunca=4, Algunas veces=3, Casi Siempre=2, Siempre=1
            // For normal questions: Nunca=1, Algunas veces=2, Casi Siempre=3, Siempre=4
            let itemScore = ans.inverted ? (5 - ans.value) : ans.value;

            if (ans.dimension === "GestionEmocional") scores.GestionEmocional += itemScore;
            else if (ans.dimension === "PercepcionAprendizaje") scores.PercepcionAprendizaje += itemScore;
            else if (ans.dimension === "InteraccionSocial") scores.InteraccionSocial += itemScore;

            scores.Total += itemScore;
        });

        let status = scores.Total > 57 ? "Adecuado" : "Requiere Apoyo";

        return { scores, status };
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
                                <h2>Adaptación Socioemocional</h2>
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
                                <div className="options-column" style={{ marginTop: '2rem', gap: '0.8rem' }}>
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
            ) : null}
        </motion.div>
    );
}
