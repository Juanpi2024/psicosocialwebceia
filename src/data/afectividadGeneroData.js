// Encuesta de Afectividad, Sexualidad y Género
// Contexto CEIA: Adolescentes y adultos en educación vespertina/nocturna
// Basada en los Objetivos de Aprendizaje Transversales (OAT) del Mineduc
// y las Orientaciones para la Educación en Sexualidad, Afectividad y Género (2017)

export const afectividadGeneroQuestions = [
    // Dimensión 1: Autoconocimiento y Afectividad
    { id: "ag1", dimension: "Autoconocimiento", text: "Reconozco mis emociones y sentimientos en las relaciones con otras personas." },
    { id: "ag2", dimension: "Autoconocimiento", text: "Me siento cómodo/a conversando sobre mis sentimientos con personas de confianza." },
    { id: "ag3", dimension: "Autoconocimiento", text: "Comprendo que la afectividad es una parte importante de mi bienestar personal." },

    // Dimensión 2: Relaciones Interpersonales y Vínculos
    { id: "ag4", dimension: "Relaciones", text: "Sé identificar las características de una relación sana y respetuosa." },
    { id: "ag5", dimension: "Relaciones", text: "Respeto las decisiones y los límites que otras personas establecen en una relación." },
    { id: "ag6", dimension: "Relaciones", text: "Puedo comunicar mis propios límites personales de manera clara y sin agresión." },

    // Dimensión 3: Género y Diversidad
    { id: "ag7", dimension: "Genero", text: "Creo que todas las personas merecen el mismo respeto, sin importar su orientación sexual o identidad de género." },
    { id: "ag8", dimension: "Genero", text: "Rechazo los comentarios o bromas que buscan humillar a alguien por su forma de ser o de expresarse." },
    { id: "ag9", dimension: "Genero", text: "Considero que hombres y mujeres deben tener las mismas oportunidades en el ámbito educativo y laboral." },

    // Dimensión 4: Autocuidado y Prevención
    { id: "ag10", dimension: "Autocuidado", text: "Conozco información básica sobre salud sexual y métodos de prevención de infecciones de transmisión sexual." },
    { id: "ag11", dimension: "Autocuidado", text: "Sé dónde acudir si necesito orientación o ayuda en temas de salud sexual y reproductiva." },
    { id: "ag12", dimension: "Autocuidado", text: "Considero importante tomar decisiones informadas y autónomas sobre mi cuerpo y mi sexualidad." },

    // Dimensión 5: Derechos y Convivencia
    { id: "ag13", dimension: "Derechos", text: "Conozco mis derechos en relación a la no discriminación por orientación sexual o identidad de género." },
    { id: "ag14", dimension: "Derechos", text: "Sé que el acoso sexual o el abuso en cualquier contexto es un delito y debe ser denunciado." },
    { id: "ag15", dimension: "Derechos", text: "Me sentiría capaz de buscar ayuda o reportar una situación de violencia de género si la presenciara." }
];

export const afectividadGeneroScale = [
    { value: 1, label: "Totalmente en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "De acuerdo" },
    { value: 4, label: "Totalmente de acuerdo" }
];

export const afectividadGeneroDimensions = {
    Autoconocimiento: "Autoconocimiento y Afectividad",
    Relaciones: "Relaciones Interpersonales y Vínculos",
    Genero: "Género y Diversidad",
    Autocuidado: "Autocuidado y Prevención",
    Derechos: "Derechos y Convivencia"
};
