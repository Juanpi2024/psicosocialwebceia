import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './Tests.css';

// --- DATA: ESTILOS DE APRENDIZAJE (VAK) ---
const vakQuestions = [
    {
        id: 1,
        question: "Cuando estás en clase y el profesor explica algo nuevo, ¿qué te ayuda más a entender?",
        options: [
            { text: "Ver esquemas, dibujos o lo que el profesor escribe en la pizarra.", type: "V" },
            { text: "Escuchar con atención la explicación y participar en la discusión.", type: "A" },
            { text: "Hacer actividades prácticas o tomar apuntes de forma activa.", type: "K" }
        ]
    },
    {
        id: 2,
        question: "Si tienes que estudiar para una prueba de Historia, ¿cómo prefieres hacerlo?",
        options: [
            { text: "Leyendo mis apuntes o mirando mapas y líneas de tiempo.", type: "V" },
            { text: "Repitiendo la información en voz alta o grabando la lección.", type: "A" },
            { text: "Dibujando mapas conceptuales o moviéndome mientras estudio.", type: "K" }
        ]
    },
    {
        id: 3,
        question: "En tu tiempo libre, ¿qué actividad prefieres realizar?",
        options: [
            { text: "Ver una película, series o leer un libro/cómic.", type: "V" },
            { text: "Escuchar música o conversar con amigos.", type: "A" },
            { text: "Hacer deporte, cocinar o armar cosas con las manos.", type: "K" }
        ]
    }
];

// --- DATA: HISTORIA SITUACIONAL (DCSE-J) ---
const situationalStory = {
    title: "El Desafío del Trabajo Grupal",
    steps: [
        {
            id: "intro",
            text: "Es lunes por la mañana. El profesor de Historia ha asignado un trabajo grupal importante que vale el 30% de la nota final. Te toca con Lucas y Sofía.",
            options: [
                { text: "Siguiente", next: "s1" }
            ]
        },
        {
            id: "s1",
            text: "Han pasado tres días y Lucas no ha enviado su parte. Sofía dice que ella tampoco lo hará si Lucas no empieza. ¿Cómo reaccionas?",
            options: [
                { text: "Les escribo con calma proponiendo una reunión hoy mismo para organizarnos.", type: "Asertivo", next: "end" },
                { text: "Me enojo y les digo que si no trabajan los sacaré del grupo.", type: "Agresivo", next: "end" },
                { text: "No digo nada y termino haciendo el trabajo solo para evitar problemas.", type: "Pasivo", next: "end" }
            ]
        },
        {
            id: "end",
            text: "¡Has completado esta situación! Tus respuestas ayudan a entender cómo manejas los conflictos en el aula.",
            options: []
        }
    ]
};

export default function PsychosocialTests({ type, onBack }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);

    // Lógica para VAK
    const handleVAKAnswer = (type) => {
        const newAnswers = [...answers, type];
        if (currentStep < vakQuestions.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            setAnswers(newAnswers);
            setFinished(true);
        }
    };

    const calculateVAKResult = () => {
        const counts = answers.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        const max = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const labels = { V: "Visual", A: "Auditivo", K: "Kinestésico" };
        return labels[max];
    };

    // Lógica para Historia Situacional
    const [storyId, setStoryId] = useState("intro");
    const handleStoryChoice = (choice) => {
        if (choice.next) {
            setStoryId(choice.next);
        }
    };

    const currentStoryStep = situationalStory.steps.find(s => s.id === storyId);

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
                    {!finished ? (
                        <>
                            <div className="test-header">
                                <BookOpen className="text-gradient" size={32} />
                                <h2>Test de Estilos de Aprendizaje</h2>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep + 1) / vakQuestions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="question-section">
                                <h3>{vakQuestions[currentStep].question}</h3>
                                <div className="options-grid">
                                    {vakQuestions[currentStep].options.map((opt, i) => (
                                        <button key={i} className="opt-btn" onClick={() => handleVAKAnswer(opt.type)}>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="result-section">
                            <CheckCircle size={64} color="var(--secondary)" />
                            <h2>¡Test Completado!</h2>
                            <p>Tu estilo predominante es: <strong className="text-gradient">{calculateVAKResult()}</strong></p>
                            <p className="desc">Hemos enviado esta información a tu profesor para que tus clases sean más entretenidas para ti.</p>
                            <button className="btn btn-primary" onClick={onBack}>Volver</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="test-content">
                    <div className="test-header">
                        <Play className="text-gradient" size={32} />
                        <h2>Historia Situacional: {situationalStory.title}</h2>
                    </div>

                    <div className="story-box">
                        <p className="story-text">{currentStoryStep.text}</p>
                        <div className="options-column">
                            {currentStoryStep.options.map((opt, i) => (
                                <button key={i} className="opt-btn story-opt" onClick={() => handleStoryChoice(opt)}>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                        {currentStoryStep.id === 'end' && (
                            <div className="result-section">
                                <CheckCircle size={48} color="var(--secondary)" />
                                <p>Respuestas registradas correctamente.</p>
                                <button className="btn btn-primary" onClick={onBack}>Finalizar</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
