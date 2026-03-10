import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BarChart3, Users, Award, FileText } from 'lucide-react';
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

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// Datos del Gráfico (Promedio del Curso 2° Medio B)
// Adaptación: 12 Dimensiones de Saavedra
const radarData = {
    labels: [
        'Identidad', 'Autonomía', 'Satisfacción', 'Pragmatismo',
        'Vínculos', 'Redes', 'Modelos', 'Metas',
        'Afectividad', 'Autoeficacia', 'Aprendizaje', 'Generatividad'
    ],
    datasets: [
        {
            label: 'Promedio 2° Medio B (ERE/SV-RES)',
            data: [75, 68, 80, 55, 45, 40, 60, 50, 70, 65, 85, 40],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
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
                font: { size: 11, family: 'Outfit' }
            },
            ticks: {
                display: false,
                min: 0,
                max: 100,
                stepSize: 20
            }
        }
    },
    plugins: {
        legend: { display: false }
    },
    maintainAspectRatio: false
};

// Alertas Tempranas (Adaptadas al modelo MINEDUC / IDPS)
const alerts = [
    {
        id: 1,
        severity: 'high',
        title: 'Déficit Crítico en "Vínculos" y "Redes"',
        desc: '3 estudiantes del 2° Medio B muestran un alto riesgo de aislamiento social. Caída sostenida en el Test ERE de esta semana.',
        idps: 'Riesgo IDPS: Clima de Convivencia Escolar'
    },
    {
        id: 2,
        severity: 'medium',
        title: 'Baja "Autoeficacia" frente a Evaluaciones',
        desc: 'Alta correlación entre estrés reportado en el Diario Emocional y test agendados. Podría afectar el Ausentismo.',
        idps: 'Riesgo IDPS: Asistencia Escolar'
    }
];

// Listado de Alumnos (Boleta de Calificación Socioemocional)
const students = [
    { id: 1, name: 'Martina Vega', role: '2° Medio B', grade: 'S', gradeLabel: 'Siempre', dim: 'Autoconocimiento' },
    { id: 2, name: 'Lucas Pino', role: '2° Medio B', grade: 'O', gradeLabel: 'Ocasionalmente', dim: 'Toma de Decisiones' },
    { id: 3, name: 'Sofía Araneda', role: '2° Medio B', grade: 'G', gradeLabel: 'Generalmente', dim: 'Información' },
];

export default function DashboardProfesor() {
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
                    <p>Visión general de Convivencia Escolar y Resiliencia (MINEDUC)</p>
                </div>

                <div className="kpi-row">
                    <div className="glass-panel kpi-card">
                        <span className="kpi-value">2do Medio B</span>
                        <span className="kpi-label">Curso Seleccionado</span>
                    </div>
                    <div className="glass-panel kpi-card alert">
                        <span className="kpi-value text-gradient">3</span>
                        <span className="kpi-label">Alertas Activas (IDPS)</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Gráfico Radar de las 12 Dimensiones */}
                <section className="glass-panel module-card">
                    <div className="panel-header">
                        <h3><BarChart3 size={20} color="var(--primary)" /> Promedio del Curso: 12 Dimensiones</h3>
                    </div>
                    <p className="card-desc">Evaluación grupal basada en la Escala de Resiliencia SV-RES.</p>
                    <div className="chart-container">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </section>

                {/* Panel derecho: Alertas y Estudiantes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <section className="glass-panel module-card">
                        <div className="panel-header" style={{ marginBottom: '1rem' }}>
                            <h3><ShieldAlert size={20} color="var(--accent)" /> Alertas Tempranas (IDPS)</h3>
                        </div>

                        <div className="alert-list">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                                    <div className="alert-icon">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div className="alert-content">
                                        <h4>{alert.title}</h4>
                                        <p>{alert.desc}</p>
                                        <span className="idps-tag">{alert.idps}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-panel module-card">
                        <div className="panel-header" style={{ marginBottom: '1rem' }}>
                            <h3><Users size={20} color="var(--primary)" /> Boleta Socioemocional</h3>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                <FileText size={14} /> Exportar OAT
                            </button>
                        </div>

                        <div className="students-list">
                            {students.map(s => (
                                <div key={s.id} className="student-row">
                                    <div className="student-info">
                                        <div className="avatar">{s.name.charAt(0)}</div>
                                        <div>
                                            <div className="student-name">{s.name}</div>
                                            <div className="student-role">{s.dim}</div>
                                        </div>
                                    </div>
                                    <div className="student-action" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className={`grade-badge grade-${s.grade.toLowerCase()}`}>
                                            {s.grade} ({s.gradeLabel})
                                        </div>
                                        <button className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Otorgar Praise Badge">
                                            <Award size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </motion.div>
    );
}
