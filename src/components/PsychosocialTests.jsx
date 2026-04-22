import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, Play, Loader2 } from 'lucide-react';
import './Tests.css';
import { saveTestResult } from '../services/psychosocialService';
import { chaeaQuestions, chaeaKey } from '../data/chaeaData';
import { participacionQuestions, participacionScale } from '../data/participacionData';
import { climaConvivenciaQuestions, climaConvivenciaScale } from '../data/climaConvivenciaData';
import { autoestimaMotivaQuestions, autoestimaMotivaScale } from '../data/autoestimaMotivaData';
import { afectividadGeneroQuestions, afectividadGeneroScale } from '../data/afectividadGeneroData';

// Mapeo de tipo -> datos 
const GENERIC_TESTS = {
    participacion: {
        questions: participacionQuestions,
        scale: participacionScale,
        title: 'Participación y Formación Ciudadana',
    },
    clima_convivencia: {
        questions: climaConvivenciaQuestions,
        scale: climaConvivenciaScale,
        title: 'Clima y Convivencia Escolar',
    },
    autoestima_motivacion: {
        questions: autoestimaMotivaQuestions,
        scale: autoestimaMotivaScale,
        title: 'Autoestima y Motivación Escolar',
    },
    afectividad_genero: {
        questions: afectividadGeneroQuestions,
        scale: afectividadGeneroScale,
        title: 'Afectividad, Sexualidad y Género',
    },
};

export default function PsychosocialTests({ type, onBack, studentInfo }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);

    // ═══════════════════════════════════════════
    //  CHAEA LOGIC
    // ═══════════════════════════════════════════
    const handleCHAEAAnswer = async (value) => {
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
            if (ans.value === true) {
                if (chaeaKey.ACTIVO.includes(ans.id)) scores.ACTIVO++;
                else if (chaeaKey.REFLEXIVO.includes(ans.id)) scores.REFLEXIVO++;
                else if (chaeaKey.TEORICO.includes(ans.id)) scores.TEORICO++;
                else if (chaeaKey.PRAGMATICO.includes(ans.id)) scores.PRAGMATICO++;
            }
        });

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

    // ═══════════════════════════════════════════
    //  GENERIC LIKERT LOGIC (4 encuestas)
    // ═══════════════════════════════════════════
    const handleGenericAnswer = async (value, questions, testType) => {
        const currentQ = questions[currentStep];
        const newAnswers = [...answers, { id: currentQ.id, dimension: currentQ.dimension, value, inverted: currentQ.inverted || false }];

        if (currentStep < questions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);

            // Calcular puntajes por dimensión
            const scores = {};
            newAnswers.forEach(ans => {
                if (!scores[ans.dimension]) scores[ans.dimension] = 0;
                scores[ans.dimension] += ans.value;
            });

            // Determinar perfil según tipo
            let profile = "Completado";

            if (testType === 'autoestima_motivacion') {
                const riesgo = scores['Riesgo'] || 0;
                const autoestima = scores['Autoestima'] || 0;
                const miTotal = (scores['Motivacion Intrinseca'] || 0);
                // Ítems invertidos: puntaje alto en Riesgo = alerta
                if (riesgo >= 12) profile = "Riesgo de Deserción";
                else if (autoestima <= 8) profile = "Baja Autoestima";
                else if (miTotal >= 12) profile = "Motivación Intrínseca Alta";
                else profile = "Adecuado";
            } else if (testType === 'clima_convivencia') {
                const total = Object.values(scores).reduce((a, b) => a + b, 0);
                if (total >= 32) profile = "Clima Positivo";
                else if (total >= 24) profile = "Clima Aceptable";
                else profile = "Clima Vulnerable";
            } else if (testType === 'afectividad_genero') {
                const total = Object.values(scores).reduce((a, b) => a + b, 0);
                if (total >= 48) profile = "Alto Conocimiento";
                else if (total >= 36) profile = "Conocimiento Medio";
                else profile = "Requiere Refuerzo";
            } else if (testType === 'participacion') {
                const total = Object.values(scores).reduce((a, b) => a + b, 0);
                if (total >= 38) profile = "Alta Participación";
                else if (total >= 28) profile = "Participación Media";
                else profile = "Baja Participación";
            }

            await saveTestResult(
                studentInfo.rut || studentInfo.id || 'ANONIMO',
                studentInfo.nombre || studentInfo.name || 'Estudiante Desconocido',
                studentInfo.curso,
                testType,
                scores,
                profile,
                newAnswers
            );
        }
    };

    // ═══════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════

    // CHAEA render
    if (type === 'chaea') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="test-container glass-panel"
            >
                <button className="back-btn" onClick={onBack}>
                    <ChevronLeft size={20} /> Volver al Dashboard
                </button>
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
                                        <p style={{ color: 'var(--text-muted)' }}>Disfrutas el presente pero te entusiasma el futuro, por lo que buscas aprender siempre cosas nuevas.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'REFLEXIVO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Piensas antes de actuar!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Analizas meticulosamente la información y escuchas a los demás antes de llegar a una conclusión.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'TEORICO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Sistematizas y estructuras!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Buscas que todo encaje en esquemas lógicos. Eres perfeccionista, profundo y racional.</p>
                                    </>
                                )}
                                {calculateCHAEAResult(answers).mainStyle === 'PRAGMATICO' && (
                                    <>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>¡Vas directo al grano!</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Te gusta probar nuevas ideas y comprobar en la realidad si funcionan.</p>
                                    </>
                                )}
                            </div>

                            <button className="btn btn-primary" onClick={onBack} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Finalizar y Volver</button>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    // GENERIC LIKERT render (participacion, clima_convivencia, autoestima_motivacion, afectividad_genero)
    const testConfig = GENERIC_TESTS[type];
    if (testConfig) {
        const { questions, scale, title } = testConfig;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="test-container glass-panel"
            >
                <button className="back-btn" onClick={onBack}>
                    <ChevronLeft size={20} /> Volver al Dashboard
                </button>
                <div className="test-content">
                    {!finished ? (
                        <>
                            <div className="test-header">
                                <Play className="text-gradient" size={32} />
                                <h2>{title}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Ítem {currentStep + 1} de {questions.length}
                                </p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section" style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', lineHeight: 1.6, minHeight: '80px', color: 'var(--text-main)' }}>
                                    "{questions[currentStep].text}"
                                </h3>
                                {questions[currentStep].dimension && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                                        Dimensión: {questions[currentStep].dimension}
                                    </p>
                                )}
                                <div className="options-column" style={{ marginTop: '2rem', gap: '0.8rem' }}>
                                    {scale.map((opt, i) => (
                                        <button key={i} className="opt-btn story-opt" style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                                            onClick={() => handleGenericAnswer(opt.value, questions, type)}>
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
            </motion.div>
        );
    }

    // Tipo no reconocido
    return (
        <div className="test-container glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
            <Loader2 size={48} color="var(--primary)" />
            <h3 style={{ color: 'var(--text-muted)' }}>Test no disponible: {type}</h3>
            <button className="btn btn-primary" onClick={onBack}>Volver</button>
        </div>
    );
}
