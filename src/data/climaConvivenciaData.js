// Clima y Convivencia Escolar
// Contexto CEIA: Percepción del ambiente escolar vespertino/nocturno
// Incluye ítems de seguridad, convivencia y bienestar institucional

export const climaConvivenciaQuestions = [
    { id: "cc1", dimension: "Respeto", text: "Siento que en esta escuela se respeta a todas las personas, sin importar su edad o su origen." },
    { id: "cc2", dimension: "Respeto", text: "Los profesores me tratan como un adulto, respetando mi experiencia y mis opiniones." },
    { id: "cc3", dimension: "Seguridad", text: "Me siento seguro/a dentro de la escuela durante las horas de clase." },
    { id: "cc4", dimension: "Seguridad", text: "La iluminación de los accesos y pasillos es suficiente para moverme con tranquilidad." },
    { id: "cc5", dimension: "Convivencia", text: "Si tengo un conflicto con un compañero/a, sé que la escuela ayudará a resolverlo conversando." },
    { id: "cc6", dimension: "Convivencia", text: "Nunca he sentido que me traten de forma distinta por mi género o por mis responsabilidades fuera de la escuela." },
    { id: "cc7", dimension: "Seguridad", text: "Siento que la escuela se preocupa por mi seguridad al momento de la salida." },
    { id: "cc8", dimension: "Convivencia", text: "En el aula se respira un ambiente de silencio y respeto que permite concentrarme en estudiar." },
    { id: "cc9", dimension: "Convivencia", text: "He visto que el personal de la escuela actúa rápidamente ante situaciones de falta de respeto." },
    { id: "cc10", dimension: "Respeto", text: "Considero que la escuela es un lugar acogedor donde me siento bienvenido/a cada jornada." }
];

export const climaConvivenciaScale = [
    { value: 1, label: "Totalmente en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "De acuerdo" },
    { value: 4, label: "Totalmente de acuerdo" }
];

export const climaConvivenciaDimensions = {
    Respeto: "Respeto y Trato",
    Seguridad: "Seguridad Escolar",
    Convivencia: "Convivencia y Resolución de Conflictos"
};
