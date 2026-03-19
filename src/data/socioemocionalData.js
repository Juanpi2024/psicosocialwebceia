export const socioemocionalQuestions = [
    // Dimensión Intrapersonal (Aprendizaje Personal)
    { id: 1, text: "¿Me doy cuenta cuando estoy feliz, triste o enojado(a)?", dimension: "Intrapersonal", subdimension: "Conciencia de sí" },
    { id: 2, text: "¿Sé qué cosas me hacen sentir bien y cuáles mal?", dimension: "Intrapersonal", subdimension: "Conciencia de sí" },
    { id: 3, text: "¿Puedo calmarme cuando estoy muy enojado(a)?", dimension: "Intrapersonal", subdimension: "Autorregulación" },
    { id: 4, text: "¿Pienso antes de actuar cuando algo me molesta?", dimension: "Intrapersonal", subdimension: "Autorregulación" },
    { id: 5, text: "Pienso en las consecuencias de mis actos antes de decidir", dimension: "Intrapersonal", subdimension: "Toma de decisiones" },
    { id: 6, text: "Elijo con cuidado a mis amigos y amigas", dimension: "Intrapersonal", subdimension: "Toma de decisiones" },

    // Dimensión Interpersonal (Aprendizaje Comunitario)
    { id: 7, text: "Siento alegría cuando a los(as) demás les pasan cosas buenas", dimension: "Interpersonal", subdimension: "Empatía" },
    { id: 8, text: "Cuando veo que se burlan de mis compañeros y compañeras, intento ayudar", dimension: "Interpersonal", subdimension: "Empatía" },
    { id: 9, text: "Es fácil para mí trabajar con distintos compañeros y compañeras", dimension: "Interpersonal", subdimension: "Colaboración" },
    { id: 10, text: "En el colegio nos motivan a trabajar con diferentes compañeros y compañeras", dimension: "Interpersonal", subdimension: "Colaboración" },

    // Dimensión Ciudadana / Colectiva
    { id: 11, text: "Trato con respeto a las personas que son distintas a mí", dimension: "Ciudadana", subdimension: "Inclusividad" },
    { id: 12, text: "Me gusta compartir con personas distintas a mí", dimension: "Ciudadana", subdimension: "Inclusividad" },
    { id: 13, text: "Acepto a los(as) demás independiente de su apariencia, país de origen, etc.", dimension: "Ciudadana", subdimension: "Inclusividad" },
    { id: 14, text: "Ayudo a que ningún compañero o compañera se sienta solo(a) o excluido(a)", dimension: "Ciudadana", subdimension: "Inclusividad" },
    { id: 15, text: "Dedico tiempo a ayudar a los y las demás", dimension: "Ciudadana", subdimension: "Solidaridad" },
    { id: 16, text: "Comparto mis cosas cuando alguien las necesita", dimension: "Ciudadana", subdimension: "Solidaridad" },
    { id: 17, text: "Escucho a las y los demás cuando tienen un problema", dimension: "Ciudadana", subdimension: "Solidaridad" },

    // Gestión (Percepción del clima y apoyo)
    { id: 18, text: "Las y los profesores se interesan por entender lo que pensamos", dimension: "Gestion", subdimension: "Apoyo" },
    { id: 19, text: "Las y los profesores están dispuestos a escuchar cómo nos sentimos", dimension: "Gestion", subdimension: "Apoyo" },
    { id: 20, text: "En el colegio ayudamos y somos solidarios con las personas que lo necesitan", dimension: "Gestion", subdimension: "Apoyo" },
    { id: 21, text: "Nos enseñan lo importante que es respetar las normas y reglas del colegio", dimension: "Gestion", subdimension: "Convivencia" },
    { id: 22, text: "En el colegio nos enseñan a solucionar nuestros problemas de forma pacífica", dimension: "Gestion", subdimension: "Convivencia" }
];

export const socioemocionalScale = [
    { value: 1, label: "Nunca" },
    { value: 2, label: "Algunas veces" },
    { value: 3, label: "Casi Siempre" },
    { value: 4, label: "Siempre" }
];

export const socioemocionalDimensions = {
    Intrapersonal: "Aprendizaje Personal (Intrapersonal)",
    Interpersonal: "Aprendizaje Comunitario (Interpersonal)",
    Ciudadana: "Aprendizaje Ciudadano (Colectivo)",
    Gestion: "Gestión y Clima Escolar"
};
