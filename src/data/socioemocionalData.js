export const socioemocionalQuestions = [
    { id: 1, text: "Tengo dificultades para expresar lo que siento", inverted: true, dimension: "GestionEmocional" },
    { id: 2, text: "Suelo hacer cosas sin pensar en las consecuencias", inverted: true, dimension: "GestionEmocional" },
    { id: 3, text: "Prefiero estar solo en lugar de relacionarme con otras personas", inverted: true, dimension: "GestionEmocional" },
    { id: 4, text: "Me resulta difícil encontrar la solución a los problemas que se me presentan", inverted: true, dimension: "GestionEmocional" },
    { id: 5, text: "Me resulta difícil decir lo que pienso", inverted: true, dimension: "GestionEmocional" },
    { id: 6, text: "Me he dado cuenta de que tengo dificultades para expresarme o hablar en público", inverted: true, dimension: "GestionEmocional" },
    { id: 7, text: "Me cuesta acostumbrarme a los lugares nuevos para mí", inverted: true, dimension: "GestionEmocional" },
    { id: 8, text: "Me resulta difícil comprender a las personas y ponerme en su lugar", inverted: true, dimension: "GestionEmocional" },
    { id: 9, text: "Creo que las personas que me conocen no me aprecian demasiado", inverted: true, dimension: "GestionEmocional" },
    { id: 10, text: "Creo que no soy capaz de entender las cosas que siento", inverted: true, dimension: "GestionEmocional" },
    { id: 11, text: "Trabajo concentrado en una tarea hasta completarla", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 12, text: "Me gusta intentar varias veces cuando algo no resulta", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 13, text: "Algo que me gusta hacer es ayudar a otras personas cuando lo necesitan", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 14, text: "Siento que las cosas que me propongo me resultan bien gracias a mis capacidades", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 15, text: "Cuando tengo un problema soy capaz de ver más de una solución", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 16, text: "Cuando hago algo incorrecto me hago responsable de las consecuencias", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 17, text: "Creo que soy una persona valiosa", inverted: false, dimension: "PercepcionAprendizaje" },
    { id: 18, text: "Suelo sentirme feliz", inverted: false, dimension: "InteraccionSocial" },
    { id: 19, text: "Tengo problemas para relacionarme con las personas de mi edad", inverted: true, dimension: "InteraccionSocial" },
    { id: 20, text: "Mis compañeros me consideran como una persona a la que es importante invitar", inverted: false, dimension: "InteraccionSocial" },
    { id: 21, text: "Me gusta participar en actividades como fiestas y reuniones con amigos", inverted: false, dimension: "InteraccionSocial" },
    { id: 22, text: "Me considero una persona alegre", inverted: false, dimension: "InteraccionSocial" },
    { id: 23, text: "Siento vergüenza cuando tengo que hablar con gente de mi edad", inverted: true, dimension: "InteraccionSocial" }
];

export const socioemocionalScale = [
    { value: 1, label: "Nunca" },
    { value: 2, label: "Algunas veces" },
    { value: 3, label: "Casi Siempre" },
    { value: 4, label: "Siempre" }
];

export const socioemocionalDimensions = {
    GestionEmocional: "Gestión y Reconocimiento de Emociones",
    PercepcionAprendizaje: "Percepción sobre el Proceso de Aprendizaje",
    InteraccionSocial: "Interacción Social"
};
