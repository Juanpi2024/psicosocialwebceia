import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Play, Loader2 } from 'lucide-react';
import './Tests.css';
import { getVAKQuestions, getDCSEJSituations, saveTestResult } from '../services/psychosocialService';

export default function PsychosocialTests({ type, onBack, studentInfo }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estado para datos dinámicos
    const [vakQuestions, setVakQuestions] = useState([]);
    const [dcsejSituations, setDcsejSituations] = useState([]);

    // Cargar preguntas desde Firebase al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (type === 'vak') {
                    const questions = await getVAKQuestions();
                    setVakQuestions(questions);
                } else if (type === 'dcsej') {
                    const situations = await getDCSEJSituations();
                    setDcsejSituations(situations);
                }
            } catch (error) {
                console.error("Error al cargar los tests:", error);
                // Aquí podrías agregar un estado de error visible
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type]);

    // Lógica para VAK
    const handleVAKAnswer = async (category, text) => {
        const newAnswers = [...answers, { category, text }];

        if (currentStep < vakQuestions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);

            // Calcular resultados finales
            const profileVal = calculateVAKResult(newAnswers);
            const { maxCategory, scores } = profileVal;

            // Guardar en Firebase
            if (studentInfo && studentInfo.id) {
                await saveTestResult(
                    studentInfo.id,
                    studentInfo.nombre || 'Estudiante Desconocido',
                    'vak',
                    scores,
                    maxCategory,
                    newAnswers
                );
            }
        }
    };

    const calculateVAKResult = (finalAnswers) => {
        const scores = finalAnswers.reduce((acc, val) => {
            acc[val.category] = (acc[val.category] || 0) + 1;
            return acc;
        }, { visual: 0, auditivo: 0, kinestesico: 0 });

        const maxCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const labels = { visual: "Visual", auditivo: "Auditivo", kinestesico: "Kinestésico" };

        return { maxCategory: labels[maxCategory], scores };
    };

    // Lógica para Historia Situacional
    const [storyId, setStoryId] = useState("s1"); // Empezar directamente en s1 por simplificación temporal
    const handleStoryChoice = (choice) => {
        // Lógica simplificada temporalmente
        setFinished(true);
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

            {type === 'vak' ? (
                <div className="test-content">
                    {!finished && vakQuestions.length > 0 ? (
                        <>
                            <div className="test-header">
                                <BookOpen className="text-gradient" size={32} />
                                <h2>Test de Estilos de Aprendizaje</h2>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep) / vakQuestions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section">
                                <h3>{vakQuestions[currentStep].question}</h3>
                                <div className="options-grid">
                                    {vakQuestions[currentStep].options.map((opt, i) => (
                                        <button key={i} className="opt-btn" onClick={() => handleVAKAnswer(opt.category, opt.text)}>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        finished && (
                            <div className="result-section">
                                <CheckCircle size={64} color="var(--secondary)" />
                                <h2>¡Test Completado!</h2>
                                <p>Tu estilo predominante es: <strong className="text-gradient">{calculateVAKResult(answers).maxCategory}</strong></p>
                                <p className="desc">Hemos enviado esta información a tu profesor para que tus clases sean más entretenidas para ti.</p>
                                <button className="btn btn-primary" onClick={onBack}>Volver</button>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="test-content">
                    {!finished && dcsejSituations.length > 0 ? (
                        <>
                            <div className="test-header">
                                <Play className="text-gradient" size={32} />
                                <h2>Test Situacional DCSE-J</h2>
                            </div>

                            <div className="story-box">
                                <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{dcsejSituations[storyIndex].title}</h3>
                                <p className="story-text">{dcsejSituations[storyIndex].story}</p>
                                <div className="options-column">
                                    {dcsejSituations[storyIndex].options.map((opt, i) => (
                                        <button key={i} className="opt-btn story-opt" onClick={() => handleDCSEJChoice(opt.category, opt.score, opt.text)}>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        finished && (
                            <div className="result-section">
                                <CheckCircle size={64} color="var(--secondary)" />
                                <h2>¡Cuestionario Completado!</h2>
                                <p>Nivel Evaluado: <strong className="text-gradient">
                                    {dcsejScore > 5 ? "Alto (Prosocial)" : (dcsejScore > 2 ? "Medio (Normativo)" : "Riesgo")}
                                </strong></p>
                                <p className="desc">Gracias por participar. Tus decisiones ayudan a mejorar la convivencia escolar.</p>
                                <button className="btn btn-primary" onClick={onBack}>Finalizar</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </motion.div>
    );
}
