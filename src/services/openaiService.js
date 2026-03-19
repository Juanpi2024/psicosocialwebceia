import OpenAI from 'openai';

// Dinamismo total: Usamos la llave del ENV (localhost) o la que el usuario provea en el Dashboard
export const getOpenAIClient = (userKey) => {
  const apiKey = userKey || import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'PON_TU_LLAVE_AQUI_SIN_ESPACIOS' || apiKey.includes('sk-proj')) {
    // Si estamos en build, Vite podría intentar meterla. La bloqueamos si es la de desarrollo duro.
    // Pero si el usuario la pasa por prop, la usamos.
    if (userKey) return new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true });
    return null;
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const analyzePsychosocialData = async (data, context, userKey = null) => {
  try {
    const openai = userKey ? new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true }) : getOpenAIClient();
    
    if (!openai) {
      return "Error: No se ha configurado la API Key de OpenAI. Para la maqueta online, debes ingresarla manualmente.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Eres un psicólogo educacional experto con 20 años de experiencia en Chile. Analizas datos socioemocional de colegios CEIA y generas informes ejecutivos de alto impacto." 
        },
        { 
          role: "user", 
          content: `Analiza los siguientes datos del curso ${context}: ${JSON.stringify(data)}. Genera un informe con: 1. Diagnóstico General, 2. Alertas Críticas y 3. Recomendaciones Pedagógicas.` 
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
