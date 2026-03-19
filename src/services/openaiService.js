import OpenAI from 'openai';

// IMPORTANTE: Para que esto funcione, necesitas tu API KEY en un archivo .env
// VITE_OPENAI_API_KEY=tu_llave_aqui

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para demostración local. En producción usa un backend.
});

export const analyzePsychosocialData = async (data, context) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // O gpt-4o si tienes acceso
      messages: [
        { 
          role: "system", 
          content: "Eres un psicólogo educacional experto con 20 años de experiencia en Chile. Analizas datos socioemocionales de colegios CEIA y generas informes ejecutivos de alto impacto." 
        },
        { 
          role: "user", 
          content: `Analiza los siguientes datos del curso ${context}: ${JSON.stringify(data)}. 
          Genera un informe con: 1. Diagnóstico General, 2. Alertas Críticas y 3. Recomendaciones Pedagógicas Concretas.` 
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error en el análisis de IA:", error);
    return "No pude conectar con el cerebro AI. Verifica tu API Key.";
  }
};
