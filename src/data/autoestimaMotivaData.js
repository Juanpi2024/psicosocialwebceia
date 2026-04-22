// Encuesta fusionada: Autoestima y Motivación Escolar
// Combina dimensiones de Adaptación Socioemocional (DIA) y Motivación Educativa (EME-S)
// Adaptada al contexto CEIA para adolescentes y adultos

export const autoestimaMotivaQuestions = [
    // Dimensión 1: Autoestima y Autoconcepto
    { id: "am1", dimension: "Autoestima", text: "Me siento una persona valiosa, al menos tanto como las demás." },
    { id: "am2", dimension: "Autoestima", text: "Creo que tengo varias cualidades positivas como estudiante." },
    { id: "am3", dimension: "Autoestima", text: "Me siento capaz de enfrentar las exigencias académicas de mi curso." },
    { id: "am4", dimension: "Autoestima", text: "Estoy satisfecho/a con la persona que soy actualmente." },

    // Dimensión 2: Autorregulación Emocional
    { id: "am5", dimension: "Autorregulacion", text: "Puedo calmarme cuando estoy muy enojado/a o frustrado/a." },
    { id: "am6", dimension: "Autorregulacion", text: "Pienso antes de actuar cuando algo me molesta en clases." },
    { id: "am7", dimension: "Autorregulacion", text: "Me doy cuenta cuando estoy feliz, triste o enojado/a y puedo expresarlo." },

    // Dimensión 3: Motivación Intrínseca
    { id: "am8", dimension: "Motivacion Intrinseca", text: "Siento placer cuando descubro cosas nuevas en clase." },
    { id: "am9", dimension: "Motivacion Intrinseca", text: "Me gusta profundizar en temas que me interesan, incluso fuera del horario escolar." },
    { id: "am10", dimension: "Motivacion Intrinseca", text: "Disfruto la satisfacción de superar actividades difíciles." },

    // Dimensión 4: Motivación Extrínseca y Metas
    { id: "am11", dimension: "Motivacion Extrinseca", text: "Estudio porque creo que la educación me permitirá mejorar mi calidad de vida." },
    { id: "am12", dimension: "Motivacion Extrinseca", text: "Considero que lo que aprendo aquí me será útil para mi futuro laboral." },
    { id: "am13", dimension: "Motivacion Extrinseca", text: "Quiero terminar mis estudios para demostrar que soy capaz de lograrlo." },

    // Dimensión 5: Riesgo de Desmotivación
    { id: "am14", dimension: "Riesgo", text: "A veces siento que pierdo el tiempo al venir a clases.", inverted: true },
    { id: "am15", dimension: "Riesgo", text: "Me cuesta encontrar razones para seguir estudiando.", inverted: true },
    { id: "am16", dimension: "Riesgo", text: "Siento que mis esfuerzos en el colegio no sirven de nada.", inverted: true }
];

export const autoestimaMotivaScale = [
    { value: 1, label: "Totalmente en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "Ni acuerdo ni desacuerdo" },
    { value: 4, label: "De acuerdo" },
    { value: 5, label: "Totalmente de acuerdo" }
];

export const autoestimaMotivaDimensions = {
    Autoestima: "Autoestima y Autoconcepto",
    Autorregulacion: "Autorregulación Emocional",
    "Motivacion Intrinseca": "Motivación Intrínseca",
    "Motivacion Extrinseca": "Motivación Extrínseca y Metas",
    Riesgo: "Riesgo de Desmotivación"
};
